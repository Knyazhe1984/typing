import { useSettings } from '../store/settings'

export type SoundKind = 'key' | 'error' | 'success' | 'fail' | 'star' | 'achievement'

let ctx: AudioContext | undefined

function audio(): AudioContext | undefined {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return undefined
  }
}

/** Короткий тон с плавным затуханием, чтобы не было щелчков. */
function tone(
  ac: AudioContext,
  freq: number,
  start: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'sine',
  endFreq?: number,
) {
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, start + duration)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(gain).connect(ac.destination)
  osc.start(start)
  osc.stop(start + duration + 0.02)
}

const notes = { C5: 523.25, E5: 659.25, G5: 783.99, C6: 1046.5, E6: 1318.5 }

/** Звуки синтезируются на лету — никаких аудиофайлов. Учитывает настройку «Звуки». */
export function play(kind: SoundKind) {
  const { sound, keyClicks } = useSettings.getState()
  if (!sound || (kind === 'key' && !keyClicks)) return
  const ac = audio()
  if (!ac) return
  const t = ac.currentTime
  switch (kind) {
    case 'key':
      tone(ac, 1800, t, 0.025, 0.03, 'square', 1200)
      break
    case 'error':
      tone(ac, 220, t, 0.14, 0.12, 'sine', 150)
      break
    case 'success':
      ;[notes.C5, notes.E5, notes.G5].forEach((f, i) =>
        tone(ac, f, t + i * 0.09, 0.22, 0.12, 'triangle'),
      )
      break
    case 'fail':
      ;[notes.G5, notes.E5].forEach((f, i) => tone(ac, f, t + i * 0.12, 0.25, 0.1, 'triangle'))
      break
    case 'star':
      tone(ac, notes.E6, t, 0.25, 0.08, 'sine')
      break
    case 'achievement':
      ;[notes.C5, notes.E5, notes.G5, notes.C6].forEach((f, i) =>
        tone(ac, f, t + i * 0.08, 0.3, 0.1, 'triangle'),
      )
      break
  }
}
