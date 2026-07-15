import { services } from '../../data/packages'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'

function getIcon(name: string) {
  // @ts-ignore
  return Icons[name] || Icons.Sparkles
}

export default function Services() {
  return (
    <section id="services" className="section-pad bg-[#f6fbfc] overflow-hidden">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <p className="text-[12px] uppercase tracking-widest text-primary font-semibold">What we do</p>
          <h2 className="text-[34px] md:text-[42px] tracking-tight text-[#13313b] leading-tight mt-2">Every travel need, under one roof</h2>
          <p className="text-slate-600 mt-3">From air tickets to full MICE events — Paryatan handles it end-to-end.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-10">
          {services.map((s, i) => {
            const Icon = getIcon(s.icon)
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 22, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: .45, delay: i * 0.035 }}
                whileHover={{ y: -5, scale: 1.015 }}
                className="rounded-[22px] bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-elevated transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-semibold text-[#1b3540] mt-4">{s.title}</div>
                <div className="text-sm text-slate-600 mt-1.5">{s.desc}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
