import { motion } from 'framer-motion'

export default function About() {
  const bullets = [
    'We get it right — itineraries built around you, not a template.',
    'Transparent costing — no hidden surprises, ever.',
    'Financially stable, fully licensed, industry-accredited.',
    '24×7 travel assistance while you’re on the road.',
    'Creating long-term, sustainable client relationships.',
    'Experienced MICE team for meetings, incentives, conferences & events — India & worldwide.',
  ]
  return (
    <section id="about" className="section-pad bg-white overflow-hidden">
      <div className="container-narrow grid lg:grid-cols-2 gap-14 items-start">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-[12px] uppercase tracking-widest text-primary font-semibold">About Paryatan Holidays</p>
          <h2 className="text-[34px] md:text-[42px] tracking-tight text-[#13313b] leading-tight mt-2">Service excellence. Trust. A trip of a lifetime.</h2>
          <p className="text-[17px] leading-relaxed text-slate-600 mt-5">
            PARYATAN is an integrated Tourism & Travel Management company built around Service Excellence, Trust, and Integrity. A talented, dedicated team of tourism & hospitality professionals ensures high standards at every step — from planning to on-trip support.
          </p>
          <p className="text-[17px] leading-relaxed text-slate-600 mt-4">
            Based in Bhopal, we handle Domestic & International holidays, Corporate / MICE, Pilgrimage, Groups, and FIT travel across India and 35+ countries. Clear pricing, verified hotels, hand-picked drivers, and a real human answering your call at 2am.
          </p>
          <div className="flex flex-wrap gap-2 mt-5 text-[11.5px] text-[#24515c]">
            {['NIMA', 'OTOAI', 'ADTOI', 'IIA'].map((x,i) => (
              <motion.span
                key={x}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i*0.06 }}
                className="px-3 py-1.5 rounded-full bg-secondary border border-cyan-100"
              >{x} Member</motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28, rotate: 1.5 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="bg-[#f7fbfc] rounded-[28px] border border-cyan-100 p-7 md:p-9 shadow-elevated"
        >
          <h3 className="font-display text-2xl text-[#14323c]">Our Mission & Trust Promise</h3>
          <ul className="mt-4 space-y-3 text-[15.5px] text-slate-700 leading-relaxed">
            {bullets.map((b, i) => (
              <motion.li
                key={b}
                initial={{ opacity: 0, x: 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.15 + i*0.055 }}
              >• {b}</motion.li>
            ))}
          </ul>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55 }}
            className="mt-5 text-sm text-slate-600 italic"
          >“Enjoy the World — Miles to Go…”</motion.div>
        </motion.div>
      </div>
    </section>
  )
}
