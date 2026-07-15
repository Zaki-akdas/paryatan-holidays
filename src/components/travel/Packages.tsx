import { packages, packageTabs, type PackageItem, buildItinerary, company } from '../../data/packages'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { motion } from 'framer-motion'
import { X, Utensils, Bus, Camera, CheckCircle2, Star } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { saveLead } from '../../lib/leads'

// images
import tajImg from '../../assets/gallery-taj.jpg'
import kashmirImg from '../../assets/gallery-kashmir.jpg'
import keralaImg from '../../assets/gallery-kerala.jpg'
import goaImg from '../../assets/gallery-goa.jpg'
import rajasthanImg from '../../assets/gallery-rajasthan.jpg'
import northeastImg from '../../assets/gallery-northeast.jpg'
import shimlaImg from '../../assets/gallery-shimla.jpg'
import ladakhImg from '../../assets/gallery-ladakh.jpg'
import andamanImg from '../../assets/gallery-andaman.jpg'
import dubaiImg from '../../assets/gallery-dubai.jpg'
import baliImg from '../../assets/gallery-bali.jpg'
import europeImg from '../../assets/gallery-europe.jpg'

const imgMap: Record<PackageItem['image'], string> = {
  taj: tajImg, kashmir: kashmirImg, kerala: keralaImg, goa: goaImg,
  rajasthan: rajasthanImg, northeast: northeastImg, shimla: shimlaImg,
  ladakh: ladakhImg, andaman: andamanImg, dubai: dubaiImg, bali: baliImg, europe: europeImg,
}

function PackageModal({ pkg, onClose }: { pkg: PackageItem | null, onClose: () => void }) {
  if (!pkg) return null
  const itinerary = buildItinerary(pkg)
  const img = imgMap[pkg.image]
  const whatsapp = () => {
    const text = `Hi Paryatan Holidays, I'm interested in: ${pkg.route} (${pkg.duration}). Please share detailed itinerary & best price.`
    saveLead({
      name: 'Package Enquiry',
      email: '',
      phone: '',
      destination: pkg.route,
      message: `Package enquiry: ${pkg.route} – ${pkg.duration}`,
      source: 'Package Modal',
    })
    window.open(`https://wa.me/${company.phoneRaw}?text=${encodeURIComponent(text)}`, '_blank')
  }
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="relative bg-white w-full max-w-4xl rounded-[24px] shadow-elevated overflow-hidden max-h-[90vh] flex flex-col">
        <div className="relative h-56 md:h-64">
          <img src={img} alt={pkg.route} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 bg-white/90 rounded-full p-2 hover:bg-white"><X className="w-4 h-4" /></button>
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="text-[12px] opacity-90">{pkg.duration} • {pkg.priceFrom || 'Custom pricing'}</div>
            <h3 className="font-display text-[26px] md:text-[30px] leading-tight">{pkg.route}</h3>
          </div>
        </div>
        <div className="overflow-y-auto px-5 md:px-7 py-5 space-y-6 text-[14.5px]">
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-2xl bg-[#f6fbfc] border border-cyan-100 px-4 py-3"><div className="flex items-center gap-2 font-semibold text-[#1a3440]"><Bus className="w-4 h-4 text-primary"/> Transport</div><div className="text-slate-700 mt-1">{pkg.transport}</div></div>
            <div className="rounded-2xl bg-[#f6fbfc] border border-cyan-100 px-4 py-3"><div className="flex items-center gap-2 font-semibold text-[#1a3440]"><Utensils className="w-4 h-4 text-primary"/> Meals</div><div className="text-slate-700 mt-1">{pkg.meals}</div></div>
            <div className="rounded-2xl bg-[#f6fbfc] border border-cyan-100 px-4 py-3"><div className="flex items-center gap-2 font-semibold text-[#1a3440]"><Camera className="w-4 h-4 text-primary"/> Sightseeing</div><div className="text-slate-700 mt-1">{pkg.sightseeing.length} key spots</div></div>
          </div>
          <div><h4 className="font-display text-xl text-[#14323c]">Sightseeing Highlights</h4>
            <ul className="mt-2 grid sm:grid-cols-2 gap-2 text-slate-700">{pkg.sightseeing.map(s => <li key={s} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0"/>{s}</li>)}</ul>
          </div>
          <div><h4 className="font-display text-xl text-[#14323c]">Day-wise Itinerary</h4>
            <div className="mt-3 space-y-3">{itinerary.map(d => (
              <div key={d.day} className="flex gap-4">
                <div className="w-14 shrink-0 text-[12px] font-semibold text-primary pt-0.5">Day {d.day}</div>
                <div><div className="font-semibold text-[#1c3540]">{d.title}</div><div className="text-sm text-slate-600">{d.detail}</div></div>
              </div>
            ))}</div>
          </div>
          <div className="grid md:grid-cols-2 gap-5 text-sm bg-[#fafefe] border border-cyan-100 rounded-2xl p-4">
            <div><div className="font-semibold text-[#1c3540] mb-1.5">Package Includes</div>
              <ul className="space-y-1 text-slate-700 list-disc pl-4">
                <li>{pkg.meals}</li><li>{pkg.transport}</li><li>Hotel stay – 3★ / 4★ options</li><li>All sightseeing as listed</li><li>Toll / parking / driver allowance</li><li>24×7 Paryatan on-trip support</li>
              </ul>
            </div>
            <div><div className="font-semibold text-[#1c3540] mb-1.5">Exclusions</div>
              <ul className="space-y-1 text-slate-600 list-disc pl-4">
                <li>Flights / Trains unless mentioned</li><li>Entry tickets / guide charges</li><li>Personal expenses</li><li>Travel insurance (add-on)</li><li>Anything not in 'Includes'</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-center pt-1 pb-2">
            <Button variant="sunset" onClick={whatsapp}>Book on WhatsApp</Button>
            <div className="text-sm text-slate-600">Price from <b className="text-[#14323c]">{pkg.priceFrom || 'on request'}</b> • Fully customizable</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const styleFilters = [
  { id: 'all', label: 'All' },
  { id: 'family', label: 'Family' },
  { id: 'honeymoon', label: 'Honeymoon' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'wildlife', label: 'Wildlife' },
  { id: 'pilgrimage', label: 'Pilgrimage' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'group', label: 'Group' },
] as const

function matchStyle(pkg: PackageItem, catId: string, style: string) {
  if (style === 'all') return true
  const hay = (pkg.route + ' ' + catId).toLowerCase()
  const map: Record<string, string[]> = {
    family: ['family','goa','kerala','shimla','jaipur','ooty','darjeeling','andaman','singapore','thailand','dubai'],
    honeymoon: ['honeymoon','maldives','bali','kerala','andaman','kashmir','manali','goa'],
    adventure: ['adventure','ladakh','bike','rafting','spiti','trek','scuba','manali'],
    wildlife: ['wildlife','corbett','ranthambore','gir','kaziranga','tiger','safari','bandhavgarh','sundarbans'],
    pilgrimage: ['vaishno','haridwar','rishikesh','puri','somnath','temple','pilgrim'],
    corporate: ['corporate','mice','goa','jaipur','kerala','shimla','thailand','dubai','incentive','offsite'],
    group: ['group','school','amritsar','hyderabad','student','educational'],
  }
  return (map[style] || []).some(k => hay.includes(k))
}

export default function Packages() {
  const [active, setActive] = useState<PackageItem | null>(null)
  const [styleFilter, setStyleFilter] = useState<string>('all')

  return (
    <section id="packages" className="section-pad bg-white/92 backdrop-blur-[1.5px] overflow-hidden">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-[12px] uppercase tracking-widest text-primary font-semibold">Handpicked Packages</p>
          <h2 className="text-[34px] md:text-[44px] tracking-tight text-[#13313b] leading-tight mt-2">India & International bestsellers</h2>
          <p className="text-slate-600 mt-3">Filter by travel style, pick a region – click any card for full day-wise itinerary with meals, sightseeing & transport.</p>
        </motion.div>

        {/* Style filter – customization */}
        <div className="flex flex-wrap justify-center gap-2 mt-6 text-[12.5px]">
          {styleFilters.map(s => (
            <button
              key={s.id}
              onClick={()=>setStyleFilter(s.id)}
              className={`px-3.5 py-1.5 rounded-full border transition ${styleFilter===s.id ? 'bg-[#0b5b68] text-white border-[#0b5b68] shadow-sm' : 'bg-white border-slate-200 hover:border-cyan-300 text-slate-700'}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <Tabs defaultValue="north" className="mt-7">
          <div className="flex justify-center">
            <TabsList className="max-w-full flex-wrap justify-center h-auto">
              {packageTabs.map(t => <TabsTrigger key={t.id} value={t.id}>{t.label}</TabsTrigger>)}
            </TabsList>
          </div>

          {packageTabs.map(tab => {
            const list = packages[tab.id]?.filter(p => matchStyle(p, tab.id, styleFilter)) ?? []
            return (
              <TabsContent key={tab.id} value={tab.id}>
                {list.length === 0 ? (
                  <div className="text-center text-slate-500 py-12">No packages match this style in {tab.label}. Try “All” or another region.</div>
                ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {list.map((p, i) => (
                    <motion.button
                      key={p.id}
                      onClick={()=>setActive(p)}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ duration: .38, delay: i * 0.032 }}
                      whileHover={{ y: -5 }}
                      className="text-left rounded-[20px] border border-slate-200 bg-[#fcfeff] overflow-hidden shadow-sm hover:shadow-elevated transition-all group"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img src={imgMap[p.image]} alt={p.route} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        <span className="absolute bottom-2.5 left-3 text-white text-[11.5px] bg-black/30 backdrop-blur px-2 py-1 rounded-full">{p.duration}</span>
                        {p.priceFrom && <span className="absolute top-2.5 right-2.5 text-[11px] bg-white/95 px-2.5 py-1 rounded-full font-semibold text-[#17343d] shadow">{p.priceFrom}</span>}
                        {p.highlight && <span className="absolute top-2.5 left-2.5 text-[10.5px] bg-amber-400 text-amber-950 px-2 py-1 rounded-full font-bold flex items-center gap-1"><Star className="w-3 h-3 fill-amber-950" /> Hot</span>}
                      </div>
                      <div className="p-4">
                        <div className="font-semibold text-[#1b3440] leading-snug min-h-[44px]">{p.route}</div>
                        <div className="flex items-center gap-3 mt-2.5 text-[12.2px] text-slate-600">
                          <span className="inline-flex items-center gap-1"><Bus className="w-3.5 h-3.5"/>{p.transport.split('+')[0].trim().slice(0,24)}</span>
                          <span className="inline-flex items-center gap-1"><Utensils className="w-3.5 h-3.5"/>{p.meals.split('|')[0].trim()}</span>
                        </div>
                        <div className="mt-3 text-[13px] text-primary font-medium">View full itinerary →</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
        <p className="text-center text-sm text-slate-500 mt-8">Don’t see your route? Use the Trip Customizer – we build custom trips in 2 hours.</p>
      </div>
      <PackageModal pkg={active} onClose={()=>setActive(null)} />
    </section>
  )
}

