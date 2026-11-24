// ：、、
// （）；／
const TRANSCRIPT_MAX_CHARS = 300_000
const TOOL_INPUT_CHARS = 300
const TOOL_RESULT_CHARS = 500

export const anchorOf = (text: string) => text.replace(/\s+/g, ' ').trim().slice(0, 30)

export type Row = { role: 'user' | 'assistant'; text: string; toolUses: readonly { tool: string; input: Record<string, unknown>; text?: string; isError?: true }[] }
export const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n)}…（\u622a\u77ed，\u539f\u9577 ${s.length} \u5b57）` : s)

// （），；。
// 、；
export function transcriptOf(rows: readonly Row[], anchor: string | undefined) {
  let start = 0
  let found = false
  if (anchor) {
    for (let i = rows.length - 1; i >= 0; i--) {
      const r = rows[i]
      if (r?.role === 'user' && r.text.replace(/\s+/g, ' ').includes(anchor)) { start = i + 1; found = true; break }
    }
  }
  const lines: string[] = []
  for (const r of rows.slice(start)) {
    if (r.role === 'user') { if (r.text.trim()) lines.push(`【\u4f7f\u7528\u8005】${r.text.trim()}`); continue }
    if (r.text.trim()) lines.push(`【\u52a9\u7406】${r.text.trim()}`)
    for (const u of r.toolUses) {
      const out = u.text === undefined ? '' : ` → ${u.isError ? '\u932f\u8aa4：' : ''}${clip(u.text.replace(/\s+/g, ' '), TOOL_RESULT_CHARS)}`
      lines.push(`　〔\u5de5\u5177 ${u.tool}〕${clip(JSON.stringify(u.input), TOOL_INPUT_CHARS)}${out}`)
    }
  }
  let text = lines.join('\n')
  if (text.length > TRANSCRIPT_MAX_CHARS) text = `（\u524d\u9762\u7701\u7565 ${text.length - TRANSCRIPT_MAX_CHARS} \u5b57）\n${text.slice(-TRANSCRIPT_MAX_CHARS)}`
  return { text, found, rows: rows.slice(start) }
}
