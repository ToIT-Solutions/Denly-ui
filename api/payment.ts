interface Payment {
    id: string;
    company_id: string;
    property_id: string;
    tenant_id: string;
    amount: number;
    payment_date: string; // Date string
    due_date: string; // Date string
    payment_method: string;
    status: 'completed' | 'pending' | 'failed' | 'refunded';
    reference_number?: string;
    bank_reference?: string;
    receipt_number?: string;
    period?: string;
    payment_type: 'monthly_rent' | 'late_fee' | 'other';
    description?: string;
    created_at: string; // Timestamp
}