import { toast } from "sonner"

export const showSuccessToast = (message: string) => {
    toast.success(message, {
        duration: 2800,
        style: {
            background: 'green',
            border: 'none',
            textAlign: "center",
            color: "white",
            fontWeight: "bold"
        }
    })
}

export const showErrorToast = (error: any, fallbackMessage = 'An error occurred') => {
    // Don't show toast for 401 errors (handled globally)
    if (typeof error === 'string') {
        toast.error(error, {
            duration: 4000,
            style: {
                background: 'red',
                border: 'none',
                textAlign: "center",
                color: "white",
                fontWeight: "bold"
            }
        })
        return
    }

    if (error?.response?.status === 401) return
    
    const message = error?.response?.data?.message || error?.message || fallbackMessage
    
    toast.error(message, {
        duration: 4000,
        style: {
            background: 'red',
            border: 'none',
            textAlign: "center",
            color: "white",
            fontWeight: "bold"
        }
    })
}