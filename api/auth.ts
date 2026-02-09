import {api} from './axios'

interface SignupData {
    firstName: string
    lastName: string
    email: string
    password: string
    // confirmPassword: string
    company?: string
    terms: boolean
}

interface LoginData {
    email: string
    password: string
}

export const signup = async(data: SignupData) => {
    try {
        const response = await api.post("/v1/auth/signup", data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to sign you up";
        throw new Error(message);
    }
}

export const login = async(data: LoginData) => {
    try {
         const response = await api.post("/v1/auth/login", data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to log you in";
        throw new Error(message);
    }
}

export const logout = async() => {
    try {
        const response = await api.post("/v1/auth/logout")
        return response.data
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to log out";
        throw new Error(message);
    }
}