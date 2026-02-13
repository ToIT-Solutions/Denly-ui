import {api} from './axios'

interface CompanyData {
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    taxId: string
    industry: string
}

export const fetchCompanyData = async() => {
    try {
        const response = await api.get(`/v1/company/view`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when fetching properties";
        throw new Error(message);
    }
}

export const editCompanyData = async(data: CompanyData) => {
    try {
        const response = await api.put(`/v1/company/edit/`, data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when editing company";
        throw new Error(message);
    }
}

export const fetchCompanyStats = async() => {
    try {
        const response = await api.get(`/v1/company/stats`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when fetching properties";
        throw new Error(message);
    }
}
