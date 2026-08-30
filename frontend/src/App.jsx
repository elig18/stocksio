import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import About from './pages/About'
import Demo from './pages/Demo'
import Contact from './pages/Contact'
import PlanDetail from './pages/PlanDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Warehouses from './pages/Warehouses'
import MentionsLegales from './pages/MentionsLegales'
import Navbar from './components/Navbar'
import CookieBanner from './components/CookieBanner'

// Route protégée — redirige vers login si pas connecté
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <CookieBanner />
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/plans/:slug" element={<PlanDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />

        {/* Routes protégées */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Navbar />
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/products" element={
          <PrivateRoute>
            <Navbar />
            <Products />
          </PrivateRoute>
        } />
        <Route path="/products/:id" element={
          <PrivateRoute>
            <Navbar />
            <ProductDetail />
          </PrivateRoute>
        } />
        <Route path="/warehouses" element={
          <PrivateRoute>
            <Navbar />
            <Warehouses />
          </PrivateRoute>
        } />

        {/* Redirige toute URL inconnue vers l'accueil */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
