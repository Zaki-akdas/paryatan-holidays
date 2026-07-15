import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { company } from '../../data/packages'
import { toast } from 'sonner'
import { Mail, MapPin, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import { saveLead } from '../../lib/leads'

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Valid email please'),
  phone: z.string().min(8, 'Phone number please'),
  destination: z.string().min(2, 'Where to?'),
  message: z.string().min(5, 'Tell us a bit about your trip').optional().or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  })

  const onSubmit = (data: FormValues) => {
    try {
      saveLead({
        name: data.name,
        email: data.email,
        phone: data.phone,
        destination: data.destination,
        message: data.message || '',
        source: 'Contact Form'
      })
    } catch {}
    const text = `Hi Paryatan Holidays, I'm ${data.name}.\nDestination: ${data.destination}\nPhone: ${data.phone}\nEmail: ${data.email}\nMessage: ${data.message || '-'}\n\nSent from paryatan.co.in`
    const waUrl = `https://wa.me/${company.phoneRaw}?text=${encodeURIComponent(text)}`
    toast.success('Enquiry saved! Opening WhatsApp…')
    window.open(waUrl, '_blank')
    reset()
  }

  return (
    <section id="contact" className="section-pad bg-white overflow-hidden">
      <div className="container-narrow grid lg:grid-cols-[1.1fr_.9fr] gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-[12px] uppercase tracking-widest text-primary font-semibold">Contact</p>
          <h2 className="text-[34px] md:text-[42px] tracking-tight text-[#13313b] mt-2">Plan your trip with Paryatan</h2>
          <p className="text-slate-600 mt-3 max-w-lg">Share your dates, budget, and dream destinations — we’ll send a ready-to-book itinerary within 2 hours (9am–9pm IST).</p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4 text-sm">
            {[
              { icon: Phone, title: 'Call / WhatsApp', text: `${company.phone}\n${company.phoneAlt}` },
              { icon: Mail, title: 'Email', text: `${company.email}\n${company.website}` },
              { icon: MapPin, title: 'Bhopal Office', text: company.address, full: true },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                className={`rounded-2xl border border-slate-200 bg-[#f9fdfd] p-4 ${c.full ? 'sm:col-span-2' : ''}`}
              >
                <div className="flex items-center gap-2 font-semibold text-[#1b3440]"><c.icon className="w-4 h-4 text-primary"/> {c.title}</div>
                <div className="mt-1 text-slate-700 whitespace-pre-line">{c.text}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#f7fbfc] border border-cyan-100 rounded-[26px] p-6 md:p-7 shadow-elevated space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input className="mt-1.5" placeholder="Your name" {...register('name')} />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label>Phone</Label>
              <Input className="mt-1.5" placeholder="+91…" {...register('phone')} />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input className="mt-1.5" placeholder="you@example.com" {...register('email')} />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label>Dream Destination</Label>
            <Input className="mt-1.5" placeholder="e.g. Kashmir / Bali / Kerala" {...register('destination')} />
            {errors.destination && <p className="text-xs text-red-600 mt-1">{errors.destination.message}</p>}
          </div>
          <div>
            <Label>Trip details</Label>
            <Textarea placeholder="Dates, travellers, budget, hotels…" {...register('message')} />
            {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message.message}</p>}
          </div>
          <Button type="submit" variant="sunset" className="w-full" disabled={isSubmitting}>
            Send via WhatsApp
          </Button>
          <p className="text-[12px] text-slate-500 text-center">We reply in ~2 hrs, 9am–9pm IST. No spam, ever.</p>
        </motion.form>
      </div>
    </section>
  )
}
