import { assertMethod, assertPortalAuth } from "../libraries/http.js";
import { EmailService } from "../libraries/emailService.js";

export default async function handler(req, res) {
    if (!assertMethod(req, res, "POST")) return;
    if (!assertPortalAuth(req, res)) return;

    const { invoice } = req.body;
    if (!invoice)
        return res.status(400).json({ error: "Invoice data required." });

    try {
        const emailService = new EmailService();
        await emailService.sendInvoiceEmail(invoice);
        return res
            .status(200)
            .json({ success: true, message: "Email sent successfully!" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
