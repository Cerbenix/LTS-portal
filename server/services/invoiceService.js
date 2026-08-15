import { getBookingById } from "../repositories/bookingRepository.js";
import { generateInvoicePdfBuffer } from "./pdfService.js";
import { sendInvoiceEmail } from "./emailService.js";

export async function processAndSendInvoiceForBooking(bookingId) {
  const booking = await getBookingById(bookingId);
  if (!booking) throw new Error("Booking not found");

  // Map database booking record into invoice format
  const invoice = {
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split("T")[0],
    customer: {
      name: booking.parent_name,
      email: booking.parent_email,
      personalCode: booking.personal_code || "N/A",
    },
    service: booking.link_name || "Tennis Lesson",
    amount: "50.00",
    currency: "EUR",
  };

  // 1. Generate PDF
  const pdfBuffer = await generateInvoicePdfBuffer(invoice);

  // 2. Dispatch Email
  await sendInvoiceEmail({
    to: invoice.customer.email,
    customerName: invoice.customer.name,
    invoiceNumber: invoice.invoiceNumber,
    pdfBuffer,
  });

  return invoice;
}