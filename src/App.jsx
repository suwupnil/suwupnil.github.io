import { useState, useEffect } from 'react'
import FloatingParticles from './components/FloatingParticles'
import AdvancementToast from './components/AdvancementToast'
import MinecraftHUD from './components/MinecraftHUD'
import HeroSection from './components/HeroSection'
import InventorySection from './components/InventorySection'
import SkillsEnchanter from './components/SkillsEnchanter'
import AdvancementsSection from './components/AdvancementsSection'
import CoordinatesContact from './components/CoordinatesContact'
import TerminalConsole from './components/TerminalConsole'
import { playJukeboxTrack, stopJukebox } from './utils/sound'

export default function App() {
  const [activeBiome, setActiveBiome] = useState('overworld')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [activeSlot, setActiveSlot] = useState(1)
  const [chatOpen, setChatOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isJukeboxPlaying, setIsJukeboxPlaying] = useState(false)
  const [jukeboxToast, setJukeboxToast] = useState(false)

  // Global "/" key shortcut to open console
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (e.key === '/') {
        e.preventDefault()
        setChatOpen(true)
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  // Sync active slot on scroll position (1: Hero, 2: Chest, 3: Alchemy, 4: Trophy, 5: F3 Debug)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35
      const heroEl = document.getElementById('hero')
      const invEl = document.getElementById('inventory')
      const skillsEl = document.getElementById('skills')
      const advEl = document.getElementById('advancements')
      const contactEl = document.getElementById('contact')

      if (contactEl && scrollPos >= contactEl.offsetTop) {
        setActiveSlot(5)
      } else if (advEl && scrollPos >= advEl.offsetTop) {
        setActiveSlot(4)
      } else if (skillsEl && scrollPos >= skillsEl.offsetTop) {
        setActiveSlot(3)
      } else if (invEl && scrollPos >= invEl.offsetTop) {
        setActiveSlot(2)
      } else if (heroEl) {
        setActiveSlot(1)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleToggleJukebox = () => {
    const playing = playJukeboxTrack(soundEnabled, () => {
      setIsJukeboxPlaying(false)
      setJukeboxToast(false)
    })
    setIsJukeboxPlaying(playing)
    if (playing) {
      setJukeboxToast(true)
      setTimeout(() => setJukeboxToast(false), 4500)
    } else {
      setJukeboxToast(false)
    }
  }

  const handleStopJukebox = () => {
    stopJukebox()
    setIsJukeboxPlaying(false)
    setJukeboxToast(false)
  }

  const isOverlayOpen = chatOpen || isModalOpen

  return (
    <div className={`app-root biome-${activeBiome}`}>
      {/* Dynamic Background Elements */}
      <div className="mc-pixel-grid-bg" />
      <div className="mc-vignette-overlay" />
      <FloatingParticles biome={activeBiome} />

      {/* Advancement Notification Toast */}
      <AdvancementToast soundEnabled={soundEnabled} />

      {/* Jukebox Music Disc Toast */}
      {jukeboxToast && (
        <div className="jukebox-disc-toast" role="status" onClick={handleStopJukebox}>
          <span className="disc-icon">💿</span>
          <div className="disc-text">
            <span className="disc-sub">Now Playing:</span>
            <span className="disc-title">C418 - "13" (8-Bit Synthesis)</span>
          </div>
          <button className="disc-stop-btn" title="Stop Disc">■</button>
        </div>
      )}

      {/* Main Minecraft HUD Navigation */}
      <MinecraftHUD
        activeBiome={activeBiome}
        setActiveBiome={setActiveBiome}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        activeSlot={activeSlot}
        setActiveSlot={setActiveSlot}
        onOpenChat={() => setChatOpen(true)}
        onToggleJukebox={handleToggleJukebox}
        isJukeboxPlaying={isJukeboxPlaying}
        isOverlayOpen={isOverlayOpen}
      />

      {/* Main Content Area */}
      <main className="main-viewport">
        <HeroSection
          soundEnabled={soundEnabled}
          onOpenChat={() => setChatOpen(true)}
        />
        <InventorySection
          soundEnabled={soundEnabled}
          onModalChange={setIsModalOpen}
        />
        <SkillsEnchanter soundEnabled={soundEnabled} />
        <AdvancementsSection soundEnabled={soundEnabled} />
        <CoordinatesContact
          activeBiome={activeBiome}
          soundEnabled={soundEnabled}
        />
      </main>

      {/* Minecraft Command Console / Chat */}
      <TerminalConsole
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        soundEnabled={soundEnabled}
        setActiveBiome={setActiveBiome}
        onToggleJukebox={handleToggleJukebox}
      />
    </div>
  )
}
