export default defineEventHandler(async () => {
    try {
        const bookings = await fetchAllBookings();
        return { success: true, bookings };
    } catch (err) {
        throw createError({
            statusCode: getErrorStatus(err),
            statusMessage: getErrorMessage(err),
        });
    }
});
