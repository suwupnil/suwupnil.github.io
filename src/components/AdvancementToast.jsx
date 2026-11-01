import { useState, useEffect } from 'react'
import { playSound } from '../utils/sound'

export default function AdvancementToast({ soundEnabled }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show toast after slight delay on initial load
    const timer = setTimeout(() => {
      setVisible(true)
      playSound('xp', soundEnabled)
    }, 1200)

    const hideTimer = setTimeout(() => {
      setVisible(false)
    }, 7500)

    return () => {
      clearTimeout(timer)
      clearTimeout(hideTimer)
    }
  }, [soundEnabled])

  if (!visible) return null

  return (
    <div
      className="advancement-toast"
      onClick={() => {
        playSound('click', soundEnabled)
        setVisible(false)
      }}
      role="alert"
      title="Click to dismiss"
    >
      <div className="advancement-icon">🏆</div>
      <div className="advancement-text">
        <span className="advancement-heading">Advancement Made!</span>
        <span className="advancement-title">The Next Generation</span>
        <span className="advancement-sub">Discovered Swapnil's World @ pnil.me</span>
      </div>
      <button className="advancement-close" aria-label="Close">✕</button>
    </div>
  )
}
