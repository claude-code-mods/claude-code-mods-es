// ，（， $； store  register.ts）
// （2026-10-14，issue #3）： 100  61 ， repo；
// ，，。
// ：tools/notes.mjs ，，「」
import type { Notes } from './notes'

// known：；dead：
export type Tombstones = { known: string[]; dead: { title: string; at: number }[] }
export const tombKey = (projectKey: string) => `tombstones:${projectKey}`
// ：，（）
export const TOMBSTONE_DAYS = 90
export const TOMBSTONE_MAX = 50

const norm = (s: string) => s.replace(/\s+/g, '').toLowerCase()
export const memTitles = (n: Notes) => n.memory.map(m => m.title)

// ：、；（）；
export function buryMissing(prev: Tombstones | undefined, current: string[], now: number): Tombstones {
  const here = new Set(current.map(norm))
  const dead = (prev?.dead ?? []).filter(d => !here.has(norm(d.title)) && now - d.at < TOMBSTONE_DAYS * 86_400_000)
  const buried = new Set(dead.map(d => norm(d.title)))
  for (const title of prev?.known ?? []) {
    if (here.has(norm(title)) || buried.has(norm(title))) continue
    dead.push({ title, at: now })
    buried.add(norm(title))
  }
  return { known: current, dead: dead.slice(-TOMBSTONE_MAX) }
}

//  add_memory ，（ parseActions ）
export function isBuried(t: Tombstones | undefined, title: string, quoted: boolean) {
  return !quoted && (t?.dead ?? []).some(d => norm(d.title) === norm(title))
}
