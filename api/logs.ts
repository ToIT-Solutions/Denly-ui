import { api } from "./axios";

export const getAllLogs = async(page: number = 1) => {
    try {
        const response = await api.get(`/v1/logs?page=${page}&limit=20`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to fetch all invites";
        throw new Error(message);
    }
}