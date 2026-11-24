import { blockRemoteDeferred } from './remote-command-state'
import type { RemoteCommandRecord, Session } from '../types'
import type { RowPress } from './presses'
import type { PressHost, PressOutcome } from './host-press'
import { press } from './host-press'
import { NO_HOLDS } from './timing'

export type RemoteCommand = {
  format: 2
  kind: 'command'
  id: string
  session: string
  issuedAt: number
  expected: string
  press: RowPress
}

const LIFETIME_MS = 24 * 60 * 60_000
const MAX_COMMANDS = 128
const MAX_COMMAND_BYTES = 128_000
const OUTCOME_RESERVE_BYTES = 4096

function newRevision(host: Pick<PressHost<Session>, 'newId'>): string {
  const id = host.newId()
  if (!/^[\w-]{1,128}$/.test(id)) throw new Error('La revisión del comando no es válida.')
  return id
}

export function remoteRowVersion(s: Session, id: string): string {
  if (id === 'goal') {
    const overview = s.ledger.overview
    return JSON.stringify([
      overview?.goal ?? null,
      overview?.goalRemoved ?? null,
      overview?.suggestedGoal ?? null,
      s.lastActions[id] ?? null,
    ])
  }
  const item = s.ledger.items.find(row => row.id === id)
  const normalized = item && Object.fromEntries(Object.entries(item).filter(([key]) => key !== 'dialog'))
  return JSON.stringify([
    normalized ?? null,
    s.ledger.findings.find(row => row.id === id) ?? null,
    s.ledger.closed.find(row => row.id === id) ?? null,
    s.ledger.closedFindings.find(row => row.id === id) ?? null,
    s.lastActions[id] ?? null,
  ])
}

async function digestText(text: string): Promise<string> {
  const subtle = crypto.subtle
  if (!('digest' in subtle) || typeof subtle.digest !== 'function')
    throw new Error('Este host no puede calcular el hash de comandos remotos.')
  const bytes: unknown = await subtle.digest('SHA-256', new TextEncoder().encode(text))
  if (!(bytes instanceof ArrayBuffer)) throw new Error('El host devolvió un hash de comando no válido.')
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('')
}

export async function remoteRowDigest(s: Session, id: string): Promise<string> {
  const row = JSON.parse(remoteRowVersion(s, id))
  const canonical = JSON.stringify(row, (_key, value) =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map(key => [key, value[key]]),
        )
      : value,
  )
  return `row-sha256-v1:${await digestText(canonical)}`
}

async function matchesRow(s: Session, command: RemoteCommand): Promise<boolean> {
  return (
    command.expected === remoteRowVersion(s, command.press.id) ||
    command.expected === (await remoteRowDigest(s, command.press.id))
  )
}

async function requireDurableCommand<S extends Session>(
  host: Pick<PressHost<S>, 'readDurable'>,
  id: string,
  expected: RemoteCommandRecord,
  floor: number,
): Promise<void> {
  if (!host.readDurable) throw new Error('Este host no puede confirmar los comandos guardados.')
  const durable = await host.readDurable()
  const saved = durable.remoteCommands[id]
  if (!saved || JSON.stringify(saved) !== JSON.stringify(expected) || (durable.remoteCommandFloor ?? 0) < floor)
    throw new Error('No se pudo confirmar que el comando se guardó. No se envió nada.')
}

const rejected = (error: string): PressOutcome => ({
  copy: null,
  error,
  note: null,
  isUnconfirmed: true,
  isRowFailed: false,
  wakesAfterSettle: false,
})

export const REMOTE_ACTIONS: readonly RowPress['action'][] = [
  'type',
  'answer',
  'done',
  'address',
  'undo',
  'dismiss',
  'discuss',
  'explain',
  'compare',
  'issue',
  'discard',
  'remove-goal',
  'restore-goal',
  'take-goal',
]

export function supportsRemotePress(p: Pick<RowPress, 'action'>): boolean {
  return REMOTE_ACTIONS.includes(p.action)
}

function isUnresolved(c: RemoteCommandRecord): boolean {
  return (
    c.state === 'accepted' ||
    c.state === 'attempting' ||
    (c.state === 'uncertain' && !c.delivered) ||
    (c.state === 'applied' && !c.delivered && (c.pendingDelivery === true || c.deliveryId !== null))
  )
}

function issuedAt(id: string, c: RemoteCommandRecord): number {
  const at = c.issuedAt ?? Number.parseInt(id.split('-')[0]!, 36)
  if (!Number.isSafeInteger(at) || at < 0) throw new Error('La hora del comando guardado no es válida.')
  return at
}

function fits(commands: Record<string, RemoteCommandRecord>): boolean {
  const count = Object.keys(commands).length
  return (
    count <= MAX_COMMANDS &&
    new TextEncoder().encode(JSON.stringify(commands)).byteLength + count * OUTCOME_RESERVE_BYTES <= MAX_COMMAND_BYTES
  )
}

export async function applyRemoteCommand<S extends Session>(
  host: PressHost<S>,
  command: RemoteCommand,
  sessionId: string,
): Promise<PressOutcome> {
  if (
    !Number.isSafeInteger(command.issuedAt) ||
    command.issuedAt < 0 ||
    !/^[a-z0-9]{1,12}-[a-zA-Z0-9_-]{16,100}$/.test(command.id)
  )
    return rejected('La identidad o la hora del comando no es válida.')
  if (!host.readDurable || command.session !== sessionId)
    return rejected('Este comando pertenece a otra sesión o no se puede guardar.')
  const now = await host.now()
  const time = Number.parseInt(command.id.split('-')[0]!, 36)
  const validTime =
    time === command.issuedAt && command.issuedAt <= now + 30_000 && now - command.issuedAt < LIFETIME_MS
  const rawPayload = JSON.stringify([command.session, command.issuedAt, command.expected, command.press])
  const fields = Object.fromEntries(Object.entries(command.press).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
  const canonical = JSON.stringify([command.session, command.issuedAt, command.expected, fields])
  const payload = `sha256-v1:${await digestText(canonical)}`
  const revision = newRevision(host)
  let admitted = false
  let conflict: string | null = null
  const claimed = await host.update(async s => {
    admitted = false
    conflict = null
    const existing = s.remoteCommands[command.id]
    if (existing) {
      const same = existing.payload === payload || existing.payload === rawPayload
      if (!same) conflict = 'Esta identidad de comando ya nombra una acción distinta.'
      if (same && existing.state === 'accepted' && !validTime)
        return {
          ...s,
          remoteCommands: {
            ...s.remoteCommands,
            [command.id]: { ...existing, state: 'expired', error: 'Esta solicitud caducó antes de ejecutarse.', revision },
          },
        }
      admitted = same && existing.state === 'accepted'
      return s
    }
    let floor = s.remoteCommandFloor ?? 0
    if (!Number.isSafeInteger(floor) || floor < 0) throw new Error('El límite del comando guardado no es válido.')
    const kept = { ...s.remoteCommands }
    const drop = (id: string) => {
      const record = kept[id]!
      const at = issuedAt(id, record)
      const retiredAt = record.timeWasValid === false ? Math.min(Math.floor(record.acceptedAt), at) : at
      floor = Math.max(floor, retiredAt)
      delete kept[id]
    }
    for (const [id, c] of Object.entries(kept)) {
      const isRefusal = c.state === 'refused' || c.state === 'expired'
      if (isRefusal || (!isUnresolved(c) && now - c.acceptedAt >= LIFETIME_MS)) drop(id)
    }
    const expired = !validTime || command.issuedAt <= floor
    const supported = supportsRemotePress(command.press)
    const stale = !expired && supported && !(await matchesRow(s, command))
    const record: RemoteCommandRecord = {
      payload,
      timeWasValid: validTime,
      issuedAt: command.issuedAt,
      acceptedAt: now,
      revision,
      state: expired ? 'expired' : !supported ? 'refused' : stale ? 'stale' : 'accepted',
      error: expired
        ? 'Esta solicitud está fuera del historial conservado. No se puede confirmar la entrega.'
        : !supported
          ? 'Esta acción remota no es compatible.'
          : stale
            ? 'This item changed before the action.'
            : null,
      row: command.press.id,
      deliveryId: null,
      delivered: false,
    }
    const evictable = Object.entries(kept)
      .filter(([, c]) => !isUnresolved(c))
      .sort((a, b) => issuedAt(a[0], a[1]) - issuedAt(b[0], b[1]))
    while (!fits({ ...kept, [command.id]: record }) && evictable.length) drop(evictable.shift()![0])
    if (command.issuedAt <= floor) {
      record.state = 'expired'
      record.error = 'This request is outside retained history. Delivery cannot be confirmed.'
    } else if (!fits({ ...kept, [command.id]: record }) && record.state !== 'expired') {
      record.state = 'refused'
      record.error = 'Hay demasiadas acciones esperando confirmación. Tu respuesta se conserva.'
    }
    if (record.state === 'refused' || record.state === 'expired') {
      if (new TextEncoder().encode(JSON.stringify(record)).byteLength > OUTCOME_RESERVE_BYTES)
        throw new Error('El rechazo no cabe en el espacio reservado del recibo.')
    }
    admitted = record.state === 'accepted'
    return { ...s, remoteCommandFloor: floor, remoteCommands: { ...kept, [command.id]: record } }
  })
  if (conflict) return rejected(conflict)
  const record = claimed.remoteCommands[command.id]
  if (!record) return rejected('El comando no fue aceptado.')
  await requireDurableCommand(host, command.id, record, claimed.remoteCommandFloor ?? 0)
  if (!admitted)
    return {
      ...rejected(record.error ?? 'Este comando ya fue aceptado; se conserva su resultado.'),
      note: record.state === 'stale' ? 'stale' : null,
    }
  const executionRevision = newRevision(host)
  let executing = false
  const execution = await host.update(s => {
    executing = s.remoteCommands[command.id]?.state === 'accepted'
    if (!executing) return s
    return {
      ...s,
      remoteCommands: {
        ...s.remoteCommands,
        [command.id]: { ...s.remoteCommands[command.id]!, revision: executionRevision, state: 'attempting' },
      },
    }
  })
  if (!executing) return rejected('Este comando ya está en ejecución o su resultado es incierto.')
  await requireDurableCommand(
    host,
    command.id,
    execution.remoteCommands[command.id]!,
    execution.remoteCommandFloor ?? 0,
  )
  let started = false
  const durableHost: PressHost<S> = {
    ...host,
    update: async change => {
      const nextRevision = newRevision(host)
      const changed = await host.update(async s => {
        if (!started && !(await matchesRow(s, command))) throw new Error('This item changed before the action.')
        const next = await change(s)
        return {
          ...next,
          heldRows: s.heldRows,
          shownSince: s.shownSince,
          remoteCommands: {
            ...next.remoteCommands,
            [command.id]: { ...next.remoteCommands[command.id]!, revision: nextRevision, state: 'attempting' },
          },
        }
      })
      await requireDurableCommand(
        host,
        command.id,
        changed.remoteCommands[command.id]!,
        changed.remoteCommandFloor ?? 0,
      )
      started = true
      return changed
    },
  }
  let outcome: PressOutcome
  try {
    outcome = await press(durableHost, command.press, false, { ...NO_HOLDS, shownSince: now }, command.id)
  } catch (error) {
    outcome = rejected(error instanceof Error ? error.message : 'El resultado del comando es incierto.')
  }
  const finalRevision = newRevision(host)
  const result = await host.update(s => ({
    ...(outcome.error || outcome.isUnconfirmed
      ? blockRemoteDeferred(s, command.id, 'No se pudo confirmar que esta acción se guardó.')
      : s),
    remoteCommands: {
      ...s.remoteCommands,
      [command.id]: {
        ...s.remoteCommands[command.id]!,
        revision: finalRevision,
        state: outcome.isUnconfirmed
          ? 'uncertain'
          : outcome.error
            ? 'failed'
            : outcome.note === 'stale'
              ? 'stale'
              : 'applied',
        error: outcome.error?.slice(0, 256) ?? null,
      },
    },
  }))
  await requireDurableCommand(host, command.id, result.remoteCommands[command.id]!, result.remoteCommandFloor ?? 0)
  return outcome
}
