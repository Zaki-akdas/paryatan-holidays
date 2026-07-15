import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Menu, Phone, UserRound } from 'lucide-react'
import { company } from '../../data/packages'
import { motion } from 'framer-motion'
import { TripCustomizerContext } from '../../lib/trip-customizer-context'

const links = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'packages', label: 'Packages' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const { openTripCustomizer } = useContext(TripCustomizerContext)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting) setActive(e.target.id) })
    }, { rootMargin: '-40% 0px -55% 0px' })
    links.forEach(l => {
      const el = document.getElementById(l.id)
      if(el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? 'bg-white/85 backdrop-blur-xl shadow-sm border-b border-slate-200/70' : 'bg-transparent'}`}
    >
      <div className="container-narrow flex items-center justify-between h-[72px]">
        <a href="#" className="flex items-center gap-3">
          <img src="/logo.png" alt="Paryatan Holidays" className="h-9 w-9 object-contain" />
          <div className="leading-tight">
            <div className="font-display font-[700] text-[18px] tracking-tight text-[#13313b]">Paryatan Holidays</div>
            <div className="text-[11px] text-muted-foreground -mt-0.5">Miles to Go…</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-[#2b4852]">
          {links.map((l,i) => (
            <motion.button
              key={l.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i*0.06 }}
              onClick={() => go(l.id)}
              className={`hover:text-primary transition-colors ${active===l.id ? 'text-primary' : ''}`}
            >
              {l.label}
            </motion.button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href={`tel:${company.phoneRaw}`} className="text-sm text-muted-foreground flex items-center gap-1.5 hover:text-primary"><Phone className="w-4 h-4" /> {company.phone}</a>
          <Button variant="ghost" size="sm" onClick={() => navigate('/signin')} className="gap-1.5"><UserRound className="w-4 h-4" /> Sign in</Button>
          <Button variant="sunset" size="sm" onClick={openTripCustomizer}>Plan my Trip</Button>
        </div>

        <button className="lg:hidden p-2" onClick={()=>setOpen(!open)} aria-label="Menu"><Menu /></button>
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden border-t bg-white/95 backdrop-blur-xl"
        >
          <div className="container-narrow py-4 flex flex-col gap-3">
            {links.map(l => (
              <button key={l.id} onClick={() => go(l.id)} className="text-left py-1.5 text-[15px]">{l.label}</button>
            ))}
            <a href={`tel:${company.phoneRaw}`} className="text-primary font-semibold">{company.phone}</a>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={()=>{ setOpen(false); navigate('/signin') }} className="flex-1">Sign in</Button>
              <Button variant="sunset" size="sm" onClick={()=>{ setOpen(false); navigate('/signup') }} className="flex-1">Sign up</Button>
            </div>
            <Button variant="sunset" size="sm" onClick={()=>{ setOpen(false); openTripCustomizer() }} className="w-fit">Plan my Trip</Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
