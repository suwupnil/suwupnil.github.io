import { useState, useRef, useEffect } from 'react'
import { DEFAULT_CHAT_MESSAGES, PROFILE, PROJECTS } from '../data/githubData'
import { playSound } from '../utils/sound'

export default function TerminalConsole({
  isOpen,
  onClose,
  soundEnabled,
  setActiveBiome,
}) {
  const [messages, setMessages] = useState(DEFAULT_CHAT_MESSAGES)
  const [inputVal, setInputVal] = useState('')
  const inputRef = useRef(null)
  const chatBottomRef = useRef(null)

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      playSound('pop', soundEnabled)
    }
  }, [isOpen, soundEnabled])

  // Scroll to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Listen for `/` keypress to open console
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (e.key === '/') {
        e.preventDefault()
        onClose(false) // Toggle or ensure open
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

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
            '§e/tp [hero|inventory|skills|contact] §7- Teleport to section\n' +
            '§e/theme [overworld|nether|end] §7- Switch world biome\n' +
            '§e/projects §7- List all crafted projects\n' +
            '§e/ping §7- Check server heartbeat\n' +
            '§e/clear §7- Wipe chat history'
          break

        case 'stats':
          response =
            `§a[GitHub Stats - ${PROFILE.login}]\n` +
            `§f• Public Repos: §e${PROFILE.public_repos}\n` +
            `§f• Followers: §e${PROFILE.followers}\n` +
            `§f• Coding Since: §e${PROFILE.member_since}\n` +
            `§f• Domain: §b${PROFILE.blog}`
          break

        case 'tp':
        case 'teleport': {
          const valid = ['hero', 'inventory', 'skills', 'contact', 'advancements']
          if (valid.includes(arg)) {
            const el = document.getElementById(arg)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
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

        case 'projects':
          response =
            '§bTop Projects:\n' +
            PROJECTS.slice(0, 5)
              .map((p) => `§f• §a${p.name} §7(★${p.stars}) - ${p.description.slice(0, 45)}...`)
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
      // General chat
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
      >
        <div className="mc-chat-header">
          <span className="chat-title">💬 MINECRAFT COMMAND CONSOLE</span>
          <div className="chat-header-actions">
            <span className="chat-hint">ESC to close</span>
            <button className="chat-close-btn" onClick={onClose} aria-label="Close">
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
