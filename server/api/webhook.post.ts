export default defineEventHandler(async (event) => {
    const body = await readBody<unknown>(event);
    const query = getQuery(event);

    try {
        const secret = typeof query.secret === "string" ? query.secret : undefined;
        assertWebhookSecret(secret);

        const savedBooking = await handleBookingWebhook(body);
        if (!savedBooking) {
            throw createError({
                statusCode: 500,
                statusMessage: "Booking could not be saved.",
            });
        }

        return {
            success: true,
            bookingId: savedBooking.id,
            status: savedBooking.status,
        };
    } catch (err) {
        throw createError({
            statusCode: getErrorStatus(err),
            statusMessage: getErrorMessage(err),
        });
    }
});
