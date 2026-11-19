// hooks/useDocument.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchOneDocument,
    fetchDocumentPreview,
    downloadDocument as downloadDocumentApi,
    fetchAllDocuments,
    deleteDocument
} from "@/api/document";
import { api } from '@/api/axios'
import { toast } from "sonner"
import { showErrorToast, showSuccessToast } from "@/lib/toast";


// Blob navigation does not inherit response CSP; only inert supported types may open inline.
const openDocumentPreview = async (documentId: string) => {
    const response = await fetchDocumentPreview(documentId);
    const url = window.URL.createObjectURL(response.data);
    const inline = ['application/pdf', 'image/jpeg', 'image/png'].includes(response.data.type);
    if (inline) {
        window.open(url, '_blank', 'noopener,noreferrer');
    } else {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'document';
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
    // Allow the new tab or download to consume the bytes before releasing the URL.
    setTimeout(() => window.URL.revokeObjectURL(url), 60000);
    return { success: true };
};

// ✅ For fetching document METADATA (what you were originally using)
export const useFetchOneDocument = (documentId: string) => {
    return useQuery({
        queryKey: ["document", documentId, "metadata"],
        queryFn: () => fetchOneDocument(documentId),
        enabled: !!documentId,
    })
}

// ✅ For fetching ALL documents metadata
export const useFetchAllDocuments = (tenantId: string) => {
    return useQuery({
        queryKey: ["documents", tenantId],
        queryFn: () => fetchAllDocuments(tenantId),
        enabled: !!tenantId,
    })
}

// ✅ For VIEWING document in browser - this returns a blob/arraybuffer
export const useViewDocument = () => {
    return useMutation({
        mutationFn: openDocumentPreview,
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
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (documentId: string) => {
            if (!documentId) throw new Error("Document ID is required");
            const response = await deleteDocument(documentId);
            return response;
        },
        onSuccess: (documentId) => {
            showSuccessToast('Document deleted successfully')
            queryClient.invalidateQueries({ queryKey: ["allTenants"] });
        },
        onError: (error: any) => {
            showErrorToast(error)
        }
    });
};

// ✅ Combined hook for both view and download actions
export const useDocumentActions = () => {
    const viewMutation = useMutation({
        mutationFn: openDocumentPreview,
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
