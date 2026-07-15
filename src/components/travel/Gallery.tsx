import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import taj from '../../assets/gallery-taj.jpg'
import kashmir from '../../assets/gallery-kashmir.jpg'
import kerala from '../../assets/gallery-kerala.jpg'
import goa from '../../assets/gallery-goa.jpg'
import rajasthan from '../../assets/gallery-rajasthan.jpg'
import northeast from '../../assets/gallery-northeast.jpg'

const items = [
  { img: taj, label: 'Taj Mahal, Agra' },
  { img: kashmir, label: 'Kashmir Valley' },
  { img: kerala, label: 'Kerala Backwaters' },
  { img: goa, label: 'Goa Beaches' },
  { img: rajasthan, label: 'Rajasthan Royal' },
  { img: northeast, label: 'Northeast Hills' },
]

export default function Gallery() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section id="gallery" ref={ref} className="section-pad bg-white overflow-hidden">
      <div className="container-narrow">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[12px] uppercase tracking-widest text-primary font-semibold">Inspiration</p>
            <h2 className="text-[34px] md:text-[42px] tracking-tight text-[#13313b]">India, beautifully</h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, x: 22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-slate-600 max-w-sm"
          >A glimpse of destinations our travellers love — all bookable with Paryatan.</motion.p>
        </div>

        <motion.div style={{ y }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {items.map((it, i) => (
            <motion.div
              key={it.label}
              initial={{ opacity: 0, y: 28, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: .52, delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="relative rounded-[24px] overflow-hidden shadow-elevated group"
            >
              <img src={it.img} alt={it.label} className="h-[260px] w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white font-display font-semibold text-lg drop-shadow">{it.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
