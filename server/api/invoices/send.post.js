import { readBody, createError } from "h3";
import { processAndSendInvoiceForBooking } from "../../services/invoiceService.js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body?.bookingId) {
    throw createError({ statusCode: 400, statusMessage: "bookingId is required" });
  }

  try {
    await processAndSendInvoiceForBooking(body.bookingId);
    return { success: true };
  } catch (err) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || String(err),
    });
  }
});