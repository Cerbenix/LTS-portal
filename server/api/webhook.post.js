import { readBody, getQuery, createError } from "h3";
import { assertWebhookSecret } from "../utils/http.js";
import { DriveService } from "../services/driveService.js";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const query = getQuery(event);

    try {
        assertWebhookSecret(query);

        const driveService = new DriveService();
        const invoice = driveService.parseKoalendarPayload(body);
        await driveService.saveInvoice(invoice);

        return { success: true, invoiceNumber: invoice.invoiceNumber };
    } catch (err) {
        throw createError({ statusCode: err.statusCode || 500, statusMessage: err.message || String(err) });
    }
});
