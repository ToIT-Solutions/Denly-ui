import axios from 'axios'
import useAuthStore from '@/store/useAuthStore'
import { showErrorToast } from '@/lib/toast'
import { redirect } from '@/lib/redirect'

export const api = axios.create({
    baseURL: 'http://localhost:8888/api',
    timeout: 5000,
    withCredentials: true,
})

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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.log('no auth')
            showErrorToast('Your session has expired. Log in')
            
            // Get the clearUser function from Zustand and call it
            const { clearUser } = useAuthStore.getState()
            clearUser()
            redirect('/auth/login')
            
            // Redirect to login
            window.location.href = '/auth/login'
        }
        return Promise.reject(error)
    }
)