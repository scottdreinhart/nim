// Platform contracts and detection
export * from './platform'

// Infrastructure services
export { load, save, remove, clear } from './storage'
export { crashLogger } from './diagnostics'
export { haptics } from './haptics'
export { playSelect, playConfirm, playCpuMove, playWin, playLose, playClick } from './audio'
