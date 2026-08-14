// server/utils/db.js
import { neon } from '@neondatabase/serverless';

// Pull the database URL (Neon provides POSTGRES_URL or DATABASE_URL)
export function getSql() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  return neon(connectionString);
}

// Helper to save or update an invoice
export async function saveInvoice(invoice) {
  const sql = getSql();
  
  // Create table if it doesn't exist
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      invoice_number VARCHAR(100) UNIQUE NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'EUR',
      status VARCHAR(50) DEFAULT 'PENDING',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Insert or update
  const result = await sql`
    INSERT INTO invoices (invoice_number, customer_name, customer_email, amount, currency, status)
    VALUES (${invoice.invoiceNumber}, ${invoice.customer.name}, ${invoice.customer.email}, ${invoice.amount}, ${invoice.currency || 'EUR'}, ${invoice.status || 'PENDING'})
    ON CONFLICT (invoice_number) 
    DO UPDATE SET status = EXCLUDED.status, amount = EXCLUDED.amount
    RETURNING *;
  `;
  
  return result[0];
}

// Helper to fetch all invoices
export async function getAllInvoices() {
  const sql = getSql();
  return await sql`SELECT * FROM invoices ORDER BY created_at DESC;`;
}