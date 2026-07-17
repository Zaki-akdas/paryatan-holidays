import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { X, Utensils, Bus, Camera, CheckCircle2, Star } from 'lucide-react'
import { Button } from '../components/ui/button'
import { getPackageById, buildItinerary, company, type PackageItem } from '../data/packages'
import { saveLead } from '../lib/leads'
import tajImg from '../assets/gallery-taj.jpg'
import kashmirImg from '../assets/gallery-kashmir.jpg'
import keralaImg from '../assets/gallery-kerala.jpg'
import goaImg from '../assets/gallery-goa.jpg'
import rajasthanImg from '../assets/gallery-rajasthan.jpg'
import northeastImg from '../assets/gallery-northeast.jpg'
import shimlaImg from '../assets/gallery-shimla.jpg'
import ladakhImg from '../assets/gallery-ladakh.jpg'
import andamanImg from '../assets/gallery-andaman.jpg'
import dubaiImg from '../assets/gallery-dubai.jpg'
import baliImg from '../assets/gallery-bali.jpg'
import europeImg from '../assets/gallery-europe.jpg'

const imgMap: Record<PackageItem['image'], string> = {
  taj: tajImg, kashmir: kashmirImg, kerala: keralaImg, goa: goaImg,
  rajasthan: rajasthanImg, northeast: northeastImg, shimla: shimlaImg,
  ladakh: ladakhImg, andaman: andamanImg, dubai: dubaiImg, bali: baliImg, europe: europeImg,
}

export default function ItineraryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pkg = getPackageById(id)

  if (!pkg) return <Navigate to="/" replace />

  const itinerary = buildItinerary(pkg)
  const img = imgMap[pkg.image]

  const close = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/')
  }

  const whatsapp = () => {
    const text = `Hi Paryatan Holidays, I'm interested in: ${pkg.route} (${pkg.duration}). Please share detailed itinerary & best price.`
    saveLead({
      name: 'Package Enquiry',
      email: '',
      phone: '',
      destination: pkg.route,
      message: `Package enquiry: ${pkg.route} – ${pkg.duration}`,
      source: 'Itinerary Page',
    })
    window.open(`https://wa.me/${company.phoneRaw}?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="min-h-[100dvh] bg-white">
      <div className="relative h-52 sm:h-64 md:h-72 shrink-0">
        <img src={img} alt={pkg.route} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <button
          onClick={close}
          aria-label="Close itinerary"
          className="absolute top-3 right-3 z-10 bg-white/90 rounded-full p-2 hover:bg-white shadow"
        >
          <X className="w-4 h-4" />
        </button>
        {pkg.highlight && (
          <span className="absolute top-3 left-3 text-[10.5px] bg-amber-400 text-amber-950 px-2 py-1 rounded-full font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-950" /> Hot
          </span>
        )}
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <div className="text-[12px] opacity-90">{pkg.duration} • {pkg.priceFrom || 'Custom pricing'}</div>
          <h1 className="font-display text-[24px] sm:text-[30px] md:text-[34px] leading-tight">{pkg.route}</h1>
        </div>
      </div>

      <div className="scroll-native px-5 md:px-8 py-6 max-w-4xl mx-auto space-y-6 text-[14.5px]">
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div className="rounded-2xl bg-[#f6fbfc] border border-cyan-100 px-4 py-3"><div className="flex items-center gap-2 font-semibold text-[#1a3440]"><Bus className="w-4 h-4 text-primary" /> Transport</div><div className="text-slate-700 mt-1">{pkg.transport}</div></div>
          <div className="rounded-2xl bg-[#f6fbfc] border border-cyan-100 px-4 py-3"><div className="flex items-center gap-2 font-semibold text-[#1a3440]"><Utensils className="w-4 h-4 text-primary" /> Meals</div><div className="text-slate-700 mt-1">{pkg.meals}</div></div>
          <div className="rounded-2xl bg-[#f6fbfc] border border-cyan-100 px-4 py-3"><div className="flex items-center gap-2 font-semibold text-[#1a3440]"><Camera className="w-4 h-4 text-primary" /> Sightseeing</div><div className="text-slate-700 mt-1">{pkg.sightseeing.length} key spots</div></div>
        </div>

        <div>
          <h2 className="font-display text-xl text-[#14323c]">Sightseeing Highlights</h2>
          <ul className="mt-2 grid sm:grid-cols-2 gap-2 text-slate-700">
            {pkg.sightseeing.map((s) => (
              <li key={s} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />{s}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl text-[#14323c]">Day-wise Itinerary</h2>
          <div className="mt-3 space-y-3">
            {itinerary.map((d) => (
              <div key={d.day} className="flex gap-4">
                <div className="w-14 sm:w-16 shrink-0 text-[12px] sm:text-[13px] font-semibold text-primary pt-0.5">Day {d.day}</div>
                <div>
                  <div className="font-semibold text-[#1c3540]">{d.title}</div>
                  <div className="text-sm text-slate-600 leading-relaxed">{d.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 text-sm bg-[#fafefe] border border-cyan-100 rounded-2xl p-4">
          <div>
            <div className="font-semibold text-[#1c3540] mb-1.5">Package Includes</div>
            <ul className="space-y-1 text-slate-700 list-disc pl-4">
              <li>{pkg.meals}</li><li>{pkg.transport}</li><li>Hotel stay – 3★ / 4★ options</li><li>All sightseeing as listed</li><li>Toll / parking / driver allowance</li><li>24×7 Paryatan on-trip support</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-[#1c3540] mb-1.5">Exclusions</div>
            <ul className="space-y-1 text-slate-600 list-disc pl-4">
              <li>Flights / Trains unless mentioned</li><li>Entry tickets / guide charges</li><li>Personal expenses</li><li>Travel insurance (add-on)</li><li>Anything not in 'Includes'</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center pt-1 pb-6">
          <Button variant="sunset" onClick={whatsapp}>Book on WhatsApp</Button>
          <div className="text-sm text-slate-600">Price from <b className="text-[#14323c]">{pkg.priceFrom || 'on request'}</b> • Fully customizable</div>
        </div>

        <div className="pb-8 text-center">
          <button onClick={close} className="text-sm text-primary font-medium underline underline-offset-4">← Back to all packages</button>
        </div>
      </div>
    </div>
  )
}
