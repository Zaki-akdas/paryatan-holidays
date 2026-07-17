import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, MapPin, Calendar, BedDouble, Utensils, Car, IndianRupee } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { packages, company } from '../../data/packages'
import { saveLead } from '../../lib/leads'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { lockScroll, unlockScroll } from '../../lib/scroll-lock'

const allDestinations = Object.values(packages).flat().map(p => ({ id: p.id, label: `${p.route} • ${p.duration}`, base: parseInt((p.priceFrom||'').replace(/[^\d]/g,'')) || 28000 }))

export default function TripCustomizer({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [destinationId, setDestinationId] = useState(allDestinations[2]?.id || '')
  const [startDate, setStartDate] = useState('')
  const [nights, setNights] = useState(5)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [hotel, setHotel] = useState<'3'|'4'|'5'>('4')
  const [meals, setMeals] = useState<'CP'|'MAP'|'AP'>('CP')
  const [transport, setTransport] = useState<'Sedan'|'SUV'|'Tempo'>('Sedan')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')

  const dest = useMemo(() => allDestinations.find(d => d.id === destinationId) || allDestinations[0], [destinationId])

  useEffect(() => {
    if (open) {
      lockScroll()
      return () => unlockScroll()
    }
  }, [open])

  const travelers = adults + Math.round(children * 0.6)
  const hotelMult = hotel === '3' ? 1 : hotel === '4' ? 1.38 : 1.95
  const mealMult = meals === 'CP' ? 1 : meals === 'MAP' ? 1.18 : 1.32
  const basePerNight = Math.round((dest?.base || 28000) / 6)
  const estTotal = Math.round(basePerNight * nights * (0.72 + travelers*0.28) * hotelMult * mealMult * 0.92)
  const perPerson = Math.round(estTotal / Math.max(1, adults + children))

  const submit = () => {
    if (!name || !phone) { toast.error('Please enter your name & phone'); return }
    saveLead({
      name, email, phone,
      destination: dest.label,
      message: `Custom trip: ${nights}N, Adults ${adults}, Children ${children}, Hotel ${hotel}★, Meals ${meals}, Transport ${transport}. Notes: ${notes || '-'}`,
      travelers: adults + children,
      budget: `₹${estTotal.toLocaleString('en-IN')}`,
      startDate,
      hotelTier: hotel + '★',
      source: 'Trip Customizer'
    })
    const waText = `Hi Paryatan Holidays – Trip Customizer enquiry\nName: ${name}\nPhone: ${phone}\nDestination: ${dest.label}\nDates: ${startDate || 'Flexible'}\nTravelers: ${adults} Adults, ${children} Children\nNights: ${nights}\nHotel: ${hotel}★\nMeals: ${meals}\nTransport: ${transport}\nEst. Budget: ₹${estTotal.toLocaleString('en-IN')}\nNotes: ${notes || '-'}\n\nFrom paryatan.co.in Trip Customizer`
    toast.success('Trip saved! Opening WhatsApp…')
    window.open(`https://wa.me/${company.phoneRaw}?text=${encodeURIComponent(waText)}`, '_blank')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, y: 22, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.98 }}
            className="relative bg-white w-full max-w-5xl rounded-[24px] shadow-elevated overflow-hidden max-h-[92vh] flex flex-col"
          >
            <div className="px-5 md:px-7 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-[#f6fbfc] to-white">
              <div className="flex items-center gap-2 font-display text-[18px] md:text-[20px] text-[#14323c]"><Sparkles className="w-4 h-4 text-amber-500" /> Build Your Trip – Free Custom Quote</div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X className="w-4 h-4" /></button>
            </div>
            <div className="scroll-native overflow-y-auto grid lg:grid-cols-[1.35fr_.85fr] gap-6 p-5 md:p-7">
              {/* left – builder */}
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> Destination</Label>
                    <select value={destinationId} onChange={e=>setDestinationId(e.target.value)} className="mt-1.5 w-full h-11 rounded-xl border border-input bg-white px-3 text-sm">
                      {allDestinations.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Start date</Label>
                    <Input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="mt-1.5" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Nights</Label><Input type="number" min={1} max={21} value={nights} onChange={e=>setNights(parseInt(e.target.value)||1)} className="mt-1.5" /></div>
                  <div><Label>Adults</Label><Input type="number" min={1} max={20} value={adults} onChange={e=>setAdults(parseInt(e.target.value)||1)} className="mt-1.5" /></div>
                  <div><Label>Children</Label><Input type="number" min={0} max={20} value={children} onChange={e=>setChildren(parseInt(e.target.value)||0)} className="mt-1.5" /></div>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5"/> Hotel</Label>
                    <div className="flex gap-1.5 mt-1.5">
                      {(['3','4','5'] as const).map(h => (
                        <button key={h} type="button" onClick={()=>setHotel(h)} className={`px-3 py-2 rounded-xl border text-sm flex-1 ${hotel===h ? 'bg-[#0b5b68] text-white border-[#0b5b68]' : 'bg-white border-slate-200'}`}>{h}★</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="flex items-center gap-1"><Utensils className="w-3.5 h-3.5"/> Meals</Label>
                    <div className="flex gap-1.5 mt-1.5 text-[12.5px]">
                      {(['CP','MAP','AP'] as const).map(m => (
                        <button key={m} type="button" onClick={()=>setMeals(m)} className={`px-2.5 py-2 rounded-xl border flex-1 ${meals===m ? 'bg-[#0b5b68] text-white border-[#0b5b68]' : 'bg-white border-slate-200'}`}>{m}</button>
                      ))}
                    </div>
                    <div className="text-[10.5px] text-slate-500 mt-1">CP=Breakfast, MAP=Breakfast+Dinner, AP=All Meals</div>
                  </div>
                  <div>
                    <Label className="flex items-center gap-1"><Car className="w-3.5 h-3.5"/> Transport</Label>
                    <select value={transport} onChange={e=>setTransport(e.target.value as any)} className="mt-1.5 w-full h-11 rounded-xl border border-input bg-white px-3 text-sm">
                      <option value="Sedan">Sedan AC</option>
                      <option value="SUV">SUV / Innova</option>
                      <option value="Tempo">Tempo Traveller</option>
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div><Label>Name*</Label><Input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} className="mt-1.5" /></div>
                  <div><Label>Phone*</Label><Input placeholder="+91…" value={phone} onChange={e=>setPhone(e.target.value)} className="mt-1.5" /></div>
                  <div><Label>Email</Label><Input placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1.5" /></div>
                </div>
                <div>
                  <Label>Special requests</Label>
                  <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Honeymoon cake? Jain food? Senior citizen friendly? Extra bed?" className="mt-1.5 w-full rounded-xl border border-input bg-white px-3 py-2.5 text-sm min-h-[84px]" />
                </div>
              </div>

              {/* right – live quote */}
              <div className="lg:sticky lg:top-0">
                <div className="rounded-[20px] border border-cyan-100 bg-[#f7fbfc] p-5 shadow-sm">
                  <div className="text-[12px] uppercase tracking-widest text-primary font-semibold">Live Estimate</div>
                  <div className="mt-2 font-display text-[30px] text-[#14323c] flex items-center gap-1"><IndianRupee className="w-5 h-5"/>{estTotal.toLocaleString('en-IN')}</div>
                  <div className="text-sm text-slate-600">≈ ₹{perPerson.toLocaleString('en-IN')} per person • {nights} nights • {adults+children} travellers</div>
                  <ul className="mt-4 text-[13.5px] text-slate-700 space-y-1.5">
                    <li>✓ {dest.label.split('•')[0]}</li>
                    <li>✓ {hotel}★ Hotels – handpicked</li>
                    <li>✓ {meals} Meal Plan</li>
                    <li>✓ {transport} – private AC</li>
                    <li>✓ All sightseeing & transfers</li>
                    <li>✓ 24×7 Paryatan support</li>
                    <li>✓ Free cancellation options</li>
                  </ul>
                  <Button variant="sunset" className="w-full mt-4" onClick={submit}>Send to WhatsApp – Get Final Quote</Button>
                  <p className="text-[11.5px] text-slate-500 mt-2 text-center">No payment now • Free itinerary in 2 hrs • Price may vary by dates/hotels</p>
                  <div className="mt-3 text-[11.5px] text-slate-500 bg-white rounded-xl border border-slate-200 px-3 py-2">
                    <b className="text-slate-700">Why Paryatan?</b> 4.8★ Google • 48,000+ happy travellers • IATA / ADTOI / OTOAI • Financially stable • Transparent pricing
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
