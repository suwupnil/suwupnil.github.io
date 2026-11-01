import { useState } from 'react'
import { LANGUAGES } from '../data/githubData'
import { playSound } from '../utils/sound'

export default function SkillsEnchanter({ soundEnabled }) {
  const [activeLang, setActiveLang] = useState(null)
  const [lapisPower, setLapisPower] = useState(64)

  const handleEnchant = (lang) => {
    setActiveLang(lang)
    setLapisPower((prev) => (prev > 1 ? prev - 1 : 64))
    playSound('xp', soundEnabled)
  }

  return (
    <section id="skills" className="skills-section">
      <div className="section-header">
        <h2 className="mc-section-title">
          <span className="title-icon">⚗️</span> ENCHANTING TABLE // CODE MASTERY
        </h2>
        <span className="section-subtitle">
          Language proficiency distilled from thousands of code lines
        </span>
      </div>

      <div className="enchanter-container">
        {/* Enchanting Table Header */}
        <div className="enchanter-hud-row">
          <div className="enchant-glyph-banner">
            <span className="glyph-rune">᚛᚛᚛</span>
            <span className="glyph-text">᚛ ᚠᚢᚦᚨᚱᚲ // KNOWLEDGE MATRIX ᚜</span>
            <span className="glyph-rune">᚜᚜᚜</span>
          </div>
          <div className="lapis-counter" title="Lapis Lazuli supply">
            <span className="lapis-icon">🔷</span>
            <span className="lapis-amount">{lapisPower} LAPIS</span>
          </div>
        </div>

        {/* Language Enchantment Slates */}
        <div className="languages-grid">
          {LANGUAGES.map((lang) => {
            const isSelected = activeLang?.name === lang.name
            return (
              <div
                key={lang.name}
                className={`language-card ${isSelected ? 'enchanted' : ''}`}
                onClick={() => handleEnchant(lang)}
                role="button"
                tabIndex={0}
                title="Click to enchant with XP"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEnchant(lang)
                }}
              >
                <div className="lang-header">
                  <span className="lang-icon">{lang.icon}</span>
                  <div className="lang-names">
                    <span className="lang-title">{lang.name}</span>
                    <span className="lang-enchant-name">{lang.enchant}</span>
                  </div>
                  <span className="lang-pct" style={{ color: lang.color }}>
                    {lang.pct}%
                  </span>
                </div>

                {/* Minecraft Styled XP Progress Bar */}
                <div className="mc-xp-track">
                  <div
                    className="mc-xp-fill"
                    style={{
                      width: `${lang.pct}%`,
                      backgroundColor: lang.color,
                    }}
                  />
                </div>

                <div className="lang-footer">
                  <span className="lang-bytes">
                    {(lang.bytes / 1024).toFixed(1)} KB code
                  </span>
                  <span className="lang-cost">⚡ Cost: 3 XP</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Enchantment Lore Box */}
        {activeLang && (
          <div className="active-enchantment-box">
            <div className="enchant-banner">
              ✨ Enchantment applied to <strong>{activeLang.name}</strong>!
            </div>
            <p className="enchant-lore">
              Infused with {activeLang.enchant}. Optimized for performance, clarity, and rapid shipping.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
