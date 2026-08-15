import { createError } from "h3";
import { fetchAllBookings } from "../services/bookingService.js";

export default defineEventHandler(async () => {
  try {
    const bookings = await fetchAllBookings();
    return {
      success: true,
      bookings,
    };
  } catch (err) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || String(err),
    });
  }
});