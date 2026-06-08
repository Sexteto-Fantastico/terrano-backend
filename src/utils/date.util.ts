export function formatDateToYYYYMMDD(date: Date): string {
    return date.toISOString().split('T')[0];
}

export function formatDateToStartOfDay(date: Date): string {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d.toISOString();
}

export function getStartOfDay(date: Date | string): Date {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

export function getEndOfDay(date: Date | string): Date {
    const d = new Date(date);
    d.setUTCHours(23, 59, 59, 999);
    return d;
}
