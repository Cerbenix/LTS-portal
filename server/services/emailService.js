import nodemailer from "nodemailer";
import { PdfService } from "./pdfService.js";

export class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
    }

    async sendInvoiceEmail(invoice) {
        const pdfBuffer = await PdfService.generateBuffer(invoice);

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: invoice.customer.email,
            subject: `Invoice ${invoice.invoiceNumber} - ${process.env.COMPANY_NAME || "Payment Receipt"}`,
            text: `Hello ${invoice.customer.name},\n\nPlease find attached your invoice ${invoice.invoiceNumber}.\n\nThank you!`,
            attachments: [
                {
                    filename: `${invoice.invoiceNumber}.pdf`,
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
        };

        return await this.transporter.sendMail(mailOptions);
    }
}
