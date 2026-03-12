import { selectMove } from '@/domain/ai'

self.onmessage = (e: MessageEvent) => {
  const { state } = e.data
  if (!state) {
    return
  }
  const move = selectMove(state)
  self.postMessage({ move })
}

export {}
