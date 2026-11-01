import { useEffect, useState, useMemo } from 'react'

/* ─────────────────────────────────────
   HARDCODED GITHUB DATA (fetched at build-time via MCP)
   ───────────────────────────────────── */
const PROFILE = {
  login: 'suwupnil',
  name: 'Swapnil',
  avatar_url: 'https://avatars.githubusercontent.com/u/90128544?v=4',
  bio: 'did u call my Jadu? 🥺',
  location: 'India',
  blog: 'pnil.me',
  public_repos: 17,
  followers: 29,
  following: 24,
  html_url: 'https://github.com/suwupnil',
  created_at: '2021-09-05T07:12:15Z',
}

const REPOS = [
  {
    name: 'newNewton',
    description: 'A powerful cross-platform app built with Swift, JavaScript & Rust.',
    html_url: 'https://github.com/suwupnil/newNewton',
    languages: ['Swift', 'JavaScript', 'Rust', 'CSS', 'HTML'],
    icon: '🧮',
  },
  {
    name: 'Call-Jadu',
    description: 'Calling jadu was my childhood dream.',
    html_url: 'https://github.com/suwupnil/Call-Jadu',
    languages: ['CSS', 'JavaScript', 'HTML'],
    icon: '✨',
  },
  {
    name: 'LidMusic',
    description: 'MacOS app to keep playing music with the lid closed. Supports Spotify, Apple Music & more.',
    html_url: 'https://github.com/suwupnil/LidMusic',
    languages: ['AppleScript', 'Python', 'Shell'],
    icon: '🎵',
  },
  {
    name: 'Dynamic-Home',
    description: 'Redesigned the boring Google Chrome homepage into something beautiful.',
    html_url: 'https://github.com/suwupnil/Dynamic-Home',
    languages: ['JavaScript', 'CSS', 'HTML'],
    icon: '🏠',
  },
  {
    name: 'Firebus',
    description: 'Automatic attendance system for school buses.',
    html_url: 'https://github.com/suwupnil/Firebus',
    languages: ['JavaScript', 'HTML', 'CSS'],
    icon: '🚌',
  },
  {
    name: 'FairDeal',
    description: 'A marketplace app for fair deals and transactions.',
    html_url: 'https://github.com/suwupnil/FairDeal',
    languages: ['JavaScript', 'CSS', 'HTML'],
    icon: '🤝',
  },
  {
    name: 'Search-It',
    description: '3-in-1 app: Search Engine, Browser & Text-to-Image Generator.',
    html_url: 'https://github.com/suwupnil/Search-It',
    languages: ['HTML', 'JavaScript', 'CSS'],
    icon: '🔍',
  },
  {
    name: 'NCERT.py',
    description: 'Solving NCERT & CBSE Computer Science questions with code.',
    html_url: 'https://github.com/suwupnil/NCERT.py',
    languages: ['Python'],
    icon: '📚',
  },
  {
    name: 'StudyBooks',
    description: 'Get all NCERT eBooks and Solutions from class 6-8 in one app.',
    html_url: 'https://github.com/suwupnil/StudyBooks',
    languages: ['Java', 'Android'],
    icon: '📖',
  },
  {
    name: 'GuardianSafe',
    description: 'Safety and guardian monitoring application.',
    html_url: 'https://github.com/suwupnil/GuardianSafe',
    languages: ['JavaScript', 'HTML', 'CSS'],
    icon: '🛡️',
  },
  {
    name: 'manage-library',
    description: 'FULLY VIBE CODED — A library management system for CS project.',
    html_url: 'https://github.com/suwupnil/manage-library',
    languages: ['Python'],
    icon: '📋',
  },
]

// Aggregate language bytes → top languages
const LANG_DATA = {
  Swift:       378893,
  JavaScript:  344501,
  Rust:        129342,
  CSS:          96186,
  HTML:         92429,
  Shell:        21321,
  Python:       2514,
  AppleScript:  11700,
  TypeScript:   12256,
}

function getTopLanguages(data, count = 8) {
  const total = Object.values(data).reduce((a, b) => a + b, 0)
  return Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([name, bytes]) => ({
      name,
      pct: Math.round((bytes / total) * 100),
    }))
}

const LANG_COLORS = {
  Swift:       '#f05138',
  JavaScript:  '#f7df1e',
  Rust:        '#dea584',
  CSS:         '#563d7c',
  HTML:        '#e34c26',
  Shell:       '#89e051',
  Python:      '#3572A5',
  AppleScript: '#101F1F',
  TypeScript:  '#3178c6',
}

/* ─────────────────────────────────────
   FLOATING PIXEL PARTICLES
   ───────────────────────────────────── */
function FloatingPixels() {
  const pixels = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * 20,
      color: ['#00ff88', '#00e5ff', '#ff6b9d', '#ffd93d', '#bd93f9'][Math.floor(Math.random() * 5)],
    })), [])

  return (
    <>
      {pixels.map((p) => (
        <div
          key={p.id}
          className="floating-pixel"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  )
}

/* ─────────────────────────────────────
   NAV
   ───────────────────────────────────── */
function Nav() {
  return (
    <nav className="nav">
      <a href="#" className="nav-logo">
        {'>'} swapnil<span className="cursor">_</span>
      </a>
      <ul className="nav-links">
        <li><a href="#about">about</a></li>
        <li><a href="#skills">skills</a></li>
        <li><a href="#projects">projects</a></li>
        <li><a href="#contact">contact</a></li>
      </ul>
    </nav>
  )
}

/* ─────────────────────────────────────
   HERO
   ───────────────────────────────────── */
function Hero() {
  const [typed, setTyped] = useState('')
  const fullText = 'Builder of things that spark joy.'

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setTyped(fullText.slice(0, i + 1))
      i++
      if (i >= fullText.length) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const yearsSince = new Date().getFullYear() - new Date(PROFILE.created_at).getFullYear()

  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <div className="hero-text">
          <p className="hero-greeting">{'// hello world, I\'m'}</p>
          <h1 className="hero-name">
            <span className="highlight">{PROFILE.name}</span>
          </h1>
          <p className="hero-tagline">
            {typed}<span className="cursor" style={{ color: 'var(--cyan)' }}>▌</span>
          </p>
          <p className="hero-bio">{PROFILE.bio}</p>

          <div className="hero-stats">
            <div className="stat-block">
              <span className="stat-number">{PROFILE.public_repos}</span>
              <span className="stat-label">repos</span>
            </div>
            <div className="stat-block">
              <span className="stat-number">{PROFILE.followers}</span>
              <span className="stat-label">followers</span>
            </div>
            <div className="stat-block">
              <span className="stat-number">{yearsSince}+</span>
              <span className="stat-label">yrs coding</span>
            </div>
          </div>
        </div>

        <div className="hero-avatar-wrapper">
          <div className="pixel-frame">
            <img src={PROFILE.avatar_url} alt={PROFILE.name} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────
   ABOUT (Terminal)
   ───────────────────────────────────── */
function About() {
  return (
    <section id="about">
      <h2 className="section-title">about.exe</h2>
      <div className="terminal">
        <div className="terminal-header">
          <div className="terminal-dot red" />
          <div className="terminal-dot yellow" />
          <div className="terminal-dot green" />
          <span className="terminal-title">swapnil@pixel ~ </span>
        </div>
        <div className="terminal-body">
          <div className="terminal-line">
            <span className="terminal-prompt">$ </span>
            <span className="terminal-command">cat about.txt</span>
          </div>
          <div className="terminal-line terminal-output">
            <span className="terminal-comment">{'// '}Who am I?</span>
          </div>
          <div className="terminal-line terminal-output">
            Hey! I'm <span className="terminal-string">Swapnil</span> from{' '}
            <span className="terminal-string">India</span> 🇮🇳
          </div>
          <div className="terminal-line terminal-output">
            A passionate developer who loves building apps,
          </div>
          <div className="terminal-line terminal-output">
            tinkering with code, and turning ideas into pixels.
          </div>
          <div className="terminal-line terminal-output">&nbsp;</div>
          <div className="terminal-line terminal-output">
            <span className="terminal-keyword">const</span> interests = [
            <span className="terminal-string">"macOS apps"</span>,{' '}
            <span className="terminal-string">"web dev"</span>,{' '}
            <span className="terminal-string">"Rust"</span>,{' '}
            <span className="terminal-string">"Swift"</span>];
          </div>
          <div className="terminal-line terminal-output">
            <span className="terminal-keyword">const</span> status ={' '}
            <span className="terminal-string">"Always shipping 🚀"</span>;
          </div>
          <div className="terminal-line terminal-output">&nbsp;</div>
          <div className="terminal-line">
            <span className="terminal-prompt">$ </span>
            <span className="terminal-command">echo $WEBSITE</span>
          </div>
          <div className="terminal-line terminal-output">
            <a href={`https://${PROFILE.blog}`} target="_blank" rel="noreferrer"
               style={{ color: 'var(--cyan)', textDecoration: 'none' }}>
              {PROFILE.blog}
            </a>
          </div>
          <div className="terminal-line">&nbsp;</div>
          <div className="terminal-line">
            <span className="terminal-prompt">$ </span>
            <span className="cursor" style={{ color: 'var(--green)' }}>▌</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────
   SKILLS
   ───────────────────────────────────── */
function Skills() {
  const languages = getTopLanguages(LANG_DATA)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true) },
      { threshold: 0.2 }
    )
    const el = document.getElementById('skills')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills">
      <h2 className="section-title">skills.dat</h2>
      <div className="skills-grid">
        {languages.map((lang) => (
          <div key={lang.name} className="skill-bar">
            <div className="skill-name">
              {lang.name} <span>{lang.pct}%</span>
            </div>
            <div className="skill-track">
              <div
                className="skill-fill"
                style={{
                  width: animate ? `${lang.pct}%` : '0%',
                  backgroundColor: LANG_COLORS[lang.name] || 'var(--green)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────
   PROJECTS
   ───────────────────────────────────── */
function Projects() {
  return (
    <section id="projects">
      <h2 className="section-title">projects.dir</h2>
      <div className="projects-grid">
        {REPOS.map((repo) => (
          <a
            key={repo.name}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="project-card"
          >
            <div className="project-icon">{repo.icon}</div>
            <h3 className="project-name">{repo.name}</h3>
            <p className="project-desc">{repo.description}</p>
            <div className="project-meta">
              {repo.languages.slice(0, 3).map((l) => (
                <span key={l} className="project-tag">{l}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────
   CONTACT
   ───────────────────────────────────── */
function Contact() {
  return (
    <section id="contact">
      <h2 className="section-title">contact.sh</h2>
      <div className="contact-links">
        <a href={PROFILE.html_url} target="_blank" rel="noreferrer" className="contact-link">
          ⬡ GitHub
        </a>
        <a href={`https://${PROFILE.blog}`} target="_blank" rel="noreferrer" className="contact-link">
          ◈ {PROFILE.blog}
        </a>
        <a href={`https://github.com/${PROFILE.login}`} target="_blank" rel="noreferrer" className="contact-link">
          ▣ Follow @{PROFILE.login}
        </a>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────
   FOOTER
   ───────────────────────────────────── */
function Footer() {
  return (
    <footer className="footer">
      <p>
        Built with <span className="pixel-heart">♥</span> & pixels by{' '}
        <a href={PROFILE.html_url} style={{ color: 'var(--green)', textDecoration: 'none' }}>
          {PROFILE.name}
        </a>
      </p>
    </footer>
  )
}

/* ─────────────────────────────────────
   APP
   ───────────────────────────────────── */
export default function App() {
  return (
    <>
      <div className="pixel-bg" />
      <FloatingPixels />
      <Nav />
      <div className="app-container">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </>
  )
}
