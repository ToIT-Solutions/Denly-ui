import {api} from './axios'

interface PropertyData {
    // Required for all properties
    name: string
    propertyType: string,
    type: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    squareMeter: number
    monthlyRent: number
    features: string[]
    description: string
    
    // Conditional fields - only required based on propertyType
    bedrooms?: number
    bathrooms?: number
    businessType?: string
    leaseType?: string
    totalUnits?: number
    parkingSpaces?: number
}

export const addProperty = async(data: PropertyData) => {
    try {
        const response = await api.post("/v1/property/add", data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when adding property";
        throw new Error(message);
    }
}

export const fetchAllProperties = async(subscriptionId: string) => {
    try {
        const response = await api.get(`/v1/property/viewAll/${subscriptionId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when fetching properties";
        throw new Error(message);
    }
}

export const fetchOneProperty = async(propertyId: string) => {
    try {
        const response = await api.get(`/v1/property/viewOne/${propertyId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when fetching property";
        throw new Error(message);
    }
}

export const editProperty = async(propertyId: string , data: PropertyData) => {
    try {
        const response = await api.put(`/v1/property/edit/${propertyId}`, data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when editing property";
        throw new Error(message);
    }
}

export const deleteProperty = async(propertyId: string) => {
    try {
        const response = await api.delete(`/v1/property/delete/${propertyId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to delete property";
        throw new Error(message);
    }
}