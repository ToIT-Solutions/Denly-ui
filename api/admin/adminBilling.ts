import { api } from "../axios";

export const fetchAllBilling = async (status?: string) => {
    try {
        const response = await api.get(`/v1/admin/billing`, {
            params: status ? { status } : {}
        });
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error fetching billing";
        throw new Error(message);
    }
};

export const fetchFailedBilling = async () => {
    try {
        const response = await api.get(`/v1/admin/billing/failed`);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error fetching failed billing";
        throw new Error(message);
    }
};

export const fetchPendingBilling = async () => {
    try {
        const response = await api.get(`/v1/admin/billing/pending`);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error fetching pending billing";
        throw new Error(message);
    }
};

export const fetchBillingStats = async () => {
    try {
        const response = await api.get(`/v1/admin/billing/stats`);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error fetching billing stats";
        throw new Error(message);
    }
};