import { readBody, createError } from "h3";
import { assertPortalAuth } from "../utils/http.js";
import { EmailService } from "../services/emailService.js";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    try {
        assertPortalAuth(body);

        const { invoice } = body;
        if (!invoice) throw createError({ statusCode: 400, statusMessage: "Invoice data required." });

        const emailService = new EmailService();
        await emailService.sendInvoiceEmail(invoice);
        return { success: true, message: "Email sent successfully!" };
    } catch (err) {
        throw createError({ statusCode: err.statusCode || 500, statusMessage: err.message || String(err) });
    }
});
