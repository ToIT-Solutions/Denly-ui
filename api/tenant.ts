import {api} from './axios'

interface TenantData {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    next_of_kin_name?: string;
    next_of_kin_relationship?: string;
    next_of_kin_phone?: string;
    next_of_kin_email?: string;
    next_of_kin_address?: string;
    occupation?: string;
    employer?: string;
    notes?: string;
    lease_start?: string; // Date string
    lease_end?: string; // Date string
    actual_rent?: number;
    status?: 'active' | 'pending' | 'inactive';
}

export const addTenant = async(data: TenantData) => {
    try {
        const response = await api.post(`/tenant/add`, data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to create tenant";
        throw new Error(message);
    }
}

export const fetchAllTenants = async(subscriptionId: string) => {
    try {
        const response = await api.get(`/tenant/view/${subscriptionId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to fetch tenants";
        throw new Error(message);
    }
}

export const fetchOneTenant = async(tenantId: string) => {
    try {
        const response = await api.get(`/tenant/view/${tenantId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to fetch tenant";
        throw new Error(message);
    }
}

export const editTenant = async(data: TenantData, tenantId: string) => {
    try {
        const response = await api.put(`/tenant/edit/${tenantId}`, data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to edit tenant";
        throw new Error(message);
    }
}

export const deleteTenant = async(tenantId: string) => {
    try {
        const response = await api.delete(`/tenant/delete/${tenantId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to delete tenant";
        throw new Error(message);
    }
}