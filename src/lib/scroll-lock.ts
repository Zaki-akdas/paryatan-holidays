// Shared scroll-lock controller.
// SmoothScroll registers its Lenis instance here so modals can pause the
// page's smooth scrolling (and lock native body scroll) while open, keeping
// the modal's own details container the only thing that scrolls.

let lenisInstance: { stop: () => void; start: () => void } | null = null
let lockCount = 0

export function registerLenis(instance: { stop: () => void; start: () => void } | null) {
  lenisInstance = instance
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
