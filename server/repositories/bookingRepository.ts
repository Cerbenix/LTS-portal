import { getSql } from "../db/client";

interface BookingInput {
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

export async function upsertBooking(booking: BookingInput) {
    const sql = getSql();

    const result = await sql`
    INSERT INTO bookings (
      id, status, link_id, link_name,
      parent_name, parent_email, parent_phone,
      child_name, personal_code,
      start_at, raw_payload
    ) VALUES (
      ${booking.id}, ${booking.status}, ${booking.linkId}, ${booking.linkName},
      ${booking.parentName}, ${booking.parentEmail}, ${booking.parentPhone},
      ${booking.childName}, ${booking.personalCode},
      ${booking.startAt},
      ${JSON.stringify(booking.rawPayload)}
    )
    ON CONFLICT (id) DO UPDATE SET
      status = EXCLUDED.status,
      updated_at = NOW()
    RETURNING *;
  `;

    return result?.[0];
}

export async function getAllBookings() {
    const sql = getSql();
    return await sql`
    SELECT 
      id, status, link_id, link_name,
      parent_name, parent_email, parent_phone,
      child_name, personal_code,
      start_at, created_at
    FROM bookings
    ORDER BY start_at DESC;
  `;
}

export async function getBookingById(id: string) {
    const sql = getSql();
    const result = await sql`
    SELECT * FROM bookings WHERE id = ${id} LIMIT 1;
  `;
    return result[0] || null;
}
