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

export const updateUser = async (id: string, data: any) => {
    try {
        const response = await api.patch(`/v1/admin/users/edit/${id}`, data);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error updating user";
        throw new Error(message);
    }
};