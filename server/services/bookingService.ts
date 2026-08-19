import { upsertBooking, getAllBookings } from "../repositories/bookingRepository";

type BookingWebhookPayload = {
    id: string;
    type?: string;
    start_at?: string | null;
    link?: { id?: string | null; name?: string | null };
    invitee?: {
        name?: string | null;
        email?: string | null;
        fields?: Record<string, string | null | undefined>;
    };
};

export async function handleBookingWebhook(rawPayload: unknown) {
    const payload = rawPayload as BookingWebhookPayload;
    const fields = payload.invitee?.fields || {};
    const isCanceled = payload.type === "event.canceled";

    const bookingData = {
        id: payload.id,
        status: isCanceled ? "CANCELED" : "CONFIRMED",
        linkId: payload.link?.id,
        linkName: payload.link?.name,
        parentName: payload.invitee?.name,
        parentEmail: payload.invitee?.email?.toLowerCase(),
        parentPhone: fields.phone_number || null,
        childName: fields.child_name || null,
        personalCode: fields.personal_code || null,
        startAt: payload.start_at,
        rawPayload,
    };

    return await upsertBooking(bookingData);
}

export async function fetchAllBookings() {
    const bookings = await getAllBookings();
    return bookings.map((booking: Record<string, unknown>) => ({
        ...booking,
        formatted_date: booking.start_at ? new Date(booking.start_at as string).toLocaleDateString("lv-LV") : null,
    }));
}
