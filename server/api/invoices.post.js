import { readBody, createError } from "h3";
import { assertPortalAuth } from "../utils/http.js";
import { DriveService } from "../services/driveService.js";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    try {
        assertPortalAuth(body);

        const driveService = new DriveService();
        const invoices = await driveService.fetchAllInvoices();
        return { success: true, invoices };
    } catch (err) {
        throw createError({ statusCode: err.statusCode || 500, statusMessage: err.message || String(err) });
    }
});
