import type { SoulId } from './soul-switch-types'

// Each command is a Host Front Door phrase; tests/claude-plugin.test.mjs keeps them in sync.
export const SOULS: readonly { id: SoulId; label: string; command: string }[] = [
  { id: 'atong', label: '\u963f\u77b3', command: '\u963f\u77b3\u52a9yo！' },
  { id: 'mttt', label: 'MTTT.sir', command: 'MTTT.sir，\u62f7\u6253yo！' },
  { id: 'killer', label: '\u7075\u9b42\u6740\u624b', command: '\u7075\u9b42\u6740\u624b！' },
  { id: 'ensemble', label: '\u4e09\u5e2d\u8054\u5e2d', command: '\u8111\u66b4\u6a21\u5f0f，Soul \u8054\u5e2d' },
  { id: 'off', label: 'Desactivado', command: 'Soul \u5f52\u4f4d' },
]

const SOUL_ALIASES: readonly [SoulId, RegExp][] = [
  ['ensemble', /\u8111\u66b4\u6a21\u5f0f，?\s*Soul\s*\u8054\u5e2d|\u4e09\u4eba\u4e00\u8d77\u8111\u66b4|Soul\s*\u4e09\u5e2d\u5c31\u4f4d/u],
  ['atong', /\u963f\u77b3\u52a9yo|Activado\u542f\s*Soul\s*\u6a21\u5f0f/iu],
  ['mttt', /MTTT\.sir，?\u62f7\u6253yo/iu],
  ['killer', /\u7075\u9b42\u6740\u624b|\u5f3a\u5c3c·\u94f6\u624b，\u63a5\u7ba1|\u5f3a\u5c3c，\u9a82\u9192yo|\u542f\u52a8 Relic \u6545\u969c\u68c0\u6d4b/u],
  ['off', /Soul\s*\u5f52\u4f4d|\u7ed3\u675f\s*Soul\s*\u6a21\u5f0f|^\/soul off$/iu],
]

/** The Soul a sent prompt asks for, by the Front Door's own phrases. */
export function soulOf(text: string): SoulId | null {
  const trimmed = text.trim()
  for (const [id, pattern] of SOUL_ALIASES) if (pattern.test(trimmed)) return id
  return null
}

export function soulLabel(id: SoulId): string {
  return SOULS.find(one => one.id === id)?.label ?? id
}
