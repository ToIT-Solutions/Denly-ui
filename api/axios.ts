import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:8888/api',
    timeout: 4000,
    withCredentials: true,
})