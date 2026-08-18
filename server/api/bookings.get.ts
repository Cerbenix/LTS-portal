export default defineEventHandler(async (event) => {
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
