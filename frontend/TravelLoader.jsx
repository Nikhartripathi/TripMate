import { motion } from 'framer-motion'
import { Plane } from 'lucide-react'

/**
 * TravelLoader
 * ─────────────────────────────────────────────
 * Fullscreen overlay shown after login/signup.
 * Uses Framer Motion for smooth fade-in + plane slide.
 * Disappears automatically when the parent unmounts it.
 */
export default function TravelLoader() {
  return (
    <motion.div
      /* ── Fade the whole overlay in/out ── */
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="
        fixed inset-0 z-[9999]
        flex flex-col items-center justify-center
        bg-white/90 dark:bg-gray-950/90
        backdrop-blur-xl
        overflow-hidden
      "
      /* Block all pointer events beneath */
      aria-modal="true"
      aria-label="Loading your dashboard"
    >
      {/* ── Soft ambient glow blobs ── */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)', top: '-10%', left: '-10%' }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)', bottom: '-5%', right: '-5%' }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-6 text-center">

        {/* Plane track */}
        <div className="relative w-72 h-16 flex items-center">

          {/* Dashed runway */}
          <motion.div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px"
            style={{
              backgroundImage: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6) 20%, rgba(167,139,250,0.8) 50%, rgba(99,102,241,0.6) 80%, transparent)',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          {/* Glowing trail that follows the plane */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-0.5 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #818cf8)',
              left: 0,
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '75%', opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Plane icon */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 188, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              {/* Glow behind plane */}
              <div className="absolute inset-0 rounded-full blur-md bg-brand-500 opacity-40 scale-150" />
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center shadow-lg">
                <Plane size={18} className="text-white -rotate-0 fill-white stroke-none" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Text block */}
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-gray-900 dark:text-gray-100 font-bold text-xl tracking-tight">
            Planning your journey…
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Finding the best trips for you
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-48 h-1 rounded-full bg-white/10 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.0,
              delay: 0.55,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Three pulsing dots */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-brand-500"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.18,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
