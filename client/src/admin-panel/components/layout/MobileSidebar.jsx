import { NavLink } from 'react-router-dom'
import { navItems } from '../../utils/constants'

export default function MobileSidebar({ open, onClose }) {
  return (
    <div className={`mobile-overlay ${open ? 'open' : ''}`} onClick={onClose}>
      <aside className={`sidebar mobile ${open ? 'open' : ''}`} onClick={(event) => event.stopPropagation()}>
        <div className="brand-block">
          <div className="brand-badge">S</div>
          <div>
            <strong>SHOP.CO</strong>
            <span>Admin</span>
          </div>
        </div>

        <nav className="nav-menu">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => (`nav-item ${isActive ? 'active' : ''}`)}
              onClick={onClose}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  )
}
