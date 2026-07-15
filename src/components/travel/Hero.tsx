import Globe3D from './Globe3D'
import { Button } from '../ui/button'
import { ArrowRight, Phone, Sparkles } from 'lucide-react'
import { company } from '../../data/packages'
import { useRef, useLayoutEffect, useState, useContext } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TripCustomizerContext } from '../../lib/trip-customizer-context'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const { openTripCustomizer } = useContext(TripCustomizerContext)
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [globeProgress, setGlobeProgress] = useState(0)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the hero, scrub content out, globe stays
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=110%',
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        onUpdate: self => setGlobeProgress(self.progress),
      })

      // Content fade / lift / blur
      if (contentRef.current) {
        gsap.fromTo(contentRef.current,
          { opacity: 1, y: 0, filter: 'blur(0px)' },
          {
            opacity: 0,
            y: -55,
            filter: 'blur(3px)',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '55% top',
              scrub: true,
            }
          }
        )
      }

      // Headline letters parallax
      gsap.utils.toArray<HTMLElement>('.hero-reveal').forEach((el, i) => {
        gsap.fromTo(el,
          { y: 0, opacity: 1 },
          {
            y: -20 - i*6,
            opacity: 0.15,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '60% top',
              scrub: true,
            }
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative h-[100vh] overflow-hidden bg-[#d8f0f7]">
      {/* Full-bleed 3D Earth */}
      <div className="absolute inset-0">
        <Globe3D scrollProgress={globeProgress} fill />
      </div>

      {/* Readability scrims */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-y-0 left-0 w-full md:w-[62%] lg:w-[54%]" style={{
          background: 'linear-gradient(90deg, rgba(246,252,253,0.98) 0%, rgba(246,252,253,0.9) 36%, rgba(246,252,253,0.58) 66%, transparent 100%)'
        }}/>
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#eaf6fb]/90 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container-narrow w-full pt-16">
          <div ref={contentRef} className="max-w-[640px]">
            <div className="hero-reveal inline-flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-3.5 py-1.5 text-[12px] font-medium text-[#0b5b68] shadow-sm border border-cyan-100/90">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Paryatan Holidays • {company.subTagline}
            </div>

            <h1 className="hero-reveal display text-[44px] sm:text-[58px] md:text-[72px] leading-[0.94] tracking-tight text-[#0d2e38] mt-5 text-balance"
              style={{ textShadow: '0 2px 28px rgba(255,255,255,0.82)' }}
            >
              India & the World,<br/>planned beautifully.
            </h1>

            <p className="hero-reveal mt-5 text-[17px] md:text-[18.5px] leading-relaxed text-[#2f5260] max-w-xl text-balance">
              Custom tours, honest pricing, 24×7 on-trip support. Kashmir to Kerala, Dubai to Bali — Paryatan makes it effortless. <em>Miles to Go…</em>
            </p>

            <div className="hero-reveal flex flex-wrap gap-3 mt-7">
              <Button variant="sunset" size="lg" onClick={()=>scrollTo('packages')}>
                Explore Packages <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg" className="bg-white/90 backdrop-blur hover:bg-white" onClick={openTripCustomizer}>
                <Sparkles className="w-4 h-4 mr-1" /> Build Your Trip
              </Button>
            </div>

            <div className="hero-reveal flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-[13px] text-[#3a5d68]">
              <div><strong className="text-[#14323c]">4.8★</strong> 500+ Google reviews</div>
              <div className="hidden sm:block h-4 w-px bg-slate-300/90" />
              <div>IATA / ADTOI / OTOAI / NIMA Member</div>
            </div>

            <div className="hero-reveal mt-3 flex flex-wrap items-center gap-3 text-sm">
              <a className="inline-flex items-center gap-2 text-primary font-semibold hover:underline bg-white/78 backdrop-blur px-3 py-1.5 rounded-full border border-cyan-100/70" href={`tel:${company.phoneRaw}`}><Phone className="w-4 h-4"/>{company.phone}</a>
              <span className="text-[12px] text-slate-600 bg-white/70 backdrop-blur px-3 py-1.5 rounded-full">53 destinations • drag globe to spin</span>
            </div>
          </div>
        </div>
      </div>

      {/* scroll hint – fades with scroll */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 text-[11px] text-slate-700 flex flex-col items-center gap-1.5 pointer-events-none">
        <span className="bg-white/80 backdrop-blur px-2.5 py-1 rounded-full border border-slate-200/80">Scroll to explore</span>
        <div className="w-[1.5px] h-7 bg-slate-400/70 rounded-full animate-[floatY_1.5s_ease-in-out_infinite]" />
      </div>
      <style>{`@keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }`}</style>
    </section>
  )
}
