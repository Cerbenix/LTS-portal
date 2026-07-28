import { assertMethod, assertWebhookSecret } from "../libraries/http.js";
import { DriveService } from "../libraries/driveService.js";

export default async function handler(req, res) {
    if (!assertMethod(req, res, "POST")) return;
    if (!assertWebhookSecret(req, res)) return;

    try {
        const driveService = new DriveService();
        const invoice = driveService.parseKoalendarPayload(req.body);
        await driveService.saveInvoice(invoice);

        return res
            .status(200)
            .json({ success: true, invoiceNumber: invoice.invoiceNumber });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
