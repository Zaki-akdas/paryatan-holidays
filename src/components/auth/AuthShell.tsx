import { motion } from "framer-motion"
import { type ReactNode } from "react"
import { company } from "../../data/packages"

export function AuthShell({
  title,
  subtitle,
  children,
  side,
}: {
  title: string
  subtitle: string
  children: ReactNode
  side?: ReactNode
}) {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background overflow-hidden">
      {/* Brand / visual panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-ocean text-white p-12">
        <motion.div
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            background:
              "radial-gradient(900px 600px at 80% 10%, rgba(255,183,3,0.18), transparent 60%), radial-gradient(700px 500px at 10% 90%, rgba(20,184,207,0.25), transparent 60%)",
          }}
        />
        {/* floating blobs */}
        <motion.div
          className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-white/10 blur-2xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-0 w-72 h-72 rounded-full bg-amber-300/15 blur-3xl"
          animate={{ y: [0, -24, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <img src="/logo.png" alt="Paryatan Holidays" className="w-11 h-11 object-contain" />
          <div>
            <div className="font-display font-bold text-lg leading-tight">{company.name}</div>
            <div className="text-xs text-cyan-100/70">{company.tagline} {company.subTagline}</div>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="display text-4xl leading-tight font-bold"
          >
            Miles to Go… Enjoy the World.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.6 }}
            className="mt-4 text-cyan-50/85 text-[15px] leading-relaxed"
          >
            {side}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-2 text-xs"
          >
            {["24×7 Support", "120+ Destinations", "4.8★ Rated", "Secure Accounts"].map((t) => (
              <span key={t} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur">
                {t}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="relative z-10 text-xs text-cyan-100/60">
          © {new Date().getFullYear()} {company.name} · {company.website}
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src="/logo.png" alt="Paryatan Holidays" className="w-10 h-10 object-contain" />
            <span className="font-display font-bold text-lg text-[#13313b]">{company.name}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="display text-3xl font-bold text-[#13313b]"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="text-muted-foreground mt-1.5"
          >
            {subtitle}
          </motion.p>

          <div className="mt-7">{children}</div>
        </motion.div>
      </div>
    </div>
  )
}
