import { api } from "./axios";

export const fetchPublicChangelogs = async () => {
    try {
        const response = await api.get(`/v1/changelog/public`);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Error fetching changelogs";
        throw new Error(message);
    }
};