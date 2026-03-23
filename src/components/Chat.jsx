import { useState, useRef, useEffect } from 'react'
import Anthropic from '@anthropic-ai/sdk'

export default function Chat({ role, apiKey }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: role.systemPrompt,
        messages: newMessages,
      })

      const assistantText = response.content[0]?.text || ''
      setMessages(prev => [...prev, { role: 'assistant', content: assistantText }])
    } catch (err) {
      const errorText = err?.status === 401
        ? 'Ongeldige API key. Controleer je instellingen.'
        : `Fout: ${err.message}`
      setMessages(prev => [...prev, { role: 'assistant', content: errorText, error: true }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat">
      <div className="chat-header" style={{ '--role-color': role.color }}>
        <span className="chat-icon">{role.icon}</span>
        <div>
          <h2 className="chat-title">{role.label}</h2>
          <p className="chat-subtitle">Powered by Claude</p>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <span className="empty-icon">{role.icon}</span>
            <p>Stel een vraag aan je {role.label.toLowerCase()}.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role} ${msg.error ? 'error' : ''}`}>
            <div className="message-bubble">
              <MessageContent content={msg.content} />
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-bubble typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Schrijf een bericht naar je ${role.label.toLowerCase()}...`}
          rows={1}
          disabled={loading}
        />
        <button
          className="send-btn"
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          style={{ '--role-color': role.color }}
        >
          ➤
        </button>
      </div>
    </div>
  )
}

function MessageContent({ content }) {
  const parts = content.split(/(```[\s\S]*?```)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const lines = part.slice(3, -3).split('\n')
          const lang = lines[0]
          const code = lines.slice(1).join('\n')
          return (
            <pre key={i} className="code-block">
              {lang && <span className="code-lang">{lang}</span>}
              <code>{code}</code>
            </pre>
          )
        }
        return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>
      })}
    </>
  )
}
