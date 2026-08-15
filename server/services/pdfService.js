import PDFDocument from "pdfkit";
import path from "path";

export function generateInvoicePdfBuffer(invoice) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));

    // Path to your custom UTF-8 TTF font
    const fontPath = path.resolve(process.cwd(), "server/assets/fonts/Roboto-Regular.ttf");
    
    // Set the custom font for full UTF-8 / Latvian character support
    doc.font(fontPath);

    // Header
    doc.fontSize(20).text("INVOICE / PAVADZĪME", { align: "center" }).moveDown();
    doc.fontSize(10).text(`Company: ${process.env.COMPANY_NAME || "Lūka tenisa skola"}`);
    doc.text(`Reg. No: ${process.env.COMPANY_REG_NO || "N/A"}`).moveDown();

    // Invoice Details
    doc.text(`Invoice No: ${invoice.invoiceNumber}`);
    doc.text(`Date: ${invoice.date}`).moveDown();

    // Customer Info
    doc.text(`Customer: ${invoice.customer?.name || "N/A"}`);
    doc.text(`Email: ${invoice.customer?.email || "N/A"}`);
    doc.text(`Personal Code: ${invoice.customer?.personalCode || "N/A"}`).moveDown();

    // Line Items
    doc.text(`Service: ${invoice.service}`);
    doc.text(`Amount Paid: ${invoice.amount} ${invoice.currency}`).moveDown();

    doc.end();
  });
}