import { specializations } from '../../data/packages'
import { motion } from 'framer-motion'

export default function Specializations() {
  return (
    <section className="py-16 bg-[#f6fbfc]/88 backdrop-blur-[1.5px] border-y border-cyan-100/80 overflow-hidden">
      <div className="container-narrow">
        <motion.h3
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-[26px] md:text-[30px] text-[#14323c] text-center"
        >
          Other Specializations
        </motion.h3>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {specializations.map((s, i) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0.8, y: 14 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: i * 0.045 }}
              whileHover={{ y: -3, scale: 1.04 }}
              className="px-4 py-2 rounded-full bg-white border border-slate-200 text-[13.5px] text-slate-700 shadow-sm"
            >
              {s}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
