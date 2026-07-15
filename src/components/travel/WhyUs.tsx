import { whyUs } from '../../data/packages'
import { motion, useInView, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.6,
      onUpdate: v => setVal(Math.round(v))
    })
    return () => controls.stop()
  }, [inView, to])
  return <span ref={ref}>{val.toLocaleString('en-IN')}</span>
}

export default function WhyUs() {
  return (
    <section className="section-pad bg-[#f6fbfc] overflow-hidden">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-[12px] uppercase tracking-widest text-primary font-semibold">Why Paryatan</p>
          <h2 className="text-[34px] md:text-[42px] tracking-tight text-[#13313b] mt-2">We get it right, every time.</h2>
          <p className="text-slate-600 mt-3">Transparent pricing, verified partners, and a human on call 24×7.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {whyUs.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.48, delay: i * 0.07 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-[22px] border border-slate-200 p-7 shadow-sm text-center"
            >
              <div className="font-display text-[38px] text-[#0b5b68]"><Counter to={item.value} />{item.suffix}</div>
              <div className="font-semibold text-[#1b3440] mt-1">{item.label}</div>
              <div className="text-sm text-slate-600 mt-1">{item.desc}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-8 text-sm">
          {[
            { t: 'Financially stable & licensed', d: 'IATA / ADTOI / OTOAI accredited agency.' },
            { t: 'No-surprise pricing', d: 'Clear inclusions. Written quotes in 2 hrs.' },
            { t: 'On-trip 24×7 support', d: 'Real team in Bhopal, always reachable.' },
          ].map((b, i) => (
            <motion.div
              key={b.t}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.07 }}
              className="bg-white/70 rounded-2xl border border-cyan-100 px-5 py-4"
            >
              <div className="font-semibold text-[#1b3440]">{b.t}</div>
              <div className="text-slate-600 mt-1">{b.d}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
