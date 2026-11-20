import axios from "axios";
import useAuthStore from "@/store/useAuthStore";
import { showErrorToast } from "@/lib/toast";
import { redirect } from "@/lib/redirect";
import { getApiBaseUrl } from "../lib/apiBaseUrl";

export const api = axios.create({
  baseURL: getApiBaseUrl(process.env.NEXT_PUBLIC_API_URL, process.env.NODE_ENV === 'production'),
  timeout: 10000,
  // withCredentials: true,
});

// 🔥 GLOBAL GUARDS (prevent multiple triggers)
let isHandlingAuthError = false;
let isHandlingSubscriptionError = false;
let isHandlingNetworkError = false;
let isHandlingServerError = false;

// Request interceptor - get token from Zustand
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Define error types that should redirect to error page
const REDIRECT_ERROR_STATUSES = [500, 502, 503, 504];
const TOAST_ERROR_STATUSES = [400, 404, 409, 422];
const AUTH_ERROR_STATUSES = [401];
const SUBSCRIPTION_ERROR_STATUSES = [402];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const errorCode = error.response?.data?.code;
    const errorMessage = error.response?.data?.message;
    // Keep an ambiguous rent payment on the form so its saved request can be retried.
    if (error.config?.url === "/v1/payment/add" && (!status || status >= 500)) {
      return Promise.reject(error);
    }

    // 🔥 Handle Network Errors FIRST (no response at all)
    if (!error.response) {
      if (!isHandlingNetworkError) {
        isHandlingNetworkError = true;

        //console.log('Network error')

        const message = encodeURIComponent(
          "Unable to connect to the server. Please check your internet connection.",
        );

        window.location.href = `/error?status=0&code=NETWORK_ERROR&message=${message}`;
      }

      return Promise.reject(error);
    }

    // Handle Authentication Errors (401)
    if (status === 401) {
      const { token, clearUser } = useAuthStore.getState();
      // A late response for a previous session must not clear the current account.
      const requestAuthorization = error.config?.headers?.Authorization;
      const currentAuthorization = token ? `Bearer ${token}` : undefined;
      const isLogin = ["/v1/auth/login", "/v1/admin/auth/login"].includes(error.config?.url);
      if (requestAuthorization !== currentAuthorization || isLogin) {
        return Promise.reject(error);
      }
      if (!isHandlingAuthError) {
        isHandlingAuthError = true;

        //console.log('Authentication error')

        showErrorToast("Your session has expired. Please log in again.");

        clearUser();

        setTimeout(() => {
          isHandlingAuthError = false;
          if (useAuthStore.getState().token) return;
          window.location.href = window.location.pathname?.startsWith('/secret-panel-88') ? '/secret-panel-88/login' : '/auth/login';
        }, 1400);
      }

      return Promise.reject(error);
    }

    // Handle Subscription Errors (402)
    if (status === 402) {
      if (!isHandlingSubscriptionError) {
        isHandlingSubscriptionError = true;

        //console.log('Subscription error')

        showErrorToast("Your subscription has expired or is inactive.");

        setTimeout(() => {
          window.location.href = "/dashboard/subscription/billing?state=no-sub";
        }, 1400);
      }

      return Promise.reject(error);
    }

    // Handle Redirect Errors (500, 502, 503, 504, etc.)
    if (REDIRECT_ERROR_STATUSES.includes(status)) {
      if (!isHandlingServerError) {
        isHandlingServerError = true;

        //console.log('Server error')

        // Keep backend diagnostics out of navigation URLs, history and referrers.
        window.location.href = `/error?status=${status}&code=SERVER_ERROR`;
      }

      return Promise.reject(error);
    }

    // Handle Specific Error Codes that should redirect
    if (
      errorCode === "DATABASE_ERROR" ||
      errorCode === "SERVICE_UNAVAILABLE" ||
      errorCode === "RATE_LIMIT_EXCEEDED" ||
      errorCode === "MAINTENANCE_MODE"
    ) {
      //console.log('Specific backend error')

      const query = new URLSearchParams({ status: String(status || 500), code: errorCode });
      window.location.href = `/error?${query}`;

      return Promise.reject(error);
    }

    // Handle Network Errors (no response from server)
    if (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK") {
      //console.log('Network error')
      const message = encodeURIComponent(
        "Unable to connect to the server. Please check your internet connection.",
      );

      window.location.href = `/error?status=0&code=NETWORK_ERROR&message=${message}`;

      // window.location.href = '/error?status=0&code=NETWORK_ERROR&message=Unable%20to%20connect%20to%20the%20server.%20Please%20check%20your%20internet%20connection.'
      return Promise.reject(error);
    }

    // Handle Toast Errors (400, 404, 409, 422, etc.)
    if (TOAST_ERROR_STATUSES.includes(status)) {
      //console.log('Client error - showing toast')

      showErrorToast(errorMessage || "An error occurred. Please try again.");

      return Promise.reject(error);
    }

    // Handle any other unhandled errors - redirect to error page
    //console.log('Unhandled error:', error)

    window.location.href = `/error?status=${status || 500}&code=UNKNOWN_ERROR`;

    return Promise.reject(error);
  },
);
