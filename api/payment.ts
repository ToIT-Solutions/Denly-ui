import {api} from './axios'

export interface PaymentRecord {
    id: string;
    tenantId: string;
    amountPaid: string;
    paymentDate: string;
    createdAt: string;
    paymentMethod: string;
    receiptNumber: string;
    tenant: { firstName: string; lastName: string; email: string };
    rentLedger: { periodStart: string; periodEnd: string; property: { name: string } };
}

interface PaymentData {
    // id: string,
    propertyId: string;
    tenantId: string;
    amountPaid: number | string;
    paymentDate: string;
    paymentMethod?: string;
    notes?: string;
    duration: number;
}

interface PaymentMetadataData {
    paymentMethod?: string;
    paymentDate?: string;
    receiptNumber?: string;
}

interface RecordPaymentResult {
    message: string;
    payments: { id: string; amountPaid: string }[];
    unusedAmount: number;
}

export const addPayment = async(data: PaymentData) => {
    try {
        const response = await api.post<RecordPaymentResult>("/v1/payment/add", data);
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
        const response = await api.get<PaymentRecord>(`/v1/payment/viewOne/${paymentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const editPayment = async(paymentId: string , data: PaymentMetadataData) => {
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
