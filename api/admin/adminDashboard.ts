import { api } from "../axios";

export const fetchAdminStats = async () => {
    try {
        const response = await api.get(`/v1/admin/dashboard/stats`);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error fetching dashboard stats";
        throw new Error(message);
    }
};