import {api} from './axios'

export const createBilling = async(data: any) => {
    try {
        const response = await api.post("/v1/billing/create", data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when initiating payment";
        throw new Error(message);
    }
}

export const fetchAllBilling = async() => {
    try {
        const response = await api.get("/v1/billing/viewAll");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when fetching billing history";
        throw new Error(message);
    }
}

export const fetchBillingStatus = async(billingId: string) => {
    try {
        const response = await api.get(`/v1/billing/status/${billingId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when checking billing";
        throw new Error(message);
    }
}

export const fetchPaynowPoll = async(billingId: string) => {
    try {
        const response = await api.get(`/v1/billing/paynow/poll/${billingId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when polling status";
        throw new Error(message);
    }
}