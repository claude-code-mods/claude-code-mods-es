// ：，
export const slash = (p: string) => p.replace(/\\/g, '/').replace(/\/+$/, '')

function fnv1aHex(s: string) {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193) >>> 0
  return h.toString(16).padStart(8, '0')
}

//  ASCII （） `-` ；，。
export const encodeProject = (p: string) => {
  const s = slash(p)
  const base = s.replace(/[^A-Za-z0-9]/g, '-')
  return /[\u0080-￿]/.test(s) ? `${base}-${fnv1aHex(s)}` : base
}

export const isAbs = (p: string) => /^[A-Za-z]:\//.test(p) || p.startsWith('/')

//  .  ..（ /）
export function resolveDots(p: string) {
  const parts: string[] = []
  for (const seg of p.split('/')) {
    if (seg === '.') continue
    if (seg === '..') { if (parts.length > 1) parts.pop(); continue }
    parts.push(seg)
  }
  return parts.join('/')
}
