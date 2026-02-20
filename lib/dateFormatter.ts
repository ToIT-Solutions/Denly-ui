// utils/dateFormatter.ts

type DateFormat = 'short' | 'medium' | 'long' | 'full' | 'compact' | 'time' | 'monthYear' | 'dayMonth';

interface FormatOptions {
    year?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    day?: 'numeric' | '2-digit';
    weekday?: 'long' | 'short' | 'narrow';
    hour?: 'numeric' | '2-digit';
    minute?: 'numeric' | '2-digit';
    hour12?: boolean;
}

export const formatDate = (date: string | Date | number | null | undefined, format: DateFormat = 'medium'): string => {
    if (!date) return '';
    
    const dateObj = new Date(date);
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return '';
    
    const options: Record<DateFormat, FormatOptions> = {
        // Short format: "Jan 1, 2024"
        short: {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        },
        // Medium format: "January 1, 2024" (your preferred format)
        medium: {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        },
        // Long format: "January 1, 2024 at 12:00 PM"
        long: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        },
        // Full format: "Monday, January 1, 2024"
        full: {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        },
        // Compact format: "1/1/2024"
        compact: {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        },
        // Time only: "12:00 PM"
        time: {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        },
        // Month Year: "January 2024"
        monthYear: {
            year: 'numeric',
            month: 'long'
        },
        // Day Month: "January 1"
        dayMonth: {
            month: 'long',
            day: 'numeric'
        }
    };
    
    return dateObj.toLocaleDateString('en-GB', options[format]);
};

/**
 * Format a date with custom options
 * @param date - The date to format
 * @param customOptions - Custom Intl.DateTimeFormat options
 * @returns Formatted date string or empty string if invalid
 */
export const formatDateCustom = (
    date: string | Date | number | null | undefined, 
    customOptions: FormatOptions = {}
): string => {
    if (!date) return '';
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    
    const defaultOptions: FormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    const options = { ...defaultOptions, ...customOptions };
    
    return dateObj.toLocaleDateString('en-GB', options);
};

/**
 * Format a date relative to now (e.g., "2 days ago", "in 3 months")
 * @param date - The date to format
 * @returns Relative time string
 */
export const formatRelativeTime = (date: string | Date | number | null | undefined): string => {
    if (!date) return '';
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    if (Math.abs(diffInYears) >= 1) {
        return rtf.format(-diffInYears, 'year');
    }
    if (Math.abs(diffInMonths) >= 1) {
        return rtf.format(-diffInMonths, 'month');
    }
    if (Math.abs(diffInDays) >= 1) {
        return rtf.format(-diffInDays, 'day');
    }
    if (Math.abs(diffInHours) >= 1) {
        return rtf.format(-diffInHours, 'hour');
    }
    if (Math.abs(diffInMinutes) >= 1) {
        return rtf.format(-diffInMinutes, 'minute');
    }
    return rtf.format(-diffInSeconds, 'second');
};

// Usage examples:
// formatDate('2024-01-15T10:30:00Z') → "January 15, 2024"
// formatDate('2024-01-15T10:30:00Z', 'short') → "Jan 15, 2024"
// formatDate('2024-01-15T10:30:00Z', 'long') → "January 15, 2024 at 10:30 AM"
// formatDate('2024-01-15T10:30:00Z', 'full') → "Monday, January 15, 2024"
// formatDate('2024-01-15T10:30:00Z', 'compact') → "1/15/2024"
// formatDate('2024-01-15T10:30:00Z', 'time') → "10:30 AM"
// formatDate('2024-01-15T10:30:00Z', 'monthYear') → "January 2024"
// formatDate('2024-01-15T10:30:00Z', 'dayMonth') → "January 15"
// formatRelativeTime('2024-01-15') → "2 months ago" (depending on current date)