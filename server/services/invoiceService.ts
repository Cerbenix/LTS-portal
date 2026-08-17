import { getBookingById } from "../repositories/bookingRepository";
import { generateInvoicePdfBuffer } from "./pdfService";
import { sendInvoiceEmail } from "./emailService";

interface InvoicePayload {
    invoiceNumber: string;
    date: string;
    customer: {
        name: string;
        email: string;
        personalCode: string;
    };
    service: string;
    amount: string;
    currency: string;
}

export async function processAndSendInvoiceForBooking(bookingId: string) {
    const booking = await getBookingById(bookingId);
    if (!booking) throw new Error("Booking not found");

    const invoiceDate = new Date().toISOString().split("T")[0] ?? "";

    const invoice: InvoicePayload = {
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        date: invoiceDate,
        customer: {
            name: booking.parent_name ?? "Unknown customer",
            email: booking.parent_email ?? "",
            personalCode: booking.personal_code ?? "N/A",
        },
        service: booking.link_name ?? "Tennis Lesson",
        amount: "50.00",
        currency: "EUR",
    };

    const pdfBuffer = await generateInvoicePdfBuffer(invoice);

    await sendInvoiceEmail(invoice.customer.email, invoice.customer.name, invoice.invoiceNumber, pdfBuffer);

    return invoice;
}
