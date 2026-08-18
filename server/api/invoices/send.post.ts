export default defineEventHandler(async (event) => {
    const body = await readBody<{ bookingId?: string; password?: string }>(event);

    if (!body?.bookingId) {
        throw createError({
            statusCode: 400,
            statusMessage: "bookingId is required",
        });
    }

    try {
        await processAndSendInvoiceForBooking(body.bookingId);
        return { success: true };
    } catch (err) {
        throw createError({
            statusCode: getErrorStatus(err),
            statusMessage: getErrorMessage(err),
        });
    }
});
