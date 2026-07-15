import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle } from 'lucide-react'
import { packages, services, company } from '../../data/packages'
import { Button } from '../ui/button'

type Msg = { id: string; role: 'user' | 'bot'; text: string }

const QUICK = [
  'Best Kashmir package?',
  'Honeymoon in Bali price?',
  'Kerala houseboat details',
  'Visa help available?',
  'Contact number?',
  'International tours list',
]

function answerTravel(q: string): string {
  const s = q.toLowerCase()

  const allPkgs = Object.values(packages).flat()

  for (const p of allPkgs) {
    const routeWords = p.route.toLowerCase().split(/[^a-z]+/)
    if (routeWords.some(w => w.length > 3 && s.includes(w))) {
      return `**${p.route}**\n${p.duration} • ${p.priceFrom || 'Price on request'}\n\nTransport: ${p.transport}\nMeals: ${p.meals}\nSightseeing: ${p.sightseeing.slice(0,3).join(', ')}\n\nI can get you a full day-wise itinerary on WhatsApp in 2 minutes. Want me to open a chat with Paryatan?`
    }
  }

  if (/(kashmir|kasmir|srinagar|gulmarg)/.test(s)) {
    const p = allPkgs.find(x => x.id === 'north-kashmir')
    return p ? `Kashmir – Best Seller!\n${p.route}\n${p.duration} • ${p.priceFrom}\n${p.transport}\nMeals: ${p.meals}\nIncludes: ${p.sightseeing.join(', ')}` : 'Kashmir 6N/7D from ₹38,900 pp – Srinagar, Gulmarg, Pahalgam, Dal Lake shikara.'
  }
  if (/(bali|honeymoon)/.test(s)) {
    return `Bali Honeymoon – Ubud – Seminyak\n5N / 6D • ₹64,900 pp\nFlight + Pvt Car • Daily Breakfast\nUbud rice terraces, Tanah Lot, Uluwatu Kecak dance.\nMaldives Honeymoon also available – 3N Water Villa ₹82,900 per couple.`
  }
  if (/(kerala|alleppey|munnar|houseboat)/.test(s)) {
    return `Wonders of Kerala – 6N / 7D • ₹36,900 pp\nMunnar – Thekkady – Alleppey\nFlight to Kochi + AC Car / Houseboat\nTea gardens, Periyar wildlife cruise, overnight Alleppey houseboat. Meals: Daily Breakfast.`
  }
  if (/(visa|passport)/.test(s)) {
    return `Yes – Visa & Passport Assistance is included in our services.\nWe handle documentation, appointments, fast-track for Dubai, Thailand, Singapore, Schengen, UK, USA etc.\nFee: embassy fee + ₹1,800 service.\nCall ${company.phone}`
  }
  if (/(contact|phone|whatsapp|email|address|office)/.test(s)) {
    return `Paryatan Holidays, Bhopal\n${company.address}\nPhone / WhatsApp: ${company.phone} / ${company.phoneAlt}\nEmail: ${company.email}\nHours: 9am–9pm IST, 7 days – 24×7 on-trip support`
  }
  if (/(international|foreign|dubai|thailand|singapore|europe|maldives|bali|vietnam|turkey)/.test(s)) {
    return `International Bestsellers:\n• Dubai – Abu Dhabi 4N – ₹59,900\n• Thailand Bangkok-Pattaya 4N – ₹39,900\n• Singapore-Malaysia 5N – ₹78,900\n• Bali 5N – ₹64,900\n• Europe Classic 8N – ₹1,89,900\n• Maldives 3N – ₹82,900/couple\n• Vietnam 5N – ₹69,900\n• Turkey 6N – ₹1,24,900\nAll with flights, hotels, sightseeing, visa assistance.`
  }
  if (/(service|what.*you.*do|offer)/.test(s)) {
    return `Paryatan services:\n${services.slice(0,9).map(x=> '• '+x.title).join('\n')}\n…and more. Full MICE / corporate / groups / pilgrimage handling.`
  }
  if (/(price|cost|cheap|budget)/.test(s)) {
    return `Sample starting prices (per person, twin sharing):\n• Goa 3N – ₹16,900\n• Himachal 6N – ₹29,500\n• Kashmir 6N – ₹38,900\n• Kerala 6N – ₹36,900\n• Dubai 4N – ₹59,900\n• Thailand 4N – ₹39,900\n• Europe 8N – ₹1,89,900\nAll customizable. Tell me your destination + dates for an exact quote.`
  }
  if (/(cancel|refund|payment)/.test(s)) {
    return `Flexible booking – free date change up to 21 days prior on most domestic packages. Cancellation as per hotel/airline policy – we always push for maximum refund. UPI / Card / Netbanking / EMI accepted.`
  }

  const picks = allPkgs.slice(0,3)
  return `I can help with Paryatan Holidays packages, visa, hotels, flights, and India / International itineraries.\n\nTry:\n• "Kashmir 7 days price?"\n• "Kerala houseboat"\n• "Bali honeymoon"\n• "Visa for Dubai?"\n\nPopular right now:\n${picks.map(p=>`• ${p.route} – ${p.duration} – ${p.priceFrom || 'POA'}`).join('\n')}\n\nOr tap a quick question below, or WhatsApp us at ${company.phone} – humans reply in ~2 hrs.`
}

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 'm0', role: 'bot', text: `Namaste! I'm your Paryatan travel assistant.\nAsk me about Kashmir, Kerala, Goa, Dubai, Bali, Europe, visa, honeymoon packages, prices, meals, transport…\n\nI can help you plan your perfect trip.` }
  ])
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing])

  const send = (text: string) => {
    const t = text.trim()
    if (!t) return
    const userMsg: Msg = { id: Math.random().toString(36).slice(2), role: 'user', text: t }
    setMsgs(m => [...m, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const reply = answerTravel(t)
      setMsgs(m => [...m, { id: Math.random().toString(36).slice(2), role: 'bot', text: reply }])
      setTyping(false)
    }, 560 + Math.random()*420)
  }

  return (
    <>
      <Button
        onClick={()=>setOpen(v=>!v)}
        variant="sunset"
        size="sm"
        className="fixed bottom-5 right-5 z-[90] shadow-sunset"
        aria-label="Open travel assistant"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="hidden sm:inline">AI Assistant</span>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-[76px] right-4 z-[90] w-[92vw] max-w-[380px] rounded-[20px] shadow-elevated border border-slate-200 bg-white overflow-hidden flex flex-col"
            style={{ height: 'min(560px, 72vh)' }}
          >
            <div className="bg-gradient-ocean text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-display font-semibold">
                <span className="grid place-items-center w-7 h-7 rounded-full bg-white/15">
                  <MessageCircle className="w-4 h-4" />
                </span>
                Travel Assistant
              </div>
              <button onClick={()=>setOpen(false)} className="p-1 rounded-full hover:bg-white/15"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3 bg-[#f7fbfc] text-[13.5px] leading-relaxed space-y-2.5">
              {msgs.map(m => (
                <div key={m.id} className={m.role === 'user' ? 'text-right' : ''}>
                  <div className={`inline-block max-w-[84%] rounded-2xl px-3 py-2 whitespace-pre-wrap ${m.role==='user' ? 'bg-[#0b6b78] text-white rounded-br-md' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="text-slate-500 text-xs flex items-center gap-1">Assistant is typing…</div>
              )}
              <div ref={endRef} />
            </div>

            <div className="px-3 py-2 border-t border-slate-100 bg-white flex flex-wrap gap-1.5">
              {QUICK.slice(0,4).map(q => (
                <button key={q} onClick={()=>send(q)} className="text-[11px] px-2.5 py-1 rounded-full bg-secondary hover:bg-cyan-50 border border-cyan-100 text-[#24515c]">{q}</button>
              ))}
            </div>

            <form onSubmit={e=>{e.preventDefault(); send(input)}} className="border-t border-slate-200 p-2.5 bg-white flex gap-2">
              <input
                value={input}
                onChange={e=>setInput(e.target.value)}
                placeholder="Ask about packages, visa, prices…"
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-300"
              />
              <Button type="submit" size="icon" variant="sunset" aria-label="Send"><Send className="w-4 h-4" /></Button>
            </form>
            <div className="px-3 pb-2 text-[10.5px] text-slate-500 bg-white">Offline demo – answers from Paryatan's package database. For booking: <a className="text-primary underline" href={`https://wa.me/${company.phoneRaw}`} target="_blank" rel="noreferrer">WhatsApp {company.phone}</a></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
