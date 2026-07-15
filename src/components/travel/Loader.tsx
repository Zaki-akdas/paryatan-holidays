import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useEffect, useState, useMemo, useRef } from 'react'

// --- Travel word bank – ~230 words ---
const WORD_BANK = [
  'Travel','Adventure','Mountains','Beach','Holiday','Flight','Passport','Visa','Tourism','Explore','Journey','Nature','Wildlife','Heritage','Hotel','Cruise','Desert','Forest','Trek','Camping','Safari','Luxury','Family','Honeymoon','Corporate','Educational Tour','Vacation','Destination','Memories','Discover',
  'India','Europe','Dubai','Bali','Thailand','Kashmir','Goa','Kerala','Himachal','Ladakh',
  'Rajasthan','Sikkim','Andaman','Singapore','Malaysia','Maldives','Vietnam','Turkey','Paris','Swiss','Italy','Ooty','Manali','Shimla','Darjeeling','Udaipur','Jaipur','Agra',
  'Wanderlust','Backpack','Resort','Villa','Sunset','Sunrise','Island','Ocean','River','Valley','Peak','Glacier','Jungle','Safari','Temple','Palace','Fort','Museum','Culture','Cuisine','Festival','Photography','Relax','Unwind','Escape','Roam','Globe','Map','Compass','Ticket','Boarding','Checkin','Lounge','Suite','Spa','Ayurveda','Houseboat','Backwaters','Tea Gardens','Snow','Beaches','Coral','Diving','Snorkel','Paragliding','Rafting','Trekking','Biking','Safari Jeep','Tiger','Elephant','Rhino','Leopard',
  'Pilgrimage','Char Dham','Jyotirlinga','Vaishno Devi','Golden Temple','Himalayas','Thar Desert','Rann of Kutch','Ganges','Brahmaputra','Tea','Spices','Silk Route','Heritage Walk','Palace Hotel','Boutique','Luxury Train','Cruise Liner','Ferry','Catamaran','Yacht','Seaplane','Helicopter','First Class','Business','Economy Plus',
  'Family Fun','Kids Friendly','Senior Citizen','Group Tour','Solo Travel','Couple Retreat','Honeymoon Suite','Romantic Dinner','Candlelight','Beachfront','Hilltop','Lakeview','Oceanview','Infinity Pool','Private Pool','Butler Service','Concierge','All Inclusive','Half Board','Breakfast Included','Buffet','À la Carte',
  'Visa Assistance','Forex','Travel Insurance','24x7 Support','Local Guide','Expert Driver','AC Coach','Sedan','SUV','Tempo Traveller','Luxury Coach','Meet & Greet','Airport Transfer','Porter','SIM Card','Travel Kit',
  'Kashmir Valley','Dal Lake','Gulmarg','Pahalgam','Sonamarg','Leh','Nubra','Pangong','Shimla','Manali','Rohtang','Dharamshala','Amritsar','Rishikesh','Haridwar','Mussoorie','Nainital','Corbett',
  'Goa Beaches','Baga','Calangute','Anjuna','Palolem',
  'Udaipur','Jodhpur','Jaisalmer','Jaipur','Amber Fort','Hawa Mahal','City Palace',
  'Munnar','Thekkady','Alleppey','Kovalam','Wayanad','Coorg',
  'Ooty','Kodaikanal','Mahabalipuram','Pondicherry',
  'Gangtok','Darjeeling','Pelling','Shillong','Cherrapunji','Kaziranga','Puri','Konark',
  'Mumbai','Pune','Lonavala','Mahabaleshwar','Ahmedabad','Statue of Unity',
  'Dubai','Abu Dhabi','Burj Khalifa','Desert Safari',
  'Bangkok','Pattaya','Phuket','Krabi','Phi Phi',
  'Singapore','Sentosa','Universal Studios',
  'Bali','Ubud','Seminyak','Uluwatu','Tanah Lot',
  'Paris','Swiss Alps','Lucerne','Venice','Rome','Colosseum',
  'Maldives','Water Villa','Overwater','Coral Reef',
  'Hanoi','Halong Bay','Hoi An','Danang',
  'Istanbul','Cappadocia','Hot Air Balloon','Pamukkale',
  'Bon Voyage','Namaste','Shukriya','Dhanyavaad','Welcome Aboard',
  'Miles to Go','Enjoy the World','Paryatan','Holidays','Trust','Service Excellence','Memories for Life'
]

const LOADING_LINES = [
  'Finding your next destination…',
  'Planning unforgettable memories…',
  'Packing your journey…',
  'Booking adventures…',
  'Curating 5★ stays…',
  'Securing best fares…',
  'Preparing your escape…',
  'Almost Ready…'
]

type WordNode = {
  id: number
  text: string
  x: number; y: number
  size: number
  weight: number
  color: string
  opacity: number
  rot: number
  driftX: number
  driftY: number
  rotSpeed: number
}

const COLORS = [
  'rgba(255,255,255,0.92)',
  'rgba(175,240,255,0.88)',
  'rgba(255,183,3,0.92)',   // #FFB703
  'rgba(33,158,188,0.9)',   // #219EBC
  'rgba(251,133,0,0.88)',   // #FB8500
  'rgba(205,240,255,0.8)',
  'rgba(255,214,120,0.88)',
]

function buildWordNodes(count = 210): WordNode[] {
  const words = [...WORD_BANK].sort(() => Math.random() - 0.5)
  const out: WordNode[] = []
  for (let i = 0; i < count; i++) {
    const t = words[i % words.length]
    // bias positions to vaguely resemble world map blobs
    // 3 clusters: Americas left, Eurasia/Africa center-right, Asia-Pacific far right
    const cluster = Math.random()
    let cx, cy, spreadX, spreadY
    if (cluster < 0.22) { cx = 18; cy = 48; spreadX = 19; spreadY = 28 }          // Americas
    else if (cluster < 0.68) { cx = 52; cy = 45; spreadX = 32; spreadY = 30 }    // Europe/Africa/ME/India
    else { cx = 78; cy = 52; spreadX = 20; spreadY = 28 }                         // East Asia / Oceania
    const x = Math.max(4, Math.min(96, cx + (Math.random()-0.5)*spreadX*2 + (Math.random()-0.5)*10))
    const y = Math.max(8, Math.min(88, cy + (Math.random()-0.5)*spreadY*2))
    const tier = Math.random()
    const size = tier > 0.86 ? 17 : tier > 0.55 ? 13.5 : 11.2
    const weight = size > 15 ? 650 : size > 12 ? 550 : 470
    out.push({
      id: i,
      text: t,
      x, y,
      size,
      weight,
      color: COLORS[Math.floor(Math.random()*COLORS.length)],
      opacity: 0.62 + Math.random()*0.38,
      rot: (Math.random()-0.5)*16,
      driftX: (Math.random()-0.5)*0.9,
      driftY: (Math.random()-0.5)*0.7,
      rotSpeed: (Math.random()-0.5)*0.45
    })
  }
  return out
}

// glowing connection lines – canvas
function ConnectionCanvas({ nodes, active }: { nodes: WordNode[], active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!active) return
    const c = ref.current!
    const ctx = c.getContext('2d')!
    let raf = 0
    const draw = () => {
      const w = c.clientWidth, h = c.clientHeight
      if (c.width !== w*2) { c.width = w*2; c.height = h*2 }
      ctx.clearRect(0,0,c.width,c.height)
      // draw ~70 nearest connections
      for (let i = 0; i < nodes.length; i += 3) {
        const a = nodes[i]
        for (let j = i+3; j < Math.min(nodes.length, i+18); j += 4) {
          const b = nodes[j]
          const dx = (a.x - b.x)
          const dy = (a.y - b.y)
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < 16) {
            const alpha = (1 - dist/16) * 0.21
            ctx.beginPath()
            ctx.moveTo(a.x/100 * c.width, a.y/100 * c.height)
            ctx.lineTo(b.x/100 * c.width, b.y/100 * c.height)
            ctx.strokeStyle = `rgba(120,225,255,${alpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [nodes, active])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.95]" />
}

export default function Loader({ onDone }: { onDone: () => void }) {
  const prefersReduced = useReducedMotion()
  const [stage, setStage] = useState<0|1|2|3|4|5>(0)
  const words = useMemo(() => buildWordNodes(prefersReduced ? 90 : 216), [prefersReduced])
  const [tipIdx, setTipIdx] = useState(0)

  // Timed stage progression
  useEffect(() => {
    if (prefersReduced) {
      const t = setTimeout(() => onDone(), 900)
      return () => clearTimeout(t)
    }
    const timers = [
      setTimeout(()=> setStage(1), 1900),  // -> scramble
      setTimeout(()=> setStage(2), 2700),  // -> assemble brand
      setTimeout(()=> setStage(3), 4000),  // -> travel animation
      setTimeout(()=> setStage(4), 5400),  // -> loading progress
      setTimeout(()=> setStage(5), 7200),  // -> reveal
    ]
    return () => timers.forEach(clearTimeout)
  }, [prefersReduced, onDone])

  // cycle loading messages
  useEffect(() => {
    if (stage < 4) return
    const id = setInterval(() => setTipIdx(i => (i+1) % LOADING_LINES.length), 620)
    return () => clearInterval(id)
  }, [stage])

  // auto finish after reveal
  useEffect(() => {
    if (stage === 5) {
      const tm = setTimeout(onDone, 720)
      return () => clearTimeout(tm)
    }
  }, [stage, onDone])

  return (
    <AnimatePresence>
      <motion.div
        key="loader-root"
        className="fixed inset-0 z-[200] overflow-hidden"
        style={{ backgroundColor: '#071A2F', color: 'white' }}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55 }}
      >
        {/* deep navy gradient + vignette + glow spots */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(1100px 720px at 22% 18%, rgba(33,158,188,0.11), transparent 60%),
            radial-gradient(900px 600px at 80% 78%, rgba(251,133,0,0.065), transparent 60%),
            radial-gradient(1200px 900px at 50% 50%, #0b2340 0%, #071A2F 62%, #05101d 100%)
          `
        }} />
        {/* starfield */}
        <div className="absolute inset-0 opacity-[0.95]" style={{
          backgroundImage: `radial-gradient(1.3px 1.3px at 20px 30px, rgba(255,255,255,0.55) 50%, transparent 51%), radial-gradient(1px 1px at 140px 80px, rgba(160,240,255,0.5) 50%, transparent 51%), radial-gradient(1.2px 1.2px at 260px 150px, rgba(255,210,120,0.5) 50%, transparent 51%), radial-gradient(1px 1px at 520px 220px, rgba(255,255,255,0.45) 50%, transparent 51%), radial-gradient(1.1px 1.1px at 760px 110px, rgba(160,230,255,0.45) 50%, transparent 51%), radial-gradient(1px 1px at 920px 280px, rgba(255,255,255,0.38) 50%, transparent 51%)`,
          backgroundRepeat: 'repeat',
          backgroundSize: '960px 320px'
        }} />

        {/* STAGE 0/1 – Word Map */}
        <AnimatePresence>
          {stage <= 1 && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              {/* connection canvas */}
              <ConnectionCanvas nodes={words} active={stage === 0} />
              {/* words */}
              {words.map((w) => (
                <motion.span
                  key={w.id}
                  className="absolute select-none whitespace-nowrap"
                  style={{
                    left: `${w.x}%`,
                    top: `${w.y}%`,
                    fontSize: w.size,
                    fontWeight: w.weight,
                    color: w.color,
                    textShadow: '0 1px 14px rgba(0,20,30,0.32)',
                    transformOrigin: 'center',
                  }}
                  initial={{ opacity: 0, scale: 0.82 }}
                  animate={
                    stage === 0 ? {
                      opacity: w.opacity,
                      x: [0, w.driftX * 14, 0],
                      y: [0, w.driftY * 12, 0],
                      rotate: [w.rot, w.rot + w.rotSpeed * 8, w.rot],
                    } : {
                      opacity: 0,
                      scale: [1, 1.22, 0.7],
                      x: (Math.random()-0.5) * 420,
                      y: (Math.random()-0.5) * 320,
                      rotate: w.rot + (Math.random()-0.5)*120,
                      filter: ['blur(0px)', 'blur(2px)', 'blur(5px)']
                    }
                  }
                  transition={
                    stage === 0
                      ? { opacity: { duration: 0.45, delay: w.id * 0.0022 }, x: { duration: 7 + Math.random()*3, repeat: Infinity, ease: 'easeInOut', delay: w.id*0.013 }, y: { duration: 6 + Math.random()*3, repeat: Infinity, ease: 'easeInOut', delay: w.id*0.017 }, rotate: { duration: 9, repeat: Infinity, ease: 'linear' } }
                      : { duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: (w.id % 28) * 0.007 }
                  }
                >
                  {w.text}
                </motion.span>
              ))}
              {/* center hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: stage === 0 ? 0.88 : 0 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
              >
                <div className="text-[11px] tracking-widest uppercase text-cyan-200/80">Paryatan Holidays</div>
                <div className="text-[11px] text-cyan-100/55 mt-1">Mapping 120+ destinations…</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STAGE 2 / 3 – Brand assemble */}
        <AnimatePresence>
          {stage >= 2 && stage < 5 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* golden glow backdrop */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.96 }}
                transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
                className="absolute w-[620px] h-[620px] rounded-full blur-[90px] pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255,183,3,0.14) 0%, rgba(33,158,188,0.10) 38%, transparent 70%)'
                }}
              />
              <div className="relative text-center px-6">
                {/* logo mark */}
                <motion.div
                  initial={{ scale: 0.72, opacity: 0, rotate: -6 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
                  className="mx-auto w-16 h-16 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(255,183,3,0.28)]"
                  style={{
                    background: 'linear-gradient(135deg, #FFB703 0%, #FB8500 100%)'
                  }}
                >
                  <img src="/logo.png" alt="Paryatan Holidays" className="w-14 h-14 object-contain" />
                </motion.div>

                {/* Company name – letter by letter */}
                <div className="mt-5 font-display font-[800] tracking-tight text-white text-[38px] md:text-[60px] leading-[0.98]"
                  style={{ textShadow: '0 2px 28px rgba(0,0,0,0.38)' }}
                >
                  {'PARYATAN'.split('').map((ch, i) => (
                    <motion.span
                      key={'a'+i}
                      initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ delay: 0.08 + i * 0.035, duration: 0.45, ease: [0.22,1,0.36,1] }}
                      style={{ display: 'inline-block' }}
                    >{ch}</motion.span>
                  ))}
                  <br />
                  {'HOLIDAYS'.split('').map((ch, i) => (
                    <motion.span
                      key={'b'+i}
                      initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ delay: 0.32 + i * 0.032, duration: 0.45, ease: [0.22,1,0.36,1] }}
                      style={{
                        display: 'inline-block',
                        color: '#FFB703',
                        textShadow: '0 0 22px rgba(255,183,3,0.28)'
                      }}
                    >{ch}</motion.span>
                  ))}
                </div>

                {/* shine sweep */}
                <motion.div
                  initial={{ x: '-140%' }}
                  animate={{ x: '220%' }}
                  transition={{ delay: 0.82, duration: 0.95, ease: [0.4,0,0.2,1] }}
                  className="pointer-events-none absolute left-0 right-0 mx-auto top-[56%] h-[54px] w-[56%] max-w-[560px]"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
                    filter: 'blur(8px)',
                    transform: 'skewX(-18deg)',
                    opacity: 0.95
                  }}
                />

                {/* tagline */}
                <motion.div
                  initial={{ opacity: 0, y: 8, letterSpacing: '0.18em' }}
                  animate={{ opacity: 1, y: 0, letterSpacing: '0.04em' }}
                  transition={{ delay: 0.92, duration: 0.55 }}
                  className="mt-3 text-[15.5px] md:text-[17px] text-cyan-100/92 italic"
                  style={{ fontWeight: 380 }}
                >
                  Miles to Go…
                </motion.div>

                {/* sub tag */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.15 }}
                  className="mt-2 text-[12px] text-cyan-100/70"
                >
                  Enjoy the World • Since 2012 • Bhopal
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STAGE 3 – travel animation overlay */}
        <AnimatePresence>
          {stage === 3 && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* flying plane – left to right */}
              <motion.div
                className="absolute left-[-10%] top-[28%]"
                initial={{ x: 0, y: 0 }}
                animate={{ x: '120vw', y: [0, -14, 8, -6, 0] }}
                transition={{ duration: 2.2, ease: 'easeInOut' }}
                style={{ filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.28))' }}
              >
                <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                  <g transform="rotate(-8 36 36)">
                    <ellipse cx="36" cy="36" rx="5.5" ry="24" fill="white"/>
                    <ellipse cx="36" cy="36" rx="28" ry="4.8" fill="#e9f7ff"/>
                    <circle cx="36" cy="18" r="3.2" fill="#bfefff"/>
                  </g>
                </svg>
                {/* contrail */}
                <div className="absolute top-1/2 -left-24 w-24 h-[2px] bg-gradient-to-l from-white/65 to-transparent blur-[0.3px]" />
              </motion.div>

              {/* location pins popping */}
              {[
                { left: '22%', top: '62%' },
                { left: '48%', top: '68%' },
                { left: '71%', top: '58%' },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{ left: p.left, top: p.top, background: '#FFB703', boxShadow: '0 0 18px rgba(255,183,3,0.65)' }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.25, 1], opacity: [0,1,1] }}
                  transition={{ delay: 0.25 + i*0.18, duration: 0.45 }}
                >
                  <div className="absolute inset-[-7px] rounded-full border border-amber-300/55 animate-ping" />
                </motion.div>
              ))}

              {/* compass – bottom left */}
              <motion.div
                className="absolute left-8 bottom-24 md:bottom-28 opacity-[0.92]"
                initial={{ rotate: -40, opacity: 0 }}
                animate={{ rotate: 14, opacity: 0.92 }}
                transition={{ duration: 1.1 }}
              >
                <div className="w-14 h-14 rounded-full border border-cyan-200/35 flex items-center justify-center text-cyan-100 text-[11px] tracking-widest backdrop-blur-sm bg-white/[0.045]">
                  N
                  <div className="absolute w-[1px] h-6 bg-gradient-to-b from-amber-300 to-transparent -top-1" style={{ transformOrigin: 'bottom', transform: 'rotate(18deg)' }} />
                </div>
              </motion.div>

              {/* floating clouds / balloons */}
              <motion.div
                className="absolute right-[10%] top-[22%] text-[11px] text-cyan-100/70 backdrop-blur px-2.5 py-1 rounded-full bg-white/[0.055] border border-white/[0.09]"
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: [12, -6, 12], opacity: 1 }}
                transition={{ y: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.4 } }}
              >
                ✈️ Kashmir • Kerala • Dubai • Bali
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STAGE 4 – loading progress */}
        <AnimatePresence>
          {stage >= 4 && stage < 5 && (
            <motion.div
              className="absolute bottom-0 inset-x-0 pb-10 md:pb-14 flex flex-col items-center px-6"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-[360px] max-w-[92vw] rounded-[18px] bg-white/[0.065] backdrop-blur-xl border border-white/[0.13] shadow-[0_20px_70px_rgba(0,0,0,0.45)] px-5 py-4 text-center">
                <div className="text-[12.5px] text-cyan-50 min-h-[18px]">
                  {LOADING_LINES[tipIdx % LOADING_LINES.length]}
                </div>
                <div className="mt-3 h-[5px] rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #219EBC 0%, #FFB703 55%, #FB8500 100%)',
                      boxShadow: '0 0 18px rgba(255,183,3,0.28)'
                    }}
                    animate={{ width: ['34%', '76%', '92%', '100%'] }}
                    transition={{ duration: 1.9, times: [0,0.45,0.78,1], ease: 'easeOut' }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-cyan-100/70 mt-2">
                  <span>Secure • ATOL / IATA affiliated</span>
                  <span>Loading…</span>
                </div>
              </div>
              <div className="text-[11.5px] text-cyan-100/65 mt-3">
                4.8★ Google • 500+ reviews • 24×7 travel support
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* skip */}
        <button
          onClick={() => onDone()}
          className="absolute bottom-4 right-4 text-[11.5px] text-cyan-200/70 hover:text-cyan-50 underline underline-offset-4 z-10"
        >
          Skip intro
        </button>

        {/* bottom fade – helps text legibility */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-[#05131d]/55 to-transparent" />
      </motion.div>
    </AnimatePresence>
  )
}
