import {api} from './axios'

export const getAllPlans = async() => {
    try {
        const response = await api.get("/v1/billing/viewAll");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when adding property";
        throw new Error(message);
    }
}