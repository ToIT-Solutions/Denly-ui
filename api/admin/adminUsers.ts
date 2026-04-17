import { api } from "../axios";

export const fetchAllUsers = async () => {
    try {
        const response = await api.get(`/v1/admin/users`);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error fetching users";
        throw new Error(message);
    }
};

export const updateUserRole = async (id: string, role: string) => {
    try {
        const response = await api.patch(`/v1/admin/users/${id}/role`, {
            role
        });
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error updating user role";
        throw new Error(message);
    }
};

export const updateUserStatus = async (id: string, status: string) => {
    try {
        const response = await api.patch(`/v1/admin/users/${id}/status`, {
            status
        });
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error updating user status";
        throw new Error(message);
    }
};