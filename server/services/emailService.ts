import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

export async function sendInvoiceEmail(to: string, customerName: string, invoiceNumber: string, pdfBuffer: Buffer) {
    const companyName = process.env.COMPANY_NAME || "Payment Receipt";

    return await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to,
        subject: `Invoice ${invoiceNumber} - ${companyName}`,
        text: `Hello ${customerName},\n\nPlease find attached your invoice ${invoiceNumber}.\n\nThank you!`,
        attachments: [
            {
                filename: `${invoiceNumber}.pdf`,
                content: pdfBuffer,
                contentType: "application/pdf",
            },
        ],
    });
}
