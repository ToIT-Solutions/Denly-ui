import {api} from './axios'

interface Subscription {
    id: string;
    company_id: string;
    plan_id: string;
    status: 'active' | 'canceled' | 'past_due';
    current_period_start: string; // Date string
    current_period_end: string; // Date string
    cancel_at_period_end: boolean;
    created_at: string; // Timestamp
    updated_at: string; // Timestamp
}

interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price_monthly: number;
    price_yearly?: number;
    max_properties: number;
    max_users: number;
    features: string[];
    is_popular: boolean;
    is_active: boolean;
    created_at: string; // Timestamp
}


export const getSubscriptionData = async() => {
    try {
        const response = await api.get("/v1/subscription/viewAll");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when fetching subscriptions";
        throw new Error(message);
    }
}

export const getSubscriptionPlans = async() => {
    try {
        const response = await api.get("/v1/subscription/viewAll/plans");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "An error occured when fetching subscription plans";
        throw new Error(message);
    }
}

