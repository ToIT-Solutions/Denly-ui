import {api} from './axios'

export const fetchAllInvites = async() => {
    try {
        const response = await api.get(`/v1/invitation/viewAll`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to fetch all invites";
        throw new Error(message);
    }
}

export const processInvite = async(data: any) => {
    try {
        const response = await api.post("/v1/invitation/process", data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to sign you up";
        throw new Error(message);
    }
}

export const inviteUser = async(data: any) => {
    try {
        const response = await api.post("/v1/invitation/invite", data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to send invitation";
        throw new Error(message);
    }
}

export const resendInvite = async(data: any) => {
    try {
        const response = await api.patch("/v1/invitation/resend", data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to resend invitation";
        throw new Error(message);
    }
}

export const deleteInvite = async(inviteId: any) => {
    try {
        const response = await api.delete(`/v1/invitation/delete/${inviteId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to delete the invite";
        throw new Error(message);
    }
}

