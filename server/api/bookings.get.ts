export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        const bookings = await fetchBookings({
            search: typeof query.search === "string" ? query.search : undefined,
            status: typeof query.status === "string" ? query.status : undefined,
            startDateFrom: typeof query.startDateFrom === "string" ? query.startDateFrom : undefined,
            startDateTo: typeof query.startDateTo === "string" ? query.startDateTo : undefined,
            limit: parseQueryInteger(query.limit),
            offset: parseQueryInteger(query.offset),
        });
        return { success: true, bookings };
    } catch (err) {
        throw createError({
            statusCode: getErrorStatus(err),
            statusMessage: getErrorMessage(err),
        });
    }
});

function parseQueryInteger(value: unknown) {
    if (typeof value !== "string" || !/^\d+$/.test(value)) {
        return undefined;
    }

    return Number(value);
}
