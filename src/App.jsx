import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import Settings from './components/Settings'
import './App.css'

const ROLES = [
  {
    id: 'assistant',
    label: 'Assistent',
    icon: '🤖',
    color: '#6366f1',
    systemPrompt: 'Je bent een behulpzame persoonlijke assistent. Je helpt de gebruiker met allerlei vragen en taken. Antwoord in het Nederlands tenzij anders gevraagd.',
  },
  {
    id: 'trainer',
    label: 'Personal Trainer',
    icon: '💪',
    color: '#22c55e',
    systemPrompt: 'Je bent een ervaren personal trainer en voedingscoach. Je geeft advies over workouts, voeding, herstel en een gezonde leefstijl. Wees motiverend en praktisch. Antwoord in het Nederlands.',
  },
  {
    id: 'marketeer',
    label: 'Marketeer',
    icon: '📈',
    color: '#f59e0b',
    systemPrompt: 'Je bent een creatieve en strategische marketeer met expertise in digitale marketing, social media, branding en copywriting. Je helpt met campagnes, content en groeistrategie. Antwoord in het Nederlands.',
  },
  {
    id: 'developer',
    label: 'Developer',
    icon: '💻',
    color: '#3b82f6',
    systemPrompt: 'Je bent een ervaren software developer met kennis van moderne technologieën. Je helpt met code, architectuur, debugging en best practices. Wees technisch en gedetailleerd. Antwoord in het Nederlands tenzij de vraag in het Engels is.',
  },
]

export default function App() {
  const [activeRoleId, setActiveRoleId] = useState('assistant')
  const [showSettings, setShowSettings] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('anthropic_api_key') || '')

  const activeRole = ROLES.find(r => r.id === activeRoleId)

  const handleSaveApiKey = (key) => {
    setApiKey(key)
    localStorage.setItem('anthropic_api_key', key)
    setShowSettings(false)
  }

  return (
    <div className="app">
      <Sidebar
        roles={ROLES}
        activeRoleId={activeRoleId}
        onSelectRole={setActiveRoleId}
        onOpenSettings={() => setShowSettings(true)}
      />
      <main className="main">
        {!apiKey ? (
          <div className="no-key">
            <div className="no-key-card">
              <span className="no-key-icon">🔑</span>
              <h2>Welkom bij je Dashboard</h2>
              <p>Voer je Anthropic API key in om te beginnen.</p>
              <button className="btn-primary" onClick={() => setShowSettings(true)}>
                API Key instellen
              </button>
              <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" className="ext-link">
                Nog geen key? Vraag er een aan →
              </a>
            </div>
          </div>
        ) : (
          <Chat key={activeRoleId} role={activeRole} apiKey={apiKey} />
        )}
      </main>
      {showSettings && (
        <Settings
          currentKey={apiKey}
          onSave={handleSaveApiKey}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
