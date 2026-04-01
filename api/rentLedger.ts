import {api} from './axios'

export const fetchAllRentLedger = async() => {
    try {
        const response = await api.get(`/v1/rentLedger/viewAll`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when fetching ledger";
        throw new Error(message);
    }
}

export const fetchOneRentLedger = async(tenantId: string) => {
    try {
        const response = await api.get(`/v1/rentLedger/viewOne/${tenantId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when fetching ledger";
        throw new Error(message);
    }
}