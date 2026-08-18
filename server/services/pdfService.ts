import PDFDocument from "pdfkit";

interface InvoicePdfInput {
    invoiceNumber: string;
    date: string;
    customer?: {
        name?: string | null;
        email?: string | null;
        personalCode?: string | null;
    };
    service?: string | null;
    amount: string;
    currency: string;
}

export async function generateInvoicePdfBuffer(invoice: InvoicePdfInput): Promise<Buffer> {
    const storage = useStorage('assets:server');
    const [fontBuffer, logoBuffer] = await Promise.all([
        storage.getItemRaw('fonts/Roboto-Regular.ttf'),
        storage.getItemRaw('logo.png')
    ]);

    if (!fontBuffer || !logoBuffer) {
        throw new Error("Missing required server assets");
    }
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, size: "A4" });
        const buffers: Buffer[] = [];

        doc.on("data", (chunk: Buffer) => buffers.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", (err) => reject(err));

        doc.font(Buffer.from(fontBuffer));

        // --- HEADER SECTION ---
        // 1. Logo (Top Left)
        doc.image(Buffer.from(logoBuffer), 50, 45, { width: 50 });

        // 2. Invoice Title & Meta (Top Right)
        doc.fontSize(18)
            .text("INVOICE / PAVADZĪME", 300, 50, { align: "right" })
            .fontSize(9)
            .fillColor("#555555")
            .text(`Invoice No: ${invoice.invoiceNumber}`, { align: "right" })
            .text(`Date: ${invoice.date}`, { align: "right" })
            .moveDown();

        // Horizontal Line
        doc.moveTo(50, 115).lineTo(545, 115).strokeColor("#eeeeee").stroke();

        // --- COMPANY & CUSTOMER DETAILS (2-Column Grid) ---
        const detailsTop = 130;

        // Left Column: Issuer Info
        doc.fontSize(10)
            .fillColor("#000000")
            .text("ISSUED BY:", 50, detailsTop, { underline: true })
            .fontSize(9)
            .text(process.env.COMPANY_NAME || "Lūka tenisa skola", 50, detailsTop + 15)
            .text(`Reg. No: ${process.env.COMPANY_REG_NO || "N/A"}`);

        // Right Column: Customer Info
        doc.fontSize(10)
            .text("BILL TO:", 300, detailsTop, { underline: true })
            .fontSize(9)
            .text(invoice.customer?.name || "N/A", 300, detailsTop + 15)
            .text(`Email: ${invoice.customer?.email || "N/A"}`)
            .text(`Personal Code: ${invoice.customer?.personalCode || "N/A"}`);

        // --- TABLE SECTION ---
        const tableTop = 210;

        // Table Header
        doc.rect(50, tableTop, 495, 20)
            .fill("#f5f5f5")
            .fillColor("#000000")
            .fontSize(9)
            .text("Description / Pakalpojums", 60, tableTop + 6)
            .text("Amount / Summa", 400, tableTop + 6, { width: 135, align: "right" });

        // Table Row
        const rowTop = tableTop + 30;
        doc.fontSize(9)
            .text(invoice.service || "N/A", 60, rowTop)
            .text(`${invoice.amount} ${invoice.currency}`, 400, rowTop, { width: 135, align: "right" });

        // Table Bottom Line
        doc.moveTo(50, rowTop + 20)
            .lineTo(545, rowTop + 20)
            .strokeColor("#eeeeee")
            .stroke();

        // --- TOTAL ---
        doc.fontSize(11)
            .text("Total Paid:", 300, rowTop + 35, { width: 100, align: "right" })
            .fontSize(11)
            .text(`${invoice.amount} ${invoice.currency}`, 410, rowTop + 35, { width: 125, align: "right" });

        doc.end();
    });
}
