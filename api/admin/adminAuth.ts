import { api } from "../axios";

export const adminLogin = async (data: { email: string; password: string }) => {
    try {
        const response = await api.post(`/v1/admin/auth/login`, data);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error logging in as admin";
        throw new Error(message);
    }
};

export const fetchAdminMe = async () => {
    try {
        const response = await api.get(`/v1/admin/auth/me`);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error fetching admin data";
        throw new Error(message);
    }
};

export const adminLogput = async () => {
    try {
        const response = await api.post(`/v1/admin/auth/logout`);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error logout";
        throw new Error(message);
    }
};