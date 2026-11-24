import type { Finding, SubjectStatus } from '../types'
import type { ClosedState } from './ledger-close'
import type { ToneName } from './tones'
import type { Look } from './rows'
import { versionLabel } from './banners'
import { shownTabs } from './tabs'

export const FINDING_GROUPS: Record<Finding['kind'], { title: string; mark: string; tone: 'issue' | 'opportunity' }> = {
  issue: { title: 'Issues', mark: '▲', tone: 'issue' },
  opportunity: { title: 'Opportunities', mark: '✦', tone: 'opportunity' },
}

/** The mark a group title on the Asks tab leads with, as a Finds group title leads with its kind's mark. */
export const NEEDS_YOU_MARKS = {
  question: { mark: '?', tone: 'needsYou' },
  task: { mark: '☑', tone: 'tasks' },
} as const

/** A mark's tone on the Status. Null draws it muted. */
export type StatusTone = 'needsYou' | 'done' | 'success' | 'working' | null

export const SUBJECT_MARKS: Record<SubjectStatus, { mark: string; tone: StatusTone }> = {
  working: { mark: '●', tone: 'working' },
  queued: { mark: '○', tone: null },
  'waits-on-other': { mark: '◌', tone: null },
  done: { mark: '✓', tone: 'done' },
  dropped: { mark: '✗', tone: null },
}
/** The mark of an open subject that an open ask holds up, in place of its status's mark, and of a delegate that waits for the person. */
export const HELD_MARK: { mark: string; tone: 'needsYou' } = { mark: '◆', tone: 'needsYou' }

/** The marks a running row cycles through in the text looks, one each `RUNNING_FRAME_MS`. */
export const RUNNING_FRAMES = ['●', '◉', '◎', '◉'] as const

/** The running mark's first frame, which the Codex tab fades instead of cycling the frames. */
export const RUNNING_MARK = RUNNING_FRAMES[0]

/** The mark of a working subject while no turn runs and no child under it works. */
export const IDLE_MARK: { mark: string; tone: StatusTone } = { mark: '◐', tone: 'working' }

export const CLOSED_MARKS: Record<ClosedState, string> = {
  handled: SUBJECT_MARKS.done.mark,
  dismissed: '✕',
  lapsed: SUBJECT_MARKS.dropped.mark,
}

/** A PR row's mark: a review thread that waits on the person, one sent to the agent, a failing check and a cancelled one. */
export const PR_MARKS = {
  waiting: { text: HELD_MARK.mark, tone: 'needsYou' },
  sent: { text: SUBJECT_MARKS.done.mark, tone: 'done' },
  failing: { text: FINDING_GROUPS.issue.mark, tone: 'error' },
  cancelled: { text: '⊘', tone: null },
} as const

/** One mark the legend explains. `isRunning` draws it as the running mark. */
export type LegendEntry = { mark: string; tone: ToneName | null; isRunning: boolean; words: string }

/**
 * The words of the two marks that mean a thing stopped before it finished. The terminal and omp draw both as ⊘, so
 * their Help lines start alike.
 */
const stoppedWords = (what: string) => `Se detuvo antes de terminar: ${what}`

/** Every mark a look draws on a row or a group title, once each, with what it means wherever it appears. */
export const MARK_LEGEND: readonly LegendEntry[] = [
  {
    mark: RUNNING_MARK,
    tone: 'working',
    isRunning: true,
    words: 'Trabajando. Avanza mientras el trabajo se ejecuta o tu mensaje está en camino.',
  },
  { mark: IDLE_MARK.mark, tone: IDLE_MARK.tone, isRunning: false, words: 'Trabajando, con nada en ejecución ahora mismo' },
  { mark: SUBJECT_MARKS.queued.mark, tone: null, isRunning: false, words: 'En cola: aún no ha empezado' },
  {
    mark: SUBJECT_MARKS['waits-on-other'].mark,
    tone: null,
    isRunning: false,
    words: 'Espera algo que no eres tú, como una compilación o una revisión',
  },
  { mark: HELD_MARK.mark, tone: HELD_MARK.tone, isRunning: false, words: 'Te espera a ti' },
  {
    mark: NEEDS_YOU_MARKS.question.mark,
    tone: NEEDS_YOU_MARKS.question.tone,
    isRunning: false,
    words: 'Una pregunta que el agente te hizo',
  },
  {
    mark: NEEDS_YOU_MARKS.task.mark,
    tone: NEEDS_YOU_MARKS.task.tone,
    isRunning: false,
    words: 'Un paso que solo tú puedes hacer',
  },
  { mark: SUBJECT_MARKS.done.mark, tone: 'done', isRunning: false, words: 'Hecho, o entregado al agente' },
  { mark: SUBJECT_MARKS.dropped.mark, tone: null, isRunning: false, words: stoppedWords('trabajo descartado') },
  { mark: CLOSED_MARKS.dismissed, tone: null, isRunning: false, words: 'Descartado por ti' },
  {
    mark: FINDING_GROUPS.issue.mark,
    tone: FINDING_GROUPS.issue.tone,
    isRunning: false,
    words: 'Algo va mal: un problema o una comprobación fallida',
  },
  {
    mark: PR_MARKS.cancelled.text,
    tone: PR_MARKS.cancelled.tone,
    isRunning: false,
    words: stoppedWords('una comprobación cancelada, que necesita otra ejecución'),
  },
  {
    mark: FINDING_GROUPS.opportunity.mark,
    tone: FINDING_GROUPS.opportunity.tone,
    isRunning: false,
    words: 'Oportunidad: algo que podría mejorarse',
  },
]

/**
 * The words of Help. `name` is the control's accessible name and tooltip, since its drawn form is a question mark in
 * every look. `icon` is that mark where a look draws only text. `close` is the control's text while Help shows.
 */
export const HELP_COPY = {
  name: 'Help',
  icon: '?',
  keys: 'Keys',
  indicators: 'Indicators',
  version: 'Inbox',
} as const

/** The words at the right end of Help's Keys title that say which inbox build this is. */
export const helpVersionText = (version: string, isNextBuild: boolean): string =>
  `${HELP_COPY.version} ${versionLabel(version, isNextBuild)}`

export type HelpKey = { keys: string; does: string }

/** The key that presses Undo, which no row's selection holds: a closed row settles and the selection moves on. */
export const UNDO_KEY = 'u'
/** Collapses the selected row, or expands it once collapsed. */
export const COLLAPSE_KEY = 'z'
/**
 * Folds every fold on the tab, or opens every one. It is not Shift+z because the engine binds a hotkey by its letter and
 * ignores Shift, so the terminal cannot tell the two apart.
 */
export const FOLD_ALL_KEY = 'w'

/** The PRs tab's own keys, which `hooks/pr-order.ts:prOrderActions` and `hooks/pr-tab.ts:prClearActions` bind from any row of the tab. */
const PR_TAB_HELP_KEYS: HelpKey[] = [
  { keys: 'g', does: 'En PR, vuelve a clasificar las PR cuando cambie una clasificada' },
  { keys: 'm', does: 'En PR, limpia las PR fusionadas y cerradas' },
]

/**
 * The keys a look's Help lists. Help is one page whatever tab it opened over, and switching tabs closes it. Desktop
 * takes no keys, so its Help lists marks only. Each look binds these keys in its own adapter.
 */
export function helpKeys(look: Look): HelpKey[] {
  const tabKeys = shownTabs()
    .map(t => t.hotkey)
    .join(' ')
  const switchTabs = { keys: tabKeys, does: 'Cambiar de pestaña' }
  const undoKey = { keys: UNDO_KEY, does: 'Deshacer el último cierre' }
  const collapseKey = { keys: COLLAPSE_KEY, does: 'Contraer o expandir la fila seleccionada' }
  const foldAllKey = { keys: FOLD_ALL_KEY, does: 'Plegar todos los bloques de la pestaña, o abrirlos todos' }
  switch (look) {
    case 'desktop':
      return []
    case 'terminal':
      return [
        switchTabs,
        { keys: 'j k', does: 'Seleccionar la fila siguiente o anterior' },
        collapseKey,
        foldAllKey,
        undoKey,
        ...PR_TAB_HELP_KEYS,
        { keys: 'ctrl+x tab', does: 'Mueve el foco a la línea sobre el prompt, luego al panel y luego al prompt' },
      ]
    case 'codex':
      return [
        switchTabs,
        { keys: 'j k ↑ ↓', does: 'Select the next or previous row' },
        collapseKey,
        foldAllKey,
        undoKey,
        ...PR_TAB_HELP_KEYS,
        { keys: '?', does: 'Abrir o cerrar la ayuda' },
        { keys: 'esc', does: 'Cerrar la ayuda, o salir de un campo de respuesta' },
      ]
    case 'omp':
      return [
        { keys: `tab ${tabKeys}`, does: 'Cambiar de pestaña' },
        { keys: '↑ ↓ j k', does: 'Moverse entre filas, o desplazarse una página' },
        { keys: '← →', does: 'Elegir un botón' },
        { keys: '↵', does: 'Pulsar el botón elegido' },
        { keys: 't', does: 'Responder a la fila seleccionada' },
        collapseKey,
        foldAllKey,
        undoKey,
        ...PR_TAB_HELP_KEYS,
        { keys: '?', does: 'Abrir o cerrar la ayuda' },
        { keys: 'esc', does: 'Cerrar la ayuda y luego el panel' },
      ]
    case 'herdr':
      return [
        { keys: '← →', does: 'Cambiar de pestaña' },
        { keys: 'j k', does: 'Seleccionar la fila siguiente o anterior' },
        collapseKey,
        foldAllKey,
        undoKey,
        ...PR_TAB_HELP_KEYS,
        { keys: 'esc', does: "Mover el foco de vuelta al terminal del agente" },
      ]
  }
}
