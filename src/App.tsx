import { useState, useEffect, useMemo } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/travel/Navbar'
import Hero from './components/travel/Hero'
import About from './components/travel/About'
import Services from './components/travel/Services'
import Packages from './components/travel/Packages'
import ItineraryPage from './pages/ItineraryPage'
import Specializations from './components/travel/Specializations'
import Gallery from './components/travel/Gallery'
import WhyUs from './components/travel/WhyUs'
import Testimonials from './components/travel/Testimonials'
import Contact from './components/travel/Contact'
import Footer from './components/travel/Footer'
import ScrollScene from './components/travel/ScrollScene'
import GlobalEarthBg from './components/travel/GlobalEarthBg'
import ScrollProgress from './components/travel/ScrollProgress'
import AIChat from './components/travel/AIChat'
import Loader from './components/travel/Loader'
import SmoothScroll from './components/travel/SmoothScroll'
import TripCustomizer from './components/travel/TripCustomizer'
import { TripCustomizerContext } from './lib/trip-customizer-context'
import { Toaster } from './components/ui/toaster'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import AdminDashboard from './pages/AdminDashboard'
import { isAdmin } from './lib/auth'

function MarketingApp() {
  return (
    <div className="min-h-screen bg-background relative">
      <ScrollProgress />
      <GlobalEarthBg />
      <ScrollScene />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Services />
          <Packages />
          <Specializations />
          <Gallery />
          <WhyUs />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </div>
      <AIChat />
    </div>
  )
}

function AdminGate() {
  return isAdmin() ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/signin" replace />
}

function App() {
  const [loading, setLoading] = useState(true)
  const [tripOpen, setTripOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const isSpecial =
      location.pathname.startsWith('/sign') || location.pathname.startsWith('/admin')
    const seen = sessionStorage.getItem('paryatan_loader_seen')
    if (isSpecial || seen) setLoading(false)
  }, [location.pathname])

  const handleDone = () => {
    sessionStorage.setItem('paryatan_loader_seen', '1')
    setLoading(false)
  }

  const tripCtx = useMemo(() => ({ openTripCustomizer: () => setTripOpen(true) }), [])

  if (loading) {
    return <Loader onDone={handleDone} />
  }

  return (
    <TripCustomizerContext.Provider value={tripCtx}>
      <Routes>
        <Route
          path="/"
          element={
            <SmoothScroll>
              <MarketingApp />
            </SmoothScroll>
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/itinerary/:id" element={<ItineraryPage />} />
        <Route path="/admin" element={<AdminGate />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <TripCustomizer open={tripOpen} onClose={() => setTripOpen(false)} />
      <Toaster />
    </TripCustomizerContext.Provider>
  )
}

export default function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}
