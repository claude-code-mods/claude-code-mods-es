import type { Stop } from '../types'
import { capitalized } from './press-labels'
import type { BannerTone } from './tones'

export function groupEmptyText(title: string): string {
  return `No hay ninguna abierta: ${title.toLowerCase()}`
}

/** The message Resume sends after an API error stopped a turn. */
export const RESUME_TEXT = 'Continue'

/** True when Resume can continue past the stop. */
export function isResumable(stop: Stop): boolean {
  return stop.kind === 'api-error'
}

export function stopText(stop: Stop): string {
  switch (stop.kind) {
    case 'sign-in':
      return 'sesión caducada'
    case 'billing':
      return 'problema de facturación'
    case 'usage-limit':
      return 'límite de uso alcanzado'
    default:
      return stop.detail === 'rate_limit'
        ? 'la API está limitando las solicitudes'
        : stop.detail === 'overloaded'
          ? 'la API está sobrecargada'
          : `Error de API (${stop.detail})`
  }
}

export function stopFix(stop: Stop): string {
  switch (stop.kind) {
    case 'sign-in':
      return 'Ejecuta /login y envía un mensaje para reanudar.'
    case 'billing':
      return 'Revisa la facturación en la consola de Claude y luego reanuda.'
    case 'usage-limit':
      return stop.resets ? `Reanuda después de ${stop.resets}.` : 'Reanuda cuando se reinicie el límite.'
    default:
      return 'Envía un mensaje para reanudar.'
  }
}

/** A banner's subject. A look draws a button on the banners that have one: Try again, Resume, Hide demo, Reload. */
export type BannerKind =
  | 'demo'
  | 'update-failed'
  | 'tools-refused'
  | 'read-failed'
  | 'stopped'
  | 'gh-missing'
  | 'gh-signed-out'
  | 'gh-limited'
  | 'gh-failed'
  | 'press-note'
  | 'press-failed'
  | 'hooks-trust'
  | 'server-gone'
  | 'server-load-failed'
  | 'server-builds-differ'
  | 'tab-update-failed'
  | 'herdr-mod-failed'
  | 'herdr-mod-ask'

/**
 * Error: an action failed, the turn stopped, or the inbox cannot do its job until something changes. Warning: part of
 * the inbox is missing or out of date, and it still works. Notice: a fact. Ask: a question the banner's own buttons
 * answer.
 */
const BANNER_TONES: Record<BannerKind, BannerTone> = {
  demo: 'notice',
  'update-failed': 'warning',
  'tools-refused': 'error',
  'read-failed': 'error',
  stopped: 'error',
  'gh-missing': 'warning',
  'gh-signed-out': 'warning',
  'gh-limited': 'warning',
  'gh-failed': 'warning',
  'press-note': 'notice',
  'press-failed': 'error',
  'hooks-trust': 'error',
  'server-gone': 'error',
  'server-load-failed': 'error',
  'server-builds-differ': 'warning',
  'tab-update-failed': 'warning',
  'herdr-mod-failed': 'warning',
  'herdr-mod-ask': 'ask',
}

/** A message about the inbox's own state, or the turn's stop. Each look draws it as a tinted box, the lead in bold. */
export type BannerView = { kind: BannerKind; tone: BannerTone; lead: string; body: string | null }

/** The banner for `text`. Its first sentence is the lead, and the rest is the body. */
export function bannerOf(kind: BannerKind, text: string): BannerView {
  const end = text.indexOf('. ')
  const lead = end < 0 ? text : text.slice(0, end + 1)
  const body = end < 0 ? null : text.slice(end + 2)

  return { kind, tone: BANNER_TONES[kind], lead, body }
}

/** The stop's banner. Its lead is "Stopped", and its body why, with the fix when Resume cannot continue past it. */
export function stopBanner(stop: Stop): BannerView {
  const why = `${capitalized(stopText(stop))}.`

  return {
    kind: 'stopped',
    tone: BANNER_TONES.stopped,
    lead: 'Stopped',
    body: isResumable(stop) ? why : `${why} ${stopFix(stop)}`,
  }
}

/**
 * The banners under the tab bar, in the order every look draws them: the host's own, then a failed update, then the
 * result of a press whose row the tab no longer shows.
 */
export function tabBarBanners(
  host: BannerView[],
  statusError: string | null,
  pressNote: { text: string; isError: boolean } | null,
): BannerView[] {
  return [
    ...host,
    ...(statusError ? [bannerOf('update-failed', statusError)] : []),
    ...(pressNote ? [bannerOf(pressNote.isError ? 'press-failed' : 'press-note', pressNote.text)] : []),
  ]
}

export const DEMO_NOTICE = 'Entradas de ejemplo. Los botones de aquí no envían nada.'
export const READING_TEXT = 'Leyendo la bandeja de entrada…'

/**
 * A checkout that follows the `next` branch can hold this file in each folder a host installs or loads: the repo root,
 * `codex/plugin` and `omp`. Git ignores it, and the Codex and omp installs copy it.
 */
export const NEXT_BUILD_MARK = '.next-build'

export function versionLabel(version: string, isNextBuild: boolean): string {
  return isNextBuild ? `v${version} · next` : `v${version}`
}

/** What the band and an empty Asks tab read when nothing waits on the person. */
export const NOTHING_NEEDED_TEXT = 'Nada necesario'

/** What the band, the Herdr line and an empty tab read in place of "Nothing needed" while rows may be missing. */
export const MAYBE_STALE_TEXT = 'Puede estar desactualizado'
