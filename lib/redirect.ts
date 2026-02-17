// lib/redirect.ts
type RedirectFunction = (path: string) => void

let redirectFn: RedirectFunction = (path) => {
  // Default fallback - you'll override this
  console.warn('Redirect function not initialized')
}

export const setRedirectFunction = (fn: RedirectFunction) => {
  redirectFn = fn
}

export const redirect = (path: string) => {
  redirectFn(path)
}