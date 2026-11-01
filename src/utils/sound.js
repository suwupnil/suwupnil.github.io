// 8-bit Retro Audio Synthesizer (Web Audio API)
// Zero external files, 100% self-contained & lightweight

let audioCtx = null
let currentJukeboxNodes = []
let jukeboxTimer = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export const playSound = (type, enabled = true) => {
  if (!enabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime

  switch (type) {
    case 'click': {
      // Crisp Minecraft wooden click / hotbar select
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(320, now)
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.04)

      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.04)
      break
    }

    case 'xp': {
      // Iconic Minecraft XP orb chime: high bright dual tone
      const notes = [987.77, 1318.51] // B5 -> E6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        const start = now + idx * 0.04
        osc.frequency.setValueAtTime(freq, start)

        gain.gain.setValueAtTime(0.12, start)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.1)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(start)
        osc.stop(start + 0.1)
      })
      break
    }

    case 'levelUp': {
      // Minecraft Level Up Fanfare: ascending arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        const start = now + idx * 0.06
        osc.frequency.setValueAtTime(freq, start)

        gain.gain.setValueAtTime(0.15, start)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(start)
        osc.stop(start + 0.18)
      })
      break
    }

    case 'chest': {
      // Minecraft chest open resonance
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(220, now)
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08)

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.1)
      break
    }

    case 'pop': {
      // Item pop / chat message sound
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05)

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.05)
      break
    }

    default:
      break
  }
}

export const stopJukebox = () => {
  if (jukeboxTimer) {
    clearTimeout(jukeboxTimer)
    jukeboxTimer = null
  }
  currentJukeboxNodes.forEach((node) => {
    try {
      node.stop()
      node.disconnect()
    } catch (_) {}
  })
  currentJukeboxNodes = []
}

export const isJukeboxPlaying = () => currentJukeboxNodes.length > 0

export const playJukeboxTrack = (enabled = true, onEnded = null) => {
  if (!enabled) return false
  if (isJukeboxPlaying()) {
    stopJukebox()
    playSound('pop', enabled)
    if (onEnded) onEnded()
    return false
  }

  const ctx = getAudioContext()
  if (!ctx) return false

  stopJukebox()
  const now = ctx.currentTime

  // Nostalgic Minecraft C418-inspired chiptune melody (Subwoofer Lullaby / Sweden vibes)
  // [frequency, timeOffset, duration]
  const melody = [
    [523.25, 0.0, 0.28], // C5
    [587.33, 0.3, 0.28], // D5
    [659.25, 0.6, 0.28], // E5
    [783.99, 0.9, 0.45], // G5
    [659.25, 1.4, 0.28], // E5
    [523.25, 1.7, 0.55], // C5
    [440.00, 2.3, 0.28], // A4
    [523.25, 2.6, 0.28], // C5
    [587.33, 2.9, 0.55], // D5
    [493.88, 3.5, 0.55], // B4
    [523.25, 4.1, 0.70], // C5
  ]

  const bass = [
    [261.63, 0.0, 1.2], // C4
    [220.00, 1.3, 1.0], // A3
    [174.61, 2.3, 1.2], // F3
    [196.00, 3.5, 1.3], // G3
  ]

  melody.forEach(([freq, offset, dur]) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, now + offset)

    gain.gain.setValueAtTime(0.001, now + offset)
    gain.gain.linearRampToValueAtTime(0.12, now + offset + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + dur)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now + offset)
    osc.stop(now + offset + dur)
    currentJukeboxNodes.push(osc)
  })

  bass.forEach(([freq, offset, dur]) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now + offset)

    gain.gain.setValueAtTime(0.001, now + offset)
    gain.gain.linearRampToValueAtTime(0.07, now + offset + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + dur)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now + offset)
    osc.stop(now + offset + dur)
    currentJukeboxNodes.push(osc)
  })

  jukeboxTimer = setTimeout(() => {
    currentJukeboxNodes = []
    if (onEnded) onEnded()
  }, 4900)

  return true
}
