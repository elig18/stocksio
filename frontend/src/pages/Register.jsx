import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, login } from '../services/api'
import logoDark from '../assets/logo-dark.png'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    setLoading(true)
    try {
      await register({ email, password })
      // Connexion automatique après inscription
      const res = await login({ email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || "Inscription impossible. Réessayez.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center hover:no-underline">
            <img src={logoDark} alt="StockS.io" className="h-7 w-auto" />
          </Link>
          <p className="text-gray-mid text-sm mt-1">Créez votre compte</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <p role="alert" className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-navy mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-navy mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby="password-hint"
              className="w-full rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
            />
            <p id="password-hint" className="text-xs text-gray-mid mt-1">6 caractères minimum</p>
          </div>

          <div className="mb-6">
            <label htmlFor="confirm" className="block text-sm font-medium text-navy mb-1">
              Confirmer le mot de passe
            </label>
            <input
              id="confirm"
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal text-navy font-semibold rounded-md py-2 hover:bg-teal-dark hover:text-white transition-colors disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'Création…' : 'Créer le compte'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-mid mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-teal-dark font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
