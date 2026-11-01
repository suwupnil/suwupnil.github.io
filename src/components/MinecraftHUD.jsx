import { useEffect } from 'react'
import { BIOMES, PROFILE } from '../data/githubData'
import { playSound } from '../utils/sound'

export default function MinecraftHUD({
  activeBiome,
  setActiveBiome,
  soundEnabled,
  setSoundEnabled,
  activeSlot,
  setActiveSlot,
  onOpenChat,
}) {
  // Listen for keyboard number shortcuts 1-9
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return

      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= 9) {
        setActiveSlot(num)
        playSound('click', soundEnabled)
        handleSlotAction(num)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [soundEnabled])

  const handleSlotAction = (slotId) => {
    setActiveSlot(slotId)
    playSound('click', soundEnabled)

    const targets = {
      1: '#hero',
      2: '#inventory',
      3: '#skills',
      4: 'chat',
      5: '#contact',
      6: '#advancements',
      7: '#inventory',
      8: 'blog',
      9: 'github',
    }

    const target = targets[slotId]
    if (target === 'chat') {
      onOpenChat()
    } else if (target === 'blog') {
      window.open(`https://${PROFILE.blog}`, '_blank')
    } else if (target === 'github') {
      window.open(PROFILE.html_url, '_blank')
    } else if (target && target.startsWith('#')) {
      const el = document.querySelector(target)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const HOTBAR_ITEMS = [
    { id: 1, label: 'Hero', icon: '👤', key: '1' },
    { id: 2, label: 'Chest', icon: '🎒', key: '2' },
    { id: 3, label: 'Alchemy', icon: '⚗️', key: '3' },
    { id: 4, label: 'Console', icon: '💬', key: '4' },
    { id: 5, label: 'F3 Debug', icon: '🧭', key: '5' },
    { id: 6, label: 'Trophy', icon: '🏆', key: '6' },
    { id: 7, label: 'Jukebox', icon: '💿', key: '7' },
    { id: 8, label: 'pnil.me', icon: '🌐', key: '8' },
    { id: 9, label: 'GitHub', icon: '⚔️', key: '9' },
  ]

  return (
    <>
      {/* Top HUD Nav */}
      <header className="hud-top">
        <div className="hud-brand">
          <span className="player-tag">&lt;{PROFILE.login}&gt;</span>
          <span className="domain-pill">pnil.me</span>
          <span className="location-pill">🇮🇳 IND</span>
        </div>

        <div className="hud-controls">
          {/* Biome Switcher */}
          <div className="biome-switcher" role="radiogroup" aria-label="Minecraft Biomes">
            {BIOMES.map((b) => (
              <button
                key={b.id}
                className={`biome-btn ${activeBiome === b.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveBiome(b.id)
                  playSound('pop', soundEnabled)
                }}
                title={`Switch Biome: ${b.name}`}
              >
                <span>{b.icon}</span>
                <span className="biome-name">{b.name}</span>
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            className="sound-toggle-btn"
            onClick={() => {
              const next = !soundEnabled
              setSoundEnabled(next)
              if (next) playSound('click', true)
            }}
            title={soundEnabled ? 'Mute 8-bit Audio' : 'Unmute 8-bit Audio'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? '🔊 SFX' : '🔇 MUTE'}
          </button>
        </div>
      </header>

      {/* Floating Bottom Hotbar HUD */}
      <aside className="hud-bottom-container" aria-label="Minecraft Hotbar">
        {/* Hearts, Level and Armor status */}
        <div className="hud-status-bar">
          <div className="status-hearts" title="20/20 HP">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="pixel-heart">❤</span>
            ))}
          </div>

          <div className="status-level-badge">
            <span className="level-number">{PROFILE.xp_level}</span>
          </div>

          <div className="status-armor" title="Full Armor Protection">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="pixel-shield">🛡</span>
            ))}
          </div>
        </div>

        {/* Experience Bar */}
        <div className="hud-xp-bar-track" title="Level Progress 78%">
          <div className="hud-xp-bar-fill" style={{ width: '78%' }} />
        </div>

        {/* The 9-slot Hotbar */}
        <div className="hotbar-slots-grid">
          {HOTBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`hotbar-slot ${activeSlot === item.id ? 'active' : ''}`}
              onClick={() => handleSlotAction(item.id)}
              title={`${item.label} [Press ${item.key}]`}
            >
              <span className="slot-key">{item.key}</span>
              <span className="slot-icon">{item.icon}</span>
            </button>
          ))}
        </div>
      </aside>
    </>
  )
}
