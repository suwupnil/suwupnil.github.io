import { PROFILE } from '../data/githubData'
import { playSound } from '../utils/sound'

export default function HeroSection({ soundEnabled, onOpenChat }) {
  const yearsActive = new Date().getFullYear() - new Date(PROFILE.created_at).getFullYear()

  return (
    <section id="hero" className="hero-section">
      <div className="hero-grid">
        {/* Left: Player Avatar & Skin Frame */}
        <div className="hero-avatar-card">
          <div className="avatar-pixel-frame">
            <img
              src={PROFILE.avatar_url}
              alt={PROFILE.name}
              className="player-avatar-img"
              loading="eager"
            />
            <div className="player-badge">LVL {PROFILE.xp_level}</div>
          </div>
          <div className="player-realm-info">
            <span className="realm-tag">📍 {PROFILE.location}</span>
            <span className="gamertag-tag">@{PROFILE.login}</span>
          </div>
        </div>

        {/* Right: Player Profile Info */}
        <div className="hero-info-card">
          <div className="hero-pre-title">
            <span className="blinking-arrow">&gt;</span> PLAYER STATS // OVERWORLD
          </div>
          <h1 className="hero-player-name">{PROFILE.name}</h1>
          <p className="hero-player-title">{PROFILE.title}</p>
          <div className="hero-quote-box">
            <span className="quote-mark">“</span>
            <span className="quote-text">{PROFILE.bio}</span>
            <span className="quote-mark">”</span>
          </div>

          {/* Minecraft Stat Blocks */}
          <div className="hero-stats-row">
            <div className="stat-brick">
              <span className="stat-brick-value">{PROFILE.public_repos}</span>
              <span className="stat-brick-label">REPOS</span>
            </div>
            <div className="stat-brick">
              <span className="stat-brick-value">{PROFILE.followers}</span>
              <span className="stat-brick-label">FOLLOWERS</span>
            </div>
            <div className="stat-brick">
              <span className="stat-brick-value">{yearsActive}+ YRS</span>
              <span className="stat-brick-label">CRAFTING</span>
            </div>
            <div className="stat-brick">
              <span className="stat-brick-value">12★</span>
              <span className="stat-brick-label">TOP STARS</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="hero-actions-row">
            <a
              href="#inventory"
              className="mc-button mc-button-primary"
              onClick={() => playSound('click', soundEnabled)}
            >
              🎒 OPEN CHEST
            </a>
            <button
              className="mc-button mc-button-secondary"
              onClick={() => {
                playSound('click', soundEnabled)
                onOpenChat()
              }}
            >
              💬 CHAT [/]
            </button>
            <a
              href={`https://${PROFILE.blog}`}
              target="_blank"
              rel="noreferrer"
              className="mc-button mc-button-secondary"
              onClick={() => playSound('click', soundEnabled)}
            >
              🌐 PNIL.ME
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
