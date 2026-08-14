import { google } from "googleapis";

export class DriveService {
    constructor() {
        this.auth = new google.auth.JWT(
            process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            null,
            (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
            ["https://www.googleapis.com/auth/drive.file"],
        );
        this.drive = google.drive({ version: "v3", auth: this.auth });
    }

    parseKoalendarPayload(bookingData) {
        const customerName = bookingData.invitee?.name || "Customer";
        const customerEmail = bookingData.invitee?.email || "";
        const fields = bookingData.invitee?.fields || {};

        const personalCode =
            fields.personal_code ||
            fields["Personal Code / Personas Kods"] ||
            fields["Personas Kods"] ||
            fields["Personal Code"] ||
            "N/A";

        const serviceName = bookingData.link?.name || "Consultation / Service";

        return {
            invoiceNumber: `INV-${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
            customer: {
                name: customerName,
                email: customerEmail,
                personalCode: personalCode,
            },
            service: serviceName,
            amount: bookingData.price || "0.00",
            currency: bookingData.currency || "EUR",
            status: "PAID",
        };
    }

    async saveInvoice(invoicePayload) {
        const safeName = invoicePayload.customer.name.replace(/[^a-zA-Z0-9]/g, "_");
        const fileName = `INV_${invoicePayload.invoiceNumber}_${safeName}.json`;

        const response = await this.drive.files.create({
            requestBody: {
                name: fileName,
                parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
                mimeType: "application/json",
            },
            media: {
                mimeType: "application/json",
                body: JSON.stringify(invoicePayload, null, 2),
            },
        });

        return response.data;
    }

    async fetchAllInvoices() {
        const res = await this.drive.files.list({
            q: `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and mimeType='application/json' and trashed=false`,
            fields: "files(id, name, createdTime)",
        });

        const files = res.data.files || [];
        const invoices = [];

        for (const file of files) {
            const fileData = await this.drive.files.get({
                fileId: file.id,
                alt: "media",
            });
            invoices.push({ driveFileId: file.id, ...fileData.data });
        }

        return invoices;
    }
}
