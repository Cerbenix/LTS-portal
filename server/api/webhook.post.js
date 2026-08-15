import { readBody, getQuery, createError } from "h3";
import { assertWebhookSecret } from "../utils/http.js";
import { handleBookingWebhook } from "../services/bookingService.js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const query = getQuery(event);

  try {
    assertWebhookSecret(query);

    const savedBooking = await handleBookingWebhook(body);

    return {
      success: true,
      bookingId: savedBooking.id,
      status: savedBooking.status,
    };
  } catch (err) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || String(err),
    });
  }
});