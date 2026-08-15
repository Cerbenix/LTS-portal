import { upsertBooking } from '../repositories/bookingRepository.js';

export async function handleBookingWebhook(payload) {
  const fields = payload.invitee?.fields || {};
  const isCanceled = payload.type === 'event.canceled';

  const bookingData = {
    id: payload.id,
    status: isCanceled ? 'CANCELED' : 'CONFIRMED',
    linkId: payload.link?.id,
    linkName: payload.link?.name,
    parentName: payload.invitee?.name,
    parentEmail: payload.invitee?.email?.toLowerCase(),
    parentPhone: fields.phone_number || null,
    childName: fields.child_name || null,
    personalCode: fields.personal_code || null,
    startAt: payload.start_at,
    rawPayload: payload,
  };

  return await upsertBooking(bookingData);
}