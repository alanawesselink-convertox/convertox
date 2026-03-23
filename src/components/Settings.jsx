import { useState } from 'react'

export default function Settings({ currentKey, onSave, onClose }) {
  const [value, setValue] = useState(currentKey)
  const [show, setShow] = useState(false)

  const handleSave = () => {
    onSave(value.trim())
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Instellingen</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <label className="field-label">Anthropic API Key</label>
          <div className="key-input-row">
            <input
              type={show ? 'text' : 'password'}
              className="key-input"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="sk-ant-..."
            />
            <button className="toggle-btn" onClick={() => setShow(s => !s)}>
              {show ? '🙈' : '👁️'}
            </button>
          </div>
          <p className="field-hint">
            Je key wordt alleen lokaal opgeslagen in je browser (localStorage). Hij wordt nooit verstuurd naar een server.
          </p>
          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noreferrer"
            className="ext-link"
          >
            API key ophalen via console.anthropic.com →
          </a>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Annuleren</button>
          <button className="btn-primary" onClick={handleSave}>Opslaan</button>
        </div>
      </div>
    </div>
  )
}
