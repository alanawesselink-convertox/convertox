export default function Sidebar({ roles, activeRoleId, onSelectRole, onOpenSettings }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="logo-text">My Dashboard</span>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">Rollen</p>
        {roles.map(role => (
          <button
            key={role.id}
            className={`nav-item ${activeRoleId === role.id ? 'active' : ''}`}
            style={{ '--role-color': role.color }}
            onClick={() => onSelectRole(role.id)}
          >
            <span className="nav-icon">{role.icon}</span>
            <span>{role.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item settings-btn" onClick={onOpenSettings}>
          <span className="nav-icon">⚙️</span>
          <span>Instellingen</span>
        </button>
      </div>
    </aside>
  )
}
