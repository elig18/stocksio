import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { getMe } from '../services/api'
import logoLight from '../assets/logo-light.png'

const links = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/products', label: 'Produits' },
  { to: '/warehouses', label: 'Entrepôts' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getMe()
      .then((res) => setEmail(res.data.data.email))
      .catch(() => {})
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-teal text-navy'
        : 'text-offwhite/80 hover:bg-navy-light hover:text-offwhite'
    }`

  return (
    <nav className="bg-navy sticky top-0 z-40" aria-label="Navigation principale">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <span className="flex items-center">
              <img src={logoLight} alt="StockS.io" className="h-6 w-auto" />
            </span>
            <div className="hidden md:flex md:gap-1">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                  {l.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {email && (
              <span className="text-gray-mid text-sm" aria-label="Utilisateur connecté">
                {email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium bg-navy-light text-offwhite hover:bg-teal hover:text-navy transition-colors cursor-pointer"
            >
              Déconnexion
            </button>
          </div>

          <button
            className="md:hidden text-offwhite p-2"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div id="mobile-menu" className="md:hidden pb-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
            {email && <span className="text-gray-mid text-sm px-3 pt-2">{email}</span>}
            <button
              onClick={handleLogout}
              className="mt-2 px-3 py-2 rounded-md text-sm font-medium bg-navy-light text-offwhite hover:bg-teal hover:text-navy transition-colors text-left cursor-pointer"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
