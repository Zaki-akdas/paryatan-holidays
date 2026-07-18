import { useEffect, useState } from 'react'

// Returns true when the viewport is below the mobile breakpoint (default 768px).
// Also accounts for users who prefer reduced motion, so heavy 3D is disabled there too.
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches
  })

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [breakpoint])

  return isMobile
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
