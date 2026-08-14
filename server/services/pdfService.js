import PDFDocument from "pdfkit";

export class PdfService {
    static generateBuffer(invoice) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];

            doc.on("data", (chunk) => buffers.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", (err) => reject(err));

            doc.fontSize(20).text("INVOICE / PAVADZĪME", { align: "center" }).moveDown();
            doc.fontSize(10).text(`Company: ${process.env.COMPANY_NAME || "Your Company"}`);
            doc.text(`Reg. No: ${process.env.COMPANY_REG_NO || "N/A"}`).moveDown();

            doc.text(`Invoice No: ${invoice.invoiceNumber}`);
            doc.text(`Date: ${invoice.date}`).moveDown();

            doc.text(`Customer: ${invoice.customer?.name || "N/A"}`);
            doc.text(`Email: ${invoice.customer?.email || "N/A"}`);
            doc.text(`Personal Code: ${invoice.customer?.personalCode || "N/A"}`).moveDown();

            doc.text(`Service: ${invoice.service}`);
            doc.text(`Amount Paid: ${invoice.amount} ${invoice.currency}`).moveDown();

            doc.end();
        });
    }
}
