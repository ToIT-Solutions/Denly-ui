import { api } from "../axios";

export const fetchChangelogs = async () => {
    try {
        const response = await api.get(`/v1/admin/changelog`);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error fetching changelogs";
        throw new Error(message);
    }
};

export const createChangelog = async (data: {
    version: string;
    title: string;
    content: string;
    isMajor?: boolean;
}) => {
    try {
        const response = await api.post(`/v1/admin/changelog`, data);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error creating changelog";
        throw new Error(message);
    }
};

export const updateChangelog = async (id: string, data: any) => {
    try {
        const response = await api.put(`/v1/admin/changelog/${id}`, data);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error updating changelog";
        throw new Error(message);
    }
};

export const deleteChangelog = async (id: string) => {
    try {
        const response = await api.delete(`/v1/admin/changelog/${id}`);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error deleting changelog";
        throw new Error(message);
    }
};