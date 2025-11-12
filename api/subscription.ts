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

