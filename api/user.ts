import {api} from './axios'

interface UserData {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: 'owner' | 'manager' | 'agent' | 'viewer';
    status?: 'active' | 'invited' | 'suspended';
}


export const fetchAllUsers = async() => {
    try {
        const response = await api.get(`/v1/user/viewAll`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to fetch all users";
        throw new Error(message);
    }
}

export const fetchOneUser = async(userId: string) => {
    try {
        const response = await api.get(`/v1/user/viewOne/${userId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to fetch user";
        throw new Error(message);
    }
}

export const editUser = async(userId: string , data: UserData) => {
    try {
        const response = await api.put(`/v1/user/edit/${userId}`, data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to edit user";
        throw new Error(message);
    }
}

export const editUserRole = async(userId: string , data: UserData) => {
    try {
        const response = await api.patch(`/v1/user/role/${userId}`, data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to edit user role";
        throw new Error(message);
    }
}

export const deleteUser = async(userId: string) => {
    try {
        const response = await api.delete(`/v1/user/delete/${userId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to delete user";
        throw new Error(message);
    }
}