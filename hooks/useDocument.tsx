// hooks/useDocument.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    fetchOneDocument,
    downloadDocument as downloadDocumentApi,
    fetchAllDocuments,
    deleteDocument
} from "@/api/document";
import { api } from '@/api/axios'


// ✅ For fetching document METADATA (what you were originally using)
export const useFetchOneDocument = (documentId: string) => {
    return useQuery({
        queryKey: ["document", documentId, "metadata"],
        queryFn: () => fetchOneDocument(documentId),
        enabled: !!documentId,
    })
}

// ✅ For fetching ALL documents metadata
export const useFetchAllDocuments = () => {
    return useQuery({
        queryKey: ["documents", "all"],
        queryFn: () => fetchAllDocuments(),
    })
}

// ✅ For VIEWING document in browser - this returns a blob/arraybuffer
export const useViewDocument = () => {
    return useMutation({
        mutationFn: async (documentId: string) => {
            if (!documentId) throw new Error("Document ID is required");

            // Use the download endpoint but with responseType: 'blob'
            const response = await api.get(`/v1/document/download/${documentId}`, {
                responseType: 'blob',
            });

            // Create URL and open in new tab
            const url = window.URL.createObjectURL(response.data);
            window.open(url, '_blank');

            // Clean up
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);

            return { success: true };
        },
    });
};

// ✅ For DOWNLOADING document - saves to device
export const useDownloadDocument = () => {
    return useMutation({
        mutationFn: async ({ documentId, filename }: { documentId: string; filename?: string }) => {
            if (!documentId) throw new Error("Document ID is required");

            const response = await api.get(`/v1/document/download/${documentId}`, {
                responseType: 'blob',
            });

            // Get filename from Content-Disposition header or use provided filename
            let finalFilename = filename || 'document.pdf';
            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (filenameMatch) {
                    finalFilename = filenameMatch[1];
                }
            }

            // Create download link
            const url = window.URL.createObjectURL(response.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = finalFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Clean up
            window.URL.revokeObjectURL(url);

            return { success: true };
        },
    });
};

// ✅ For DELETING document
export const useDeleteDocument = () => {
    return useMutation({
        mutationFn: async (documentId: string) => {
            if (!documentId) throw new Error("Document ID is required");
            const response = await deleteDocument(documentId);
            return response;
        },
    });
};

// ✅ Combined hook for both view and download actions
export const useDocumentActions = () => {
    const viewMutation = useMutation({
        mutationFn: async (documentId: string) => {
            const response = await api.get(`/v1/document/download/${documentId}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(response.data);
            window.open(url, '_blank');

            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);
        },
    });

    const downloadMutation = useMutation({
        mutationFn: async ({ documentId, filename }: { documentId: string; filename?: string }) => {
            const response = await api.get(`/v1/document/download/${documentId}`, {
                responseType: 'blob',
            });

            let finalFilename = filename || 'document.pdf';
            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (filenameMatch) {
                    finalFilename = filenameMatch[1];
                }
            }

            const url = window.URL.createObjectURL(response.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = finalFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            window.URL.revokeObjectURL(url);
        },
    });

    return {
        viewDocument: viewMutation.mutateAsync,
        downloadDocument: downloadMutation.mutateAsync,
        isViewing: viewMutation.isPending,
        isDownloading: downloadMutation.isPending,
        viewError: viewMutation.error,
        downloadError: downloadMutation.error,
        resetView: viewMutation.reset,
        resetDownload: downloadMutation.reset,
    };
};