import { toast } from "sonner"

export const showSuccessToast = (message: string) => {
    toast.success(message, {
        style: {
            background: 'green',
            border: 'none',
            textAlign: "center",
            color: "white"
        }
    })
}

export const showErrorToast = (error: any, fallbackMessage = 'An error occurred') => {
    // Don't show toast for 401 errors (handled globally)
    if (error?.response?.status === 401) return
    
    const message = error?.response?.data?.message || error?.message || fallbackMessage
    
    toast.error(message, {
        style: {
            background: 'red',
            border: 'none',
            textAlign: "center",
            color: "white"
        }
    })
}