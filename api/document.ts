import {api} from './axios'

// export const addDocument = async(data: DocumentData) => {
//     try {
//         const response = await api.post("/v1/document/add", data);
//         return response.data;
//     } catch (error: any) {
//         const message = error.response?.data?.message || error.message || "An error occured when adding document";
//         throw new Error(message);
//     }
// }

export const fetchAllDocuments = async() => {
    try {
        const response = await api.get(`/v1/document/viewAll`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when fetching properties";
        throw new Error(message);
    }
}

export const fetchOneDocument = async(documentId: string) => {
    try {
        const response = await api.get(`/v1/document/viewOne/${documentId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when fetching document";
        throw new Error(message);
    }
}

export const downloadDocument = async(documentId: string) => {
    try {
        const response = await api.get(`/v1/document/download/${documentId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when fetching document";
        throw new Error(message);
    }
}

export const deleteDocument = async(documentId: string) => {
    try {
        const response = await api.delete(`/v1/document/delete/${documentId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured trying to delete document";
        throw new Error(message);
    }
}