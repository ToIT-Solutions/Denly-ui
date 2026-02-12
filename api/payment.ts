import {api} from './axios'

interface PaymentData {
    propertyId: string;
    tenantId: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    notes: string;
}

export const addPayment = async(data: PaymentData) => {
    try {
        const response = await api.post("/v1/payment/add", data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when adding payment";
        throw new Error(message);
    }
}

export const fetchAllPayments = async() => {
    try {
        const response = await api.get(`/v1/payment/viewAll`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when fetching properties";
        throw new Error(message);
    }
}

export const fetchOnePayment = async(paymentId: string) => {
    try {
        const response = await api.get(`/v1/payment/viewOne/${paymentId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when fetching payment";
        throw new Error(message);
    }
}

export const editPayment = async(paymentId: string , data: PaymentData) => {
    try {
        const response = await api.put(`/v1/payment/edit/${paymentId}`, data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when editing payment";
        throw new Error(message);
    }
}

export const deletePayment = async(paymentId: string) => {
    try {
        const response = await api.delete(`/v1/payment/delete/${paymentId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to delete payment";
        throw new Error(message);
    }
}