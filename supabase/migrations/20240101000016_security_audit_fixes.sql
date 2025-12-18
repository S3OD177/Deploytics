-- Enable pgcrypto for encryption functions
create extension if not exists "pgcrypto";

-- No schema changes needed yet, just ensuring the extension is available
-- for future token encryption.
