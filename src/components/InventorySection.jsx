import { useState, useEffect } from 'react'
import { PROJECTS } from '../data/githubData'
import { playSound } from '../utils/sound'

export default function InventorySection({ soundEnabled, onModalChange }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)
  const [hoveredProject, setHoveredProject] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const filteredProjects =
    activeCategory === 'all'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory)

  // Manage Escape key and body scroll lock when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
      if (onModalChange) onModalChange(true)

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          closeInspector()
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
        if (onModalChange) onModalChange(false)
      }
    } else {
      document.body.style.overflow = ''
      if (onModalChange) onModalChange(false)
    }
  }, [selectedProject, onModalChange])

  const handleMouseMove = (e) => {
    setTooltipPos({ x: e.clientX, y: e.clientY })
  }

  const openInspector = (project) => {
    setSelectedProject(project)
    playSound('chest', soundEnabled)
  }

  const closeInspector = () => {
    setSelectedProject(null)
    playSound('click', soundEnabled)
  }

  return (
    <section id="inventory" className="inventory-section">
      <div className="section-header">
        <h2 className="mc-section-title">
          <span className="title-icon">📦</span> CHEST INVENTORY
        </h2>
        <span className="section-subtitle">Browse crafted artifacts & repositories</span>
      </div>

      {/* Inventory Tabs */}
      <div className="inventory-tabs">
        <button
          className={`inv-tab ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => {
            setActiveCategory('all')
            playSound('click', soundEnabled)
          }}
        >
          All Items ({PROJECTS.length})
        </button>
        <button
          className={`inv-tab ${activeCategory === 'apps' ? 'active' : ''}`}
          onClick={() => {
            setActiveCategory('apps')
            playSound('click', soundEnabled)
          }}
        >
          ⚔️ Desktop & Apps
        </button>
        <button
          className={`inv-tab ${activeCategory === 'web' ? 'active' : ''}`}
          onClick={() => {
            setActiveCategory('web')
            playSound('click', soundEnabled)
          }}
        >
          🌐 Web Creations
        </button>
        <button
          className={`inv-tab ${activeCategory === 'ai' ? 'active' : ''}`}
          onClick={() => {
            setActiveCategory('ai')
            playSound('click', soundEnabled)
          }}
        >
          🤖 AI & NLP
        </button>
        <button
          className={`inv-tab ${activeCategory === 'iot' ? 'active' : ''}`}
          onClick={() => {
            setActiveCategory('iot')
            playSound('click', soundEnabled)
          }}
        >
          🚋 Smart & IoT
        </button>
        <button
          className={`inv-tab ${activeCategory === 'tools' ? 'active' : ''}`}
          onClick={() => {
            setActiveCategory('tools')
            playSound('click', soundEnabled)
          }}
        >
          📖 Tools & CLI
        </button>
      </div>

      {/* Minecraft Chest Slot Grid */}
      <div className="chest-container">
        <div className="chest-header-bar">
          <span className="chest-label">Chest — {filteredProjects.length} Slots Occupied</span>
          <span className="chest-tip">Hover for Lore • Click to Inspect</span>
        </div>

        <div className="chest-slots-grid">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`chest-slot-item ${project.rarity}`}
              onClick={() => openInspector(project)}
              onMouseEnter={(e) => {
                setHoveredProject(project)
                handleMouseMove(e)
                playSound('pop', soundEnabled)
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredProject(null)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openInspector(project)
                }
              }}
            >
              <div className="slot-inner">
                <span className="slot-item-icon">{project.icon}</span>
                <span className="slot-item-name">{project.name}</span>
                {project.stars > 0 && (
                  <span className="slot-star-badge">★{project.stars}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Minecraft Item Lore Tooltip */}
      {hoveredProject && (
        <div
          className="mc-tooltip"
          style={{
            left: `${Math.min(tooltipPos.x + 16, window.innerWidth - 320)}px`,
            top: `${Math.min(tooltipPos.y + 16, window.innerHeight - 240)}px`,
          }}
        >
          <div className="mc-tooltip-title" style={{ color: hoveredProject.rarityColor }}>
            {hoveredProject.name}
          </div>
          <div className="mc-tooltip-rarity" style={{ color: hoveredProject.rarityColor }}>
            {hoveredProject.rarityName}
          </div>
          <p className="mc-tooltip-desc">{hoveredProject.description}</p>
          <div className="mc-tooltip-lore">
            <em>"{hoveredProject.lore}"</em>
          </div>
          <div className="mc-tooltip-stats">
            <div><span className="stat-key">Primary:</span> {hoveredProject.language}</div>
            {hoveredProject.stats && (
              <div><span className="stat-key">Power:</span> {hoveredProject.stats.attack}</div>
            )}
          </div>
          <div className="mc-tooltip-prompt">Click item to inspect recipe</div>
        </div>
      )}

      {/* Item Inspector Modal (Crafting Table UI) */}
      {selectedProject && (
        <div className="mc-modal-overlay" onClick={closeInspector}>
          <div
            className="mc-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Inspect ${selectedProject.name}`}
          >
            <div className="mc-modal-header">
              <span className="mc-modal-title">
                {selectedProject.icon} {selectedProject.name}
              </span>
              <div className="modal-header-actions">
                <span className="modal-hint">ESC to close</span>
                <button
                  className="mc-modal-close-btn"
                  onClick={closeInspector}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="mc-modal-body">
              <div className="modal-rarity-banner" style={{ borderColor: selectedProject.rarityColor }}>
                <span style={{ color: selectedProject.rarityColor }}>
                  {selectedProject.rarityName}
                </span>
                {selectedProject.stars > 0 && (
                  <span className="modal-stars">★ {selectedProject.stars} Stars</span>
                )}
                {selectedProject.forks > 0 && (
                  <span className="modal-forks">⑂ {selectedProject.forks} Forks</span>
                )}
              </div>

              <p className="modal-description">{selectedProject.description}</p>

              <div className="modal-lore-quote">
                “{selectedProject.lore}”
              </div>

              {/* Technologies / Enchantment Tags */}
              <div className="modal-tech-stack">
                <span className="tech-title">Enchantments / Stack:</span>
                <div className="tech-tags">
                  {selectedProject.languages?.map((lang) => (
                    <span key={lang} className="tech-badge">
                      {lang}
                    </span>
                  ))}
                  {selectedProject.topics?.map((topic) => (
                    <span key={topic} className="topic-badge">
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="modal-actions">
                <a
                  href={selectedProject.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mc-button mc-button-primary"
                  onClick={() => playSound('click', soundEnabled)}
                >
                  ⚔️ VIEW ON GITHUB
                </a>
                {selectedProject.demo_url && (
                  <a
                    href={selectedProject.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mc-button mc-button-secondary"
                    onClick={() => playSound('click', soundEnabled)}
                  >
                    🚀 LAUNCH LIVE
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
