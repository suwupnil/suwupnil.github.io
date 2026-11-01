import { useState } from 'react'
import { PROFILE } from '../data/githubData'
import { playSound } from '../utils/sound'

export default function CoordinatesContact({ activeBiome, soundEnabled }) {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE.email)
    setCopied(true)
    playSound('xp', soundEnabled)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <section id="contact" className="contact-section">
      <div className="section-header">
        <h2 className="mc-section-title">
          <span className="title-icon">🧭</span> F3 DEBUG // COORDINATES & CONTACT
        </h2>
        <span className="section-subtitle">
          Tune your compass to connect with Swapnil
        </span>
      </div>

      <div className="debug-f3-card">
        {/* F3 Overlay Header */}
        <div className="f3-screen-header">
          <span className="f3-tag">MINECRAFT 1.21.4 (Vibe Coded Edition)</span>
          <span className="f3-fps">60 FPS // V-Sync ON</span>
        </div>

        {/* F3 Coordinate Metrics */}
        <div className="f3-lines-grid">
          <div className="f3-line">
            <span className="f3-key">Player:</span>
            <span className="f3-val">{PROFILE.name} &lt;{PROFILE.login}&gt;</span>
          </div>
          <div className="f3-line">
            <span className="f3-key">XYZ:</span>
            <span className="f3-val">X: 2021.000 / Y: 64.000 / Z: 2026.000</span>
          </div>
          <div className="f3-line">
            <span className="f3-key">Biome:</span>
            <span className="f3-val highlight-cyan">minecraft:{activeBiome}</span>
          </div>
          <div className="f3-line">
            <span className="f3-key">Facing:</span>
            <span className="f3-val">north (Towards Next Frontier 🚀)</span>
          </div>
          <div className="f3-line">
            <span className="f3-key">Domain:</span>
            <span className="f3-val highlight-green">{PROFILE.blog}</span>
          </div>
          <div className="f3-line">
            <span className="f3-key">Location:</span>
            <span className="f3-val">{PROFILE.location} 🇮🇳</span>
          </div>
        </div>

        {/* Portals / Contact Buttons */}
        <div className="f3-portals-row">
          <a
            href={PROFILE.html_url}
            target="_blank"
            rel="noreferrer"
            className="mc-button mc-button-secondary"
            onClick={() => playSound('click', soundEnabled)}
          >
            ⚔️ GITHUB @{PROFILE.login}
          </a>
          <a
            href={`https://${PROFILE.blog}`}
            target="_blank"
            rel="noreferrer"
            className="mc-button mc-button-secondary"
            onClick={() => playSound('click', soundEnabled)}
          >
            🌐 {PROFILE.blog}
          </a>
          <button
            className="mc-button mc-button-primary"
            onClick={handleCopyEmail}
          >
            {copied ? '✓ COPIED TO CLIPBOARD!' : `📧 ${PROFILE.email}`}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mc-footer">
        <p className="footer-line">
          Crafted with <span className="footer-heart">❤</span>, pixels & redstone by{' '}
          <a
            href={PROFILE.html_url}
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            {PROFILE.name}
          </a>
        </p>
        <p className="footer-sub">
          Deployed via GitHub Pages • Hosted at {PROFILE.blog} • Version 2026.1
        </p>
      </footer>
    </section>
  )
}
