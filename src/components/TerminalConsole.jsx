import { useState, useRef, useEffect } from 'react'
import { DEFAULT_CHAT_MESSAGES, PROFILE, PROJECTS } from '../data/githubData'
import { playSound } from '../utils/sound'

export default function TerminalConsole({
  isOpen,
  onClose,
  soundEnabled,
  setActiveBiome,
  onToggleJukebox,
}) {
  const [messages, setMessages] = useState(DEFAULT_CHAT_MESSAGES)
  const [inputVal, setInputVal] = useState('')
  const inputRef = useRef(null)
  const chatBottomRef = useRef(null)

  // Focus input and lock body scroll when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 50)
      playSound('pop', soundEnabled)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, soundEnabled])

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  // Listen for Escape key to close console
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleCommand = (cmdText) => {
    const trimmed = cmdText.trim()
    if (!trimmed) return

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'player',
      text: trimmed,
    }
    const newMsgs = [...messages, userMsg]

    // Handle commands
    if (trimmed.startsWith('/')) {
      const parts = trimmed.slice(1).split(' ')
      const command = parts[0].toLowerCase()
      const arg = parts.slice(1).join(' ').toLowerCase()

      let response = ''

      switch (command) {
        case 'help':
          response =
            '§bAvailable Commands:\n' +
            '§e/stats §7- Show GitHub developer statistics\n' +
            '§e/tp [hero|inventory|skills|advancements|contact] §7- Teleport to section\n' +
            '§e/theme [overworld|nether|end] §7- Switch world biome\n' +
            '§e/projects §7- List crafted portfolio items\n' +
            '§e/jukebox §7- Play or stop 8-bit music disc\n' +
            '§e/ping §7- Check server heartbeat\n' +
            '§e/clear §7- Wipe chat history'
          break

        case 'stats':
          response =
            `§a[GitHub Stats - ${PROFILE.login}]\n` +
            `§f• Public Repos: §e${PROFILE.public_repos}\n` +
            `§f• Followers: §e${PROFILE.followers}\n` +
            `§f• Coding Since: §e${PROFILE.member_since}\n` +
            `§f• Custom Domain: §b${PROFILE.blog}`
          break

        case 'tp':
        case 'teleport': {
          const valid = ['hero', 'inventory', 'skills', 'advancements', 'contact']
          if (valid.includes(arg)) {
            onClose()
            setTimeout(() => {
              const el = document.getElementById(arg)
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }, 100)
            response = `§aTeleported to §e#${arg}§a successfully.`
            playSound('levelUp', soundEnabled)
          } else {
            response = `§cUnknown location. Try: §e${valid.join(', ')}`
          }
          break
        }

        case 'theme':
        case 'biome': {
          if (arg === 'overworld' || arg === 'nether' || arg === 'end' || arg === 'the_end') {
            const mapped = arg === 'end' ? 'the_end' : arg
            setActiveBiome(mapped)
            response = `§aBiome set to §e${mapped.toUpperCase()}`
            playSound('xp', soundEnabled)
          } else {
            response = '§cUsage: /theme overworld | nether | end'
          }
          break
        }

        case 'jukebox':
        case 'music':
          if (onToggleJukebox) onToggleJukebox()
          response = '§d♪ Jukebox disc toggled! ♪'
          break

        case 'projects':
          response =
            '§bCrafted Artifacts:\n' +
            PROJECTS.slice(0, 6)
              .map((p) => `§f• §a${p.name} §7(★${p.stars}) - ${p.description.slice(0, 42)}...`)
              .join('\n')
          break

        case 'ping':
          response = '§aPong! Latency: 1ms §7(Overworld server running on pnil.me)'
          break

        case 'clear':
          setMessages([])
          setInputVal('')
          return

        default:
          response = `§cUnknown command: /${command}. Type §b/help§c for assistance.`
          break
      }

      newMsgs.push({
        id: Date.now() + 1,
        sender: 'system',
        text: response,
      })
      playSound('pop', soundEnabled)
    } else {
      // General chat message
      newMsgs.push({
        id: Date.now() + 1,
        sender: 'suwupnil',
        text: `Nice to meet you! Thanks for visiting my world. You can also reach me at ${PROFILE.email}`,
      })
      playSound('pop', soundEnabled)
    }

    setMessages(newMsgs)
    setInputVal('')
  }

  const renderFormattedText = (raw) => {
    // Basic parser for Minecraft formatting codes (§)
    const segments = raw.split(/(§[0-9a-fk-or])/g)
    let currentColor = 'inherit'

    const colorMap = {
      '§a': '#55ff55',
      '§b': '#55ffff',
      '§c': '#ff5555',
      '§d': '#ff55ff',
      '§e': '#ffff55',
      '§f': '#ffffff',
      '§7': '#aaaaaa',
    }

    return segments.map((seg, idx) => {
      if (colorMap[seg]) {
        currentColor = colorMap[seg]
        return null
      }
      return (
        <span key={idx} style={{ color: currentColor, whiteSpace: 'pre-wrap' }}>
          {seg}
        </span>
      )
    })
  }

  if (!isOpen) return null

  return (
    <div className="mc-chat-overlay" onClick={onClose}>
      <div
        className="mc-chat-window"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Minecraft Command Console"
        aria-modal="true"
      >
        <div className="mc-chat-header">
          <span className="chat-title">💬 MINECRAFT COMMAND CONSOLE</span>
          <div className="chat-header-actions">
            <span className="chat-hint">ESC to close</span>
            <button className="chat-close-btn" onClick={onClose} aria-label="Close Console">
              ✕
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div className="mc-chat-log">
          {messages.map((m) => (
            <div key={m.id} className={`chat-line sender-${m.sender}`}>
              {m.sender === 'system' ? (
                <span className="chat-prefix">[SYSTEM] </span>
              ) : m.sender === 'suwupnil' ? (
                <span className="chat-prefix-suwup">&lt;suwupnil&gt; </span>
              ) : (
                <span className="chat-prefix-player">&lt;Player&gt; </span>
              )}
              <span className="chat-body">{renderFormattedText(m.text)}</span>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Field */}
        <form
          className="mc-chat-form"
          onSubmit={(e) => {
            e.preventDefault()
            handleCommand(inputVal)
          }}
        >
          <span className="chat-prompt">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            className="mc-chat-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type /help or a message..."
            autoComplete="off"
            spellCheck="false"
          />
          <button type="submit" className="mc-chat-send-btn">
            SEND
          </button>
        </form>
      </div>
    </div>
  )
}
