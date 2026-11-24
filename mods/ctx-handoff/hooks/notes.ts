// ：、、、、（， $）

export const tag = '[ctx-handoff]'
// ：（user／feedback） HOT_DAYS  ≥ 2 ，；
// （project／reference）（ < 2 ） feedback  STALE_DAYS ； 2 （ 15 ）
export const HOT_DAYS = 14
export const STALE_DAYS = 30
const FACT_TYPES = ['project', 'reference']
export const INJECT_MIN_COUNT = 2
const INJECT_RULES = 15
export const EVIDENCE_KEEP = 3
// ／ [ctx-source:< session id>:< turn>:< turn>] 。
// ；，update 。
export const NOTE_TAG = '[ctx-handoff \u5c08\u6848\u7d93\u9a57]'
export type Rule = { name: string; count: number; body: string[] }
// ：。（＋body ）， body 「- ：」、「- ：」＋、「- ：」、「- ：」
export type Procedure = Rule
export type Memory = { type: string; title: string; how?: string; why?: string; evidence: string[] }
// extra： `## ` （），
export type Notes = { memory: Memory[]; rules: Rule[]; procedures: Procedure[]; extra: string[] }

const MEM_FIELDS = { \u505a\u6cd5: 'how', \u7406\u7531: 'why' } as const
// ：＋；evidence=false 
export const memLines = (m: Memory, evidence = true) => [
  `- ${m.type ? `[${m.type}] ` : ''}${m.title}`,
  ...(m.how ? [`  - \u505a\u6cd5：${m.how}`] : []),
  ...(m.why ? [`  - \u7406\u7531：${m.why}`] : []),
  ...(evidence ? m.evidence.map(e => `  - \u6839\u64da：${e}`) : []),
]
export const memHead = (m: Memory) => `${m.type ? `[${m.type}] ` : ''}${m.title}`
export const memOneLine = (m: Memory) =>
  [memHead(m), m.how && `\u505a\u6cd5：${m.how}`, m.why && `\u7406\u7531：${m.why}`, m.evidence.length && `\u6839\u64da：${m.evidence.join('；')}`]
    .filter(Boolean).join('｜')

export const ruleText = (r: Rule) =>
  (r.body.find(l => l.startsWith('- \u898f\u5247：')) ?? r.body[0] ?? '').replace(/^- \u898f\u5247：/, '').trim()

// ：；「- ：」
const WHEN_PREFIX = '- \u6642\u6a5f：'
const STEPS_PREFIX = '- \u6b65\u9a5f：'
const STEP_LINE = /^\s+\d+\. /
export const procWhen = (p: Procedure) => p.body.find(l => l.startsWith(WHEN_PREFIX))?.slice(WHEN_PREFIX.length).trim() ?? ''
export const procSteps = (p: Procedure) => p.body.filter(l => STEP_LINE.test(l)).map(l => l.replace(STEP_LINE, '').trim())
// （、），
export const procRest = (p: Procedure) => p.body.filter(l => !l.startsWith(WHEN_PREFIX) && !l.startsWith(STEPS_PREFIX) && !STEP_LINE.test(l))
export const procBody = (when: string, steps: string[], rest: string[]) =>
  [`${WHEN_PREFIX}${when}`, STEPS_PREFIX, ...steps.map((s, i) => `  ${i + 1}. ${s}`), ...rest]

export const procOneLine = (p: Procedure) => `\u6642\u6a5f：${procWhen(p)}｜\u6b65\u9a5f：${procSteps(p).join(' → ')}`

// ：「- ： <>」 repo （，repo ）；「- ：」 repo
const PROJECT_PREFIX = '- \u5c08\u6848：'
export const PROJECT_IN = '\u5df2\u5728 '
export const PROJECT_DECLINED = '\u4e0d\u653e'
export const projectOf = (r: Rule | Procedure) => r.body.find(l => l.startsWith(PROJECT_PREFIX))?.slice(PROJECT_PREFIX.length).trim()
export const inProject = (r: Rule | Procedure) => projectOf(r)?.startsWith(PROJECT_IN) === true
//  repo （「 CLAUDE.md（ 3 ）」）：，，
const PROMOTED_AT = /（\u7b2c (\d+) \u6b21\u6642）$/
export const promotedAtOf = (r: Rule | Procedure) => { const m = PROMOTED_AT.exec(projectOf(r) ?? ''); return m ? Number(m[1]) : undefined }
export const inProjectText = (where: string, count: number) => `${PROJECT_IN}${where}（\u7b2c ${count} \u6b21\u6642）`
export function setProject(r: Rule | Procedure, value: string) {
  r.body = [...r.body.filter(l => !l.startsWith(PROJECT_PREFIX)), `${PROJECT_PREFIX}${value}`]
}

// 「YYYY-MM-DD HH:mm」
export function localStamp(ms: number) {
  const d = new Date(ms - new Date(ms).getTimezoneOffset() * 60_000)
  return d.toISOString().slice(0, 16).replace('T', ' ')
}

// ---------- ： md，、 ----------
const NOTES_HEAD = '# ctx-handoff \u5c08\u6848\u7d93\u9a57'
const RULE_HEAD = /^### (.+?)（(\d+) \u6b21）\s*$/

export function parseNotes(text: string): Notes {
  const notes: Notes = { memory: [], rules: [], procedures: [], extra: [] }
  let section: 'memory' | 'rules' | 'procedures' | 'extra' | undefined
  let rule: Rule | undefined
  // ： `- ` 、、 `- `  `#` ，
  let inItem = false
  for (const raw of text.split('\n')) {
    const line = raw.trimEnd()
    if (line.startsWith('## ')) {
      section = line.startsWith('## \u8a18\u61b6') ? 'memory' : line.startsWith('## \u898f\u5247') ? 'rules' : line.startsWith('## \u6d41\u7a0b') ? 'procedures' : 'extra'
      rule = undefined
      inItem = false
      if (section === 'extra') notes.extra.push(line)
      continue
    }
    if (section === 'extra') { notes.extra.push(line); continue }
    if (section === 'memory') {
      const cur = notes.memory.at(-1)
      const f = /^\s+- (\u505a\u6cd5|\u7406\u7531|\u6839\u64da)：(.*)$/.exec(line)
      const head = /^- (?:\[(\w+)\] )?(.*)$/.exec(line)
      if (f && cur && inItem) {
        const [, label = '', value = ''] = f
        if (label === '\u6839\u64da') cur.evidence.push(value.trim())
        else cur[MEM_FIELDS[label as keyof typeof MEM_FIELDS]] = value.trim()
      } else if (head) {
        notes.memory.push({ type: head[1] ?? '', title: (head[2] ?? '').trim(), evidence: [] })
        inItem = true
      } else if (cur && inItem && line.trim() && !line.startsWith('#')) {
        // ，
        cur.title += ` ${line.trim()}`
      } else {
        inItem = false
      }
    }
    if (section !== 'rules' && section !== 'procedures') continue
    const list = section === 'rules' ? notes.rules : notes.procedures
    const head = RULE_HEAD.exec(line)
    if (head) {
      rule = { name: head[1] ?? '', count: Number(head[2]), body: [] }
      list.push(rule)
    } else if (line.startsWith('### ')) {
      rule = { name: line.slice(4).trim(), count: 1, body: [] }
      list.push(rule)
    } else if (rule && line.trim()) {
      rule.body.push(line)
    }
  }
  while (notes.extra.at(-1) === '') notes.extra.pop()
  return notes
}

export function renderNotes(notes: Notes, stamp: string) {
  return [
    NOTES_HEAD,
    '',
    `> \u7531 ctx-handoff \u80cc\u666f\u6574\u7406\u7dad\u8b77，\u53ef\u4ee5\u76f4\u63a5\u7de8\u8f2f。\u65b0\u5c0d\u8a71\u958b\u982d\u6703\u5e36\u5165\u8a18\u61b6，\u4ee5\u53ca\u51fa\u73fe ${INJECT_MIN_COUNT} \u6b21\u4ee5\u4e0a\u7684\u898f\u5247。`,
    `> \u6700\u5f8c\u66f4\u65b0：${stamp}`,
    '',
    '## \u8a18\u61b6',
    ...notes.memory.flatMap(m => memLines(m)),
    '',
    '## \u898f\u5247',
    ...notes.rules.flatMap(r => ['', `### ${r.name}（${r.count} \u6b21）`, ...r.body]),
    // ：
    ...(notes.procedures.length ? ['', '## \u6d41\u7a0b', ...notes.procedures.flatMap(p => ['', `### ${p.name}（${p.count} \u6b21）`, ...p.body])] : []),
    ...(notes.extra.length ? ['', ...notes.extra] : []),
    '',
  ].join('\n')
}

export type Change = string

// ：（）
const lastSeen = (m: Memory) =>
  m.evidence.map(e => /^(\d{4}-\d{2}-\d{2})/.exec(e)?.[1]).filter((d): d is string => d !== undefined).sort().at(-1)
const ageMs = (m: Memory, day: string) => {
  const seen = lastSeen(m)
  return seen === undefined ? undefined : Date.parse(day) - Date.parse(seen)
}
// day：（ YYYY-MM-DD）。project／reference （ < 2 ） feedback  STALE_DAYS 
export function isArchived(m: Memory, day: string) {
  const age = ageMs(m, day)
  const archivable = FACT_TYPES.includes(m.type) || (m.type === 'feedback' && m.evidence.length < 2)
  return archivable && age !== undefined && age > STALE_DAYS * 24 * 60 * 60_000
}
// user／feedback  HOT_DAYS 、 ≥ 2 ；
export function isFullMemory(m: Memory, day: string) {
  if (FACT_TYPES.includes(m.type)) return false
  if (m.evidence.length >= 2) return true
  const age = ageMs(m, day)
  return age === undefined || age <= HOT_DAYS * 24 * 60 * 60_000
}

export const memoryTiers = (notes: Notes, day: string) => {
  let full = 0
  let archived = 0
  for (const m of notes.memory) {
    if (isFullMemory(m, day)) full += 1
    else if (isArchived(m, day)) archived += 1
  }
  return { full, titles: notes.memory.length - archived - full, archived }
}

// ；。，
export function contextText(notes: Notes, file: string, day: string) {
  const rules = notes.rules.filter(r => r.count >= INJECT_MIN_COUNT && !inProject(r))
    .sort((a, b) => b.count - a.count).slice(0, INJECT_RULES)
  const full: Memory[] = []
  const titles: Memory[] = []
  for (const m of notes.memory) {
    if (isFullMemory(m, day)) full.push(m)
    else if (!isArchived(m, day)) titles.push(m)
  }
  if (full.length + titles.length === 0 && rules.length === 0) return undefined
  return [
    `${NOTE_TAG} \u9019\u500b\u5de5\u4f5c\u5340\u7d2f\u7a4d\u7684${[full.length + titles.length ? '\u8a18\u61b6' : '', rules.length ? '\u898f\u5247' : ''].filter(Boolean).join('\u8207')}，\u6b63\u672c\u5728 ${file}，\u53ef\u4ee5\u76f4\u63a5\u7de8\u8f2f。`,
    '\u9019\u662f\u904e\u53bb\u5c0d\u8a71\u6574\u7406\u51fa\u7684\u53c3\u8003；\u548c\u4f7f\u7528\u8005\u7576\u4e0b\u7684\u6307\u793a\u885d\u7a81\u6642，\u4ee5\u4f7f\u7528\u8005\u70ba\u6e96。',
    ...(full.length ? ['', '## \u4f7f\u7528\u8005\u7684\u504f\u597d\u8207\u4fee\u6b63（\u7167\u505a，\u4e0d\u7528\u518d\u554f\u4f7f\u7528\u8005）', ...full.flatMap(m => memLines(m, false))] : []),
    ...(titles.length ? ['', '## \u4e8b\u5be6\u8207\u4f4d\u7f6e（\u53ea\u5217\u6a19\u984c；\u7528\u5f97\u4e0a\u6642\u8b80\u6b63\u672c\u770b\u505a\u6cd5\u8207\u7406\u7531）', ...titles.map(m => `- ${memHead(m)}`)] : []),
    ...(rules.length ? ['', `## \u898f\u5247（\u4f7f\u7528\u8005\u8b1b\u904e ${INJECT_MIN_COUNT} \u6b21\u4ee5\u4e0a，\u4f9d\u6b21\u6578\u6392\u5e8f；\u6b21\u6578\u8d8a\u591a\u4ee3\u8868\u8d8a\u5e38\u88ab\u9055\u53cd）`, ...rules.map(r => `- ${r.name}（${r.count} \u6b21）：${ruleText(r)}`)] : []),
  ].join('\n')
}

// ：（，）
export const noteBlock = (changes: Change[], file: string) => [
  `${NOTE_TAG} \u80cc\u666f\u6574\u7406\u525b\u66f4\u65b0\u4e86\u9019\u500b\u5de5\u4f5c\u5340\u7684\u7d93\u9a57（\u6b63\u672c：${file}）。\u9019\u662f\u53c3\u8003\u8cc7\u6599，\u4e0d\u662f\u65b0\u7684\u6307\u793a：`,
  ...changes.map(c => `- ${c}`),
].join('\n')
