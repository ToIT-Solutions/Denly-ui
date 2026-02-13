import axios from 'axios'
import useAuthStore from '@/store/useAuthStore'

export const api = axios.create({
    baseURL: 'http://localhost:8888/api',
    timeout: 5000,
    withCredentials: true,
})

// Request interceptor - get token from Zustand
api.interceptors.request.use(
    (config) => {
        // Get token directly from store (synchronous access)
        const token = useAuthStore.getState().token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Smart 401 Handler with Exponential Backoff (using Zustand)
class AuthErrorHandler {
    private isRedirecting = false
    private redirectTimer: NodeJS.Timeout | null = null
    private consecutive401s = 0
    private readonly MAX_CONSECUTIVE_401S = 3
    private readonly BASE_DELAY = 1000
    private readonly MAX_DELAY = 10000
    private redirectInProgress = false
    
    // Track 401s by endpoint to avoid counting the same failed request multiple times
    private recent401Endpoints = new Map<string, number>()
    private readonly ENDPOINT_EXPIRY = 5000 // 5 seconds
    
    handle401(error: any) {
        const endpoint = error.config?.url || 'unknown'
        const now = Date.now()
        
        // Clean up old endpoint entries
        this.recent401Endpoints.forEach((timestamp, key) => {
            if (now - timestamp > this.ENDPOINT_EXPIRY) {
                this.recent401Endpoints.delete(key)
            }
        })
        
        // Check if this endpoint recently had a 401
        if (this.recent401Endpoints.has(endpoint)) {
            // Already counting this endpoint, don't increment again
            return this.shouldRedirect(error)
        }
        
        // New 401 for this endpoint
        this.recent401Endpoints.set(endpoint, now)
        this.consecutive401s++
        
        console.log(`⚠️ 401 #${this.consecutive401s} from ${endpoint}`)
        
        return this.shouldRedirect(error)
    }
    
    private shouldRedirect(error: any) {
        // Don't redirect if already in progress
        if (this.redirectInProgress) return false
        
        const isAuthEndpoint = error.config?.url?.includes('/auth/')
        const hasToken = !!useAuthStore.getState().token
        const isTimeout = error.code === 'ECONNABORTED'
        const isNetworkError = !error.response
        
        // Don't redirect for auth endpoints
        if (isAuthEndpoint) return false
        
        // Don't redirect for network errors or timeouts
        if (isTimeout || isNetworkError) {
            console.log('🌐 Network issue detected - not redirecting')
            return false
        }
        
        // Check if we've hit the threshold
        if (this.consecutive401s >= this.MAX_CONSECUTIVE_401S && hasToken) {
            return true
        }
        
        return false
    }
    
    redirect() {
        if (this.isRedirecting || this.redirectInProgress) return
        
        this.isRedirecting = true
        this.redirectInProgress = true
        
        console.log('🔐 Multiple 401s detected - redirecting to login')
        
        // Calculate delay with exponential backoff
        const delay = Math.min(
            this.BASE_DELAY * Math.pow(2, this.consecutive401s - this.MAX_CONSECUTIVE_401S),
            this.MAX_DELAY
        )
        
        // Clear existing timer
        if (this.redirectTimer) {
            clearTimeout(this.redirectTimer)
        }
        
        // Clear Zustand store FIRST
        const clearAuth = useAuthStore.getState().clearAuth
        clearAuth() // This clears your Zustand auth state
        
        // Store current path for redirect after login
        const currentPath = window.location.pathname
        if (!currentPath.includes('/login')) {
            sessionStorage.setItem('redirectAfterLogin', currentPath) // Still use sessionStorage for redirect
        }
        
        // Debounced redirect
        this.redirectTimer = setTimeout(() => {
            window.location.href = '/login?reason=session_expired'
            
            // Reset after redirect
            setTimeout(() => {
                this.reset()
            }, 2000)
        }, delay)
    }
    
    reset() {
        this.isRedirecting = false
        this.redirectInProgress = false
        this.consecutive401s = 0
        this.recent401Endpoints.clear()
        if (this.redirectTimer) {
            clearTimeout(this.redirectTimer)
            this.redirectTimer = null
        }
    }
    
    onSuccess() {
        this.consecutive401s = 0
        this.recent401Endpoints.clear()
    }
}

const authHandler = new AuthErrorHandler()

// Response interceptor
api.interceptors.response.use(
    (response) => {
        authHandler.onSuccess()
        return response
    },
    (error) => {
        if (error.response?.status === 401) {
            const shouldRedirect = authHandler.handle401(error)
            if (shouldRedirect) {
                authHandler.redirect()
            }
        }
        return Promise.reject(error)
    }
)