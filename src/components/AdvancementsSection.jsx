import { ADVANCEMENTS } from '../data/githubData'
import { playSound } from '../utils/sound'

export default function AdvancementsSection({ soundEnabled }) {
  return (
    <section id="advancements" className="advancements-section">
      <div className="section-header">
        <h2 className="mc-section-title">
          <span className="title-icon">🏆</span> ADVANCEMENTS
        </h2>
        <span className="section-subtitle">
          Milestones unlocked along Swapnil's engineering journey
        </span>
      </div>

      <div className="advancements-grid">
        {ADVANCEMENTS.map((adv) => (
          <div
            key={adv.id}
            className="advancement-card"
            onClick={() => playSound('pop', soundEnabled)}
          >
            <div className="adv-frame">
              <span className="adv-icon">{adv.icon}</span>
            </div>
            <div className="adv-info">
              <div className="adv-header">
                <span className="adv-title">{adv.title}</span>
                <span className="adv-status">✓ UNLOCKED</span>
              </div>
              <p className="adv-desc">{adv.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
