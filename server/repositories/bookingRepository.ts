import { getSql } from "../db/client";
import { BookingInput, BookingQueryOptions } from "~/types/bookingTypes";

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

export async function getFilteredBookings(options: BookingQueryOptions = {}) {
    const sql = getSql();

    const limit = options.limit ?? 50;
    const offset = options.offset ?? 0;
    const searchPattern = options.search ? `%${options.search}%` : null;
    const status = options.status || null;
    const startDateFrom = options.startDateFrom || null;
    const startDateTo = options.startDateTo || null;

    return await sql`
      SELECT 
          id, status, link_id, link_name,
          parent_name, parent_email, parent_phone,
          child_name, personal_code,
          start_at, created_at
      FROM bookings
      WHERE (${status}::text IS NULL OR status = ${status})
        AND (${startDateFrom}::timestamptz IS NULL OR start_at >= ${startDateFrom})
        AND (${startDateTo}::timestamptz IS NULL OR start_at < ${startDateTo})
        AND (
          ${searchPattern}::text IS NULL OR 
          parent_name ILIKE ${searchPattern} OR 
          parent_email ILIKE ${searchPattern} OR 
          child_name ILIKE ${searchPattern} OR
          personal_code ILIKE ${searchPattern}
        )
      ORDER BY start_at DESC
      LIMIT ${limit} 
      OFFSET ${offset};
  `;
}

export async function getBookingById(id: string) {
    const sql = getSql();
    const result = await sql`
    SELECT * FROM bookings WHERE id = ${id} LIMIT 1;
  `;
    return result[0] || null;
}
