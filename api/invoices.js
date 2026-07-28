import { assertMethod, assertPortalAuth } from "../libraries/http.js";
import { DriveService } from "../libraries/driveService.js";

export default async function handler(req, res) {
    if (!assertMethod(req, res, "POST")) return;
    if (!assertPortalAuth(req, res)) return;

    try {
        const driveService = new DriveService();
        const invoices = await driveService.fetchAllInvoices();
        return res.status(200).json({ success: true, invoices });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
