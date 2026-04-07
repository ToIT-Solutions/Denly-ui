import axios from 'axios'
import useAuthStore from '@/store/useAuthStore'
import { showErrorToast } from '@/lib/toast'
import { redirect } from '@/lib/redirect'

export const api = axios.create({
    // baseURL: 'https://denly-backend-production.up.railway.app/api',
    baseURL: 'http://localhost:8888/api',
    timeout: 10000,
    // withCredentials: true,
})

// 🔥 GLOBAL GUARDS (prevent multiple triggers)
let isHandlingAuthError = false
let isHandlingSubscriptionError = false
let isHandlingNetworkError = false
let isHandlingServerError = false

// Request interceptor - get token from Zustand
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Define error types that should redirect to error page
const REDIRECT_ERROR_STATUSES = [500, 502, 503, 504]
const TOAST_ERROR_STATUSES = [400, 404, 409, 422]
const AUTH_ERROR_STATUSES = [401]
const SUBSCRIPTION_ERROR_STATUSES = [402]

api.interceptors.response.use(
    (response) => response,
    async (error) => {

        const status = error.response?.status
        const errorCode = error.response?.data?.code
        const errorMessage = error.response?.data?.message

        // 🔥 Handle Network Errors FIRST (no response at all)
        if (!error.response) {
            if (!isHandlingNetworkError) {
                isHandlingNetworkError = true

                console.log('Network error')

                const message = encodeURIComponent(
                    'Unable to connect to the server. Please check your internet connection.'
                )

                window.location.href = `/error?status=0&code=NETWORK_ERROR&message=${message}`
            }

            return Promise.reject(error)
        }

        // Handle Authentication Errors (401)
        if (status === 401) {
            if (!isHandlingAuthError) {
                isHandlingAuthError = true

                console.log('Authentication error')

                showErrorToast('Your session has expired. Please log in again.')
                
                const { clearUser } = useAuthStore.getState()
                clearUser()
                
                setTimeout(() => {
                    window.location.href = '/auth/login'
                }, 1400)
            }

            return Promise.reject(error)
        }

        // Handle Subscription Errors (402)
        if (status === 402) {
            if (!isHandlingSubscriptionError) {
                isHandlingSubscriptionError = true

                console.log('Subscription error')

                showErrorToast('Your subscription has expired or is inactive.')
                
                setTimeout(() => {
                    window.location.href = '/dashboard/subscription/billing?state=no-sub'
                }, 1400)
            }

            return Promise.reject(error)
        }

        // Handle Redirect Errors (500, 502, 503, 504, etc.)
        if (REDIRECT_ERROR_STATUSES.includes(status)) {
            if (!isHandlingServerError) {
                isHandlingServerError = true

                console.log('Server error')
                
                // Encode the error message to safely pass in URL
                const encodedMessage = encodeURIComponent(
                    errorMessage || 'An unexpected server error occurred'
                )
                
                window.location.href = `/error?status=${status}&code=${errorCode || 'SERVER_ERROR'}&message=${encodedMessage}`
            }

            return Promise.reject(error)
        }

        // Handle Specific Error Codes that should redirect
        if (
            errorCode === 'DATABASE_ERROR' || 
            errorCode === 'SERVICE_UNAVAILABLE' ||
            errorCode === 'RATE_LIMIT_EXCEEDED' ||
            errorCode === 'MAINTENANCE_MODE'
        ) {
            console.log('Specific backend error')

            const encodedMessage = encodeURIComponent(
                errorMessage || `Error: ${errorCode}`
            )

            window.location.href = `/error?status=${status || 500}&code=${errorCode}&message=${encodedMessage}`

            return Promise.reject(error)
        }

        // Handle Network Errors (no response from server)
        if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
            console.log('Network error')
            const message = encodeURIComponent(
                'Unable to connect to the server. Please check your internet connection.'
            )
        
            window.location.href = `/error?status=0&code=NETWORK_ERROR&message=${message}`
            
            // window.location.href = '/error?status=0&code=NETWORK_ERROR&message=Unable%20to%20connect%20to%20the%20server.%20Please%20check%20your%20internet%20connection.'
            return Promise.reject(error)
        }

        // Handle Toast Errors (400, 404, 409, 422, etc.)
        if (TOAST_ERROR_STATUSES.includes(status)) {
            console.log('Client error - showing toast')

            showErrorToast(errorMessage || 'An error occurred. Please try again.')

            return Promise.reject(error)
        }

        // Handle any other unhandled errors - redirect to error page
        console.log('Unhandled error:', error)

        const encodedMessage = encodeURIComponent(
            errorMessage || error.message || 'An unexpected error occurred'
        )

        window.location.href = `/error?status=${status || 500}&code=${errorCode || 'UNKNOWN_ERROR'}&message=${encodedMessage}`
        
        return Promise.reject(error)
    }
)