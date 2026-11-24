// ctx-handoff  $.state （session ，）：
export type PanelTab = 'guard' | 'memory' | 'rules' | 'distill' | 'settings'

export type PanelGuard = {
  id: number; rule: string; tool: string; match: string; unless?: string; message: string
  mode: 'deny' | 'remind'; state: 'proposed' | 'on' | 'off'; hits: number
  // （）
  recent?: string[]
  replay?: { hits: number; calls: number }
  bad?: string; good?: string
  project?: string
}

// ：、、、、；，
export type PanelData = {
  background?: { paused: boolean; lines: string[]; details?: string[] }
  file: string
  guards: PanelGuard[]
  candidates: number
  lastDistill?: { at: string; why: string; changes: string[] }
  // head：[] ；detail：、、（）
  memory: { head: string; detail: string[] }[]
  memoryTotal: number
  //  staleDays 、（[] ）
  archived: string[]
  staleDays: number
  // project：「 <>」「」
  rules: { name: string; count: number; project?: string }[]
  procedures: { name: string; count: number; project?: string }[]
  settings: PanelSetting[]
}

// ：；source ；shown  auto 
export type PanelSetting = {
  key: string; kind: 'num' | 'bool' | 'choice'; value: number | boolean | string
  source: 'panel' | 'file' | 'default'; shown?: string
}

// 
export type PanelUi = {
  open: boolean
  tab: PanelTab
  // （m:<>／g<>／changes）
  expanded: string[]
  suggesting: boolean
  // （m:<>／r:<>／p:<>）
  confirming?: string
  // 
  note?: string
}

// ：（clock ）；
export type IdleState = { due: number; refreshes: number }
export type AwayControl = { sid: string; paused: boolean }

declare module 'claude-code' {
  interface PluginState {
    'ctx-handoff': { panelUi: PanelUi; panelData: PanelData | null; idle: IdleState | null; awayControl: AwayControl | null }
  }
}
