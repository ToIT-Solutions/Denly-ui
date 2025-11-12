import {api} from './axios'

interface UserData {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: 'owner' | 'manager' | 'agent' | 'viewer';
    status?: 'active' | 'invited' | 'suspended';
    profile_image_url?: string;
}

export const addUser = async(data: UserData) => {
    try {
        const response = await api.post(`/user/add`, data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to create user";
        throw new Error(message);
    }
}

export const fetchAllUsers = async(subscriptionId: string) => {
    try {
        const response = await api.get(`/user/view/${subscriptionId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to fetch users";
        throw new Error(message);
    }
}

export const fetchOneUser = async(userId: string) => {
    try {
        const response = await api.get(`/user/view/${userId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to fetch user";
        throw new Error(message);
    }
}

export const editUser = async(data: UserData, userId: string) => {
    try {
        const response = await api.put(`/user/edit/${userId}`, data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to edit user";
        throw new Error(message);
    }
}

export const deleteUser = async(userId: string) => {
    try {
        const response = await api.delete(`/user/delete/${userId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to delete user";
        throw new Error(message);
    }
}