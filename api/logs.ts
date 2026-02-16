import { api } from "./axios";

export const getAllLogs = async() => {
    try {
        const response = await api.get(`/v1/logs/`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to fetch all invites";
        throw new Error(message);
    }
}