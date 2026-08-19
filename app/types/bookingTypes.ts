// server/types/booking.ts

export interface BookingQueryOptions {
    search?: string;
    status?: string;
    startDateFrom?: string;
    startDateTo?: string;
    limit?: number;
    offset?: number;
}

export interface BookingInput {
    id: string;
    status: string;
    linkId?: string | null;
    linkName?: string | null;
    parentName?: string | null;
    parentEmail?: string | null;
    parentPhone?: string | null;
    childName?: string | null;
    personalCode?: string | null;
    startAt?: string | null;
    rawPayload?: unknown;
}