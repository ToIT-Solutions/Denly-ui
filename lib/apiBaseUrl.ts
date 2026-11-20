// Deployment must choose its API explicitly; never ship a silent localhost fallback.
export const getApiBaseUrl = (configured: string | undefined, production: boolean): string => {
    if (!configured && production) throw new Error('NEXT_PUBLIC_API_URL is required for production builds')
    const value = configured || 'http://localhost:8888/api'
    const url = new URL(value)
    const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname.replace(/\/$/, '') !== '/api') {
        throw new Error('NEXT_PUBLIC_API_URL must be an HTTP(S) API URL ending in /api')
    }
    if (production && url.protocol !== 'https:' && !loopback) throw new Error('Production API URL must use HTTPS')
    return value.replace(/\/$/, '')
}
