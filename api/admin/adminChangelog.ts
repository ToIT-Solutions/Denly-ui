import { api } from "../axios";

interface ChangelogFormData {
    version: string
    title: string
    content: string
    releaseType: string
    isPublished: boolean
}

export const fetchChangelogs = async () => {
    try {
        const response = await api.get(`/v1/admin/changelog/viewAll`);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error fetching changelogs";
        throw new Error(message);
    }
};

export const fetchOneChangelog = async (id: string) => {
    try {
        const response = await api.get(`/v1/admin/changelog/viewOne/${id}`);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error fetching changelog";
        throw new Error(message);
    }
};

export const createChangelog = async (data: ChangelogFormData) => {
    try {
        const response = await api.post(`/v1/admin/changelog/new`, data);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error creating changelog";
        throw new Error(message);
    }
};

export const updateChangelog = async (id: string, data: ChangelogFormData) => {
    try {
        const response = await api.put(`/v1/admin/changelog/edit/${id}`, data);
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
        const response = await api.delete(`/v1/admin/changelog/delete/${id}`);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error deleting changelog";
        throw new Error(message);
    }
};