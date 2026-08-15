import { getSql } from "../db/client.js";

export async function upsertBooking(booking) {
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
