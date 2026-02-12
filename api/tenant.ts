import {api} from './axios'

interface TenantData {
    //  Personal Information
     firstName: string
     lastName: string
     email: string
     phone: string
     emergencyContactName: string
     emergencyContactPhone: string
 
     // Next of Kin Information
     nextOfKinName: string
     nextOfKinRelationship: string
     nextOfKinPhone: string
     nextOfKinEmail: string
     nextOfKinAddress: string
 
     // Property & Lease (Matches your DB structure)
     propertyId: string
     actualRent: number
     leaseStart: string
     leaseEnd: string
     status: 'active' | 'pending'
 
     // Additional Information
     occupation: string
     employer: string
     notes: string
}

export const addTenant = async(data: TenantData) => {
    try {
        const response = await api.post(`/v1/tenant/add`, data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to create tenant";
        throw new Error(message);
    }
}

export const fetchAllTenants = async() => {
    try {
        const response = await api.get(`/v1/tenant/viewAll/`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to fetch tenants";
        throw new Error(message);
    }
}

export const fetchOneTenant = async(tenantId: string) => {
    try {
        const response = await api.get(`/v1/tenant/viewOne/${tenantId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to fetch tenant";
        throw new Error(message);
    }
}

export const editTenant = async(data: TenantData, tenantId: string) => {
    try {
        const response = await api.put(`/v1/tenant/edit/${tenantId}`, data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to edit tenant";
        throw new Error(message);
    }
}

export const deleteTenant = async(tenantId: string) => {
    try {
        const response = await api.delete(`/v1/tenant/delete/${tenantId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to delete tenant";
        throw new Error(message);
    }
}