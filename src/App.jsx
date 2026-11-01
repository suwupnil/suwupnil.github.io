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

export default function App() {
  const [activeBiome, setActiveBiome] = useState('overworld')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [activeSlot, setActiveSlot] = useState(1)
  const [chatOpen, setChatOpen] = useState(false)

  // Sync active slot on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200
      const heroEl = document.getElementById('hero')
      const invEl = document.getElementById('inventory')
      const skillsEl = document.getElementById('skills')
      const advEl = document.getElementById('advancements')
      const contactEl = document.getElementById('contact')

      if (contactEl && scrollPos >= contactEl.offsetTop) {
        setActiveSlot(5)
      } else if (advEl && scrollPos >= advEl.offsetTop) {
        setActiveSlot(6)
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

  return (
    <div className={`app-root biome-${activeBiome}`}>
      {/* Dynamic Background Elements */}
      <div className="mc-pixel-grid-bg" />
      <div className="mc-vignette-overlay" />
      <FloatingParticles biome={activeBiome} />

      {/* Advancement Notification Toast */}
      <AdvancementToast soundEnabled={soundEnabled} />

      {/* Main Minecraft HUD Navigation */}
      <MinecraftHUD
        activeBiome={activeBiome}
        setActiveBiome={setActiveBiome}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        activeSlot={activeSlot}
        setActiveSlot={setActiveSlot}
        onOpenChat={() => setChatOpen(true)}
      />

      {/* Main Content Area */}
      <main className="main-viewport">
        <HeroSection
          soundEnabled={soundEnabled}
          onOpenChat={() => setChatOpen(true)}
        />
        <InventorySection soundEnabled={soundEnabled} />
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
      />
    </div>
  )
}
