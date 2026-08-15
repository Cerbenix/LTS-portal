CREATE TABLE IF NOT EXISTS bookings (
  -- Core Koalendar Identifiers
  id UUID PRIMARY KEY,
  status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',

  -- Event / Service Info
  link_id UUID NOT NULL,
  link_name VARCHAR(255),

  -- Parent (Invitee) Information
  parent_name VARCHAR(255) NOT NULL,
  parent_email VARCHAR(255) NOT NULL,
  parent_phone VARCHAR(50),

  -- Child & Accounting Information
  child_name VARCHAR(255),
  personal_code VARCHAR(50),

  -- Schedule & Timing
  start_at TIMESTAMPTZ NOT NULL,

  -- Full payload backup for safety
  raw_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for instant Admin search & filtering
CREATE INDEX idx_bookings_start_at ON bookings(start_at);
CREATE INDEX idx_bookings_parent_email ON bookings(LOWER(parent_email));
CREATE INDEX idx_bookings_parent_phone ON bookings(parent_phone);
CREATE INDEX idx_bookings_child_name ON bookings(LOWER(child_name));
CREATE INDEX idx_bookings_personal_code ON bookings(personal_code);
CREATE INDEX idx_bookings_link_name ON bookings(link_name);