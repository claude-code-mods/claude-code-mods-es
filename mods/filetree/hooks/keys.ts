import type { RowSpec } from './rows'

export type ShortcutKey = { key: string; label: string; terminal?: true }
export type ShortcutGroup = { title: string; keys: ShortcutKey[] }

const GROUPS: readonly ShortcutGroup[] = [
  {
    title: 'Mover',
    keys: [
      { key: 'j / k', label: 'abajo / arriba' },
      { key: 'h / l', label: 'contraer o ir al padre / expandir' },
      { key: 'o, Enter', label: 'abrir un archivo o alternar una carpeta' },
      { key: 'z', label: 'saltar a una carpeta' },
      { key: 'Space', label: 'Quick Look en macOS', terminal: true },
    ],
  },
  {
    title: 'Buscar',
    keys: [
      { key: 's', label: 'enfocar la búsqueda' },
      { key: 'i', label: 'buscar en la carpeta bajo el cursor' },
      { key: 'c / r', label: 'coincidir mayúsculas / expresión regular' },
      { key: 'q', label: 'buscar contenidos de archivos en lugar de nombres' },
    ],
  },
  {
    title: 'Archivos y acciones',
    keys: [
      { key: 'd', label: 'diff' },
      { key: 'click', label: 'seleccionar una fila' },
      { key: 'ctrl+click', label: 'añadir o quitar una fila; alt+clic en macOS' },
      { key: 'shift+click', label: 'seleccionar el rango desde el ancla' },
      { key: 'shift+j / k', label: 'extender la selección abajo / arriba' },
      { key: 'v / V', label: 'añadir o quitar la fila / limpiar las marcas' },
      { key: 'y / Y', label: 'copiar ruta relativa / absoluta' },
      { key: 'u', label: 'copiar el nombre' },
      { key: 't', label: 'shell en un panel tmux o herdr' },
      { key: 'x', label: "proteger de las ediciones de Claude" },
      { key: 'w', label: 'archivos escritos fuera del repositorio' },
    ],
  },
  {
    title: 'Ver',
    keys: [
      { key: 'p', label: 'vista previa o mapa de árbol', terminal: true },
      { key: 'f / b', label: 'paginar la vista previa', terminal: true },
      { key: '[ / ]', label: 'página anterior / siguiente de PDF o Word', terminal: true },
      { key: 'a', label: 'auto-collapse' },
      { key: 'n / g / m', label: 'ordenar por nombre / git / valor' },
    ],
  },
  {
    title: 'Panel',
    keys: [
      { key: '?', label: 'mostrar u ocultar esta lista', terminal: true },
      { key: 'ctrl+x tab', label: 'dar el teclado al panel', terminal: true },
      { key: 'alt+l', label: 'dar el teclado al árbol', terminal: true },
      { key: 'alt+h', label: 'volver al prompt', terminal: true },
      { key: '/filetree keys', label: 'configurar alt+l y alt+h', terminal: true },
      { key: 'Esc', label: 'volver al prompt', terminal: true },
    ],
  },
]

export const SCROLL_KEYS: ReadonlySet<string> = new Set(['up', 'down', 'j', 'k', 'pageup', 'pagedown', 'f', 'b', 'home', 'end'])

export function shortcutGroups(desktop: boolean): ShortcutGroup[] {
  return GROUPS.map(g => ({ title: g.title, keys: g.keys.filter(k => !desktop || !k.terminal) })).filter(g => g.keys.length > 0)
}

export function shortcutRows(accent: string, muted: string): RowSpec[] {
  const groups = shortcutGroups(false)
  const width = Math.max(...groups.flatMap(g => g.keys.map(k => k.key.length))) + 2
  const rows: RowSpec[] = [{ id: '', left: [{ t: ' Atajos de teclado', b: true, c: accent }], right: [{ t: '? cierra ', c: muted }] }]
  for (const g of groups) {
    rows.push({ id: '', left: [{ t: ' ' }], right: [] })
    rows.push({ id: '', left: [{ t: ` ${g.title}`, b: true }], right: [] })
    for (const k of g.keys) rows.push({ id: '', left: [{ t: `   ${k.key.padEnd(width)}`, c: accent }, { t: k.label }], right: [] })
  }
  return rows
}
