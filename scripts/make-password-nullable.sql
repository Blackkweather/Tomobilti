-- Make password field nullable to support OAuth users
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;













