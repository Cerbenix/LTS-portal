-- Example schema for storing raw webhook events. Edit as needed.
-- Place your migrations directly in the `db/` directory and name them with a numeric prefix to control order.

CREATE TABLE IF NOT EXISTS webhook_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(255),
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
