import { company } from '../../data/packages'
import { motion } from 'framer-motion'

export default function Footer() {
  const cols = [
    {
      title: 'Paryatan Holidays',
      custom: true,
    },
    {
      title: 'Quick Links',
      links: [
        ['About', '#about'],
        ['Services', '#services'],
        ['Packages', '#packages'],
        ['Gallery', '#gallery'],
        ['Contact', '#contact'],
      ] as [string,string][]
    },
    {
      title: 'Popular',
      items: ['Kashmir • Himachal','Kerala • Goa','Rajasthan • Andaman','Dubai • Bali • Thailand','Europe • Maldives']
    },
    {
      title: 'Contact',
      contact: true
    }
  ]
  return (
    <footer className="bg-[#0c2d36] text-cyan-50 overflow-hidden">
      <div className="container-narrow py-14 grid md:grid-cols-4 gap-10">
        {cols.map((col, i) => (
          <motion.div
            key={col.title}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
          >
             {col.custom ? (
               <>
                 <img src="/logo.png" alt="Paryatan Holidays" className="h-10 w-10 object-contain mb-3" />
                 <div className="font-display text-[22px] font-[700]">Paryatan Holidays</div>
                 <div className="text-cyan-100/80 text-sm mt-1">Miles to Go… • Enjoy the World</div>
                 <p className="text-cyan-100/70 text-sm mt-4 max-w-xs">Integrated Tourism & Travel Management — Domestic, International, MICE, Pilgrimage, Groups.</p>
               </>
             ) : col.links ? (
              <>
                <div className="font-semibold mb-3">{col.title}</div>
                <ul className="space-y-2 text-cyan-100/80 text-sm">
                  {col.links.map(([label, href]) => <li key={label}><a href={href} className="hover:text-white transition-colors">{label}</a></li>)}
                </ul>
              </>
            ) : col.items ? (
              <>
                <div className="font-semibold mb-3">{col.title}</div>
                <ul className="space-y-2 text-cyan-100/80 text-sm">
                  {col.items.map(x => <li key={x}>{x}</li>)}
                </ul>
              </>
            ) : (
              <>
                <div className="font-semibold mb-3">{col.title}</div>
                <div className="text-cyan-100/80 text-sm space-y-1.5">
                  <div>{company.address}</div>
                  <div>{company.phone} • {company.phoneAlt}</div>
                  <div>{company.email}</div>
                  <div>{company.website}</div>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
      <div className="border-t border-cyan-900/70">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="container-narrow py-5 text-[12.5px] text-cyan-100/60 flex flex-wrap justify-between gap-3"
        >
          <span>© {new Date().getFullYear()} Paryatan Holidays, Bhopal. All rights reserved.</span>
          <span>NIMA • OTOAI • ADTOI • IIA Member</span>
        </motion.div>
      </div>
    </footer>
  )
}
