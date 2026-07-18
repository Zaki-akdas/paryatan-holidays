// Shared scroll-lock controller.
// SmoothScroll registers its Lenis instance here so modals can pause the
// page's smooth scrolling (and lock native body scroll) while open, keeping
// the modal's own details container the only thing that scrolls.

type LenisLike = {
  stop: () => void
  start: () => void
  scrollTo: (target: number, opts?: { immediate?: boolean; force?: boolean }) => void
  scroll: number
}

let lenisInstance: LenisLike | null = null
let lockCount = 0

const HOME_SCROLL_KEY = 'paryatan_home_scroll'

export function registerLenis(instance: LenisLike | null) {
  lenisInstance = instance
}

// Remember where the user was on the home page before opening an itinerary.
export function saveHomeScroll(y?: number) {
  const pos = typeof y === 'number' ? y : (lenisInstance?.scroll ?? window.scrollY)
  try { sessionStorage.setItem(HOME_SCROLL_KEY, String(Math.round(pos))) } catch {}
}

export function takeHomeScroll(): number | null {
  try {
    const raw = sessionStorage.getItem(HOME_SCROLL_KEY)
    if (raw == null) return null
    sessionStorage.removeItem(HOME_SCROLL_KEY)
    const n = Number(raw)
    return Number.isFinite(n) ? n : null
  } catch { return null }
}

// Restore the saved home scroll position once Lenis is ready.
export function restoreHomeScroll() {
  const y = takeHomeScroll()
  if (y == null) return
  if (lenisInstance) lenisInstance.scrollTo(y, { immediate: true, force: true })
  else window.scrollTo(0, y)
}

export function lockScroll() {
  lockCount += 1
  if (lockCount > 1) return
  lenisInstance?.stop()
  document.documentElement.classList.add('lenis-stopped')
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`
    document.documentElement.style.paddingRight = `${scrollbarWidth}px`
  }
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount > 0) return
  document.documentElement.classList.remove('lenis-stopped')
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
  document.documentElement.style.paddingRight = ''
  lenisInstance?.start()
}
