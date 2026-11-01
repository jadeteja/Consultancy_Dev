-- V3__alter_company_urls_to_text.sql
-- Expand logo_url and website_url to TEXT to support arbitrary length URLs and CDNs

ALTER TABLE companies ALTER COLUMN logo_url TYPE TEXT;
ALTER TABLE companies ALTER COLUMN website_url TYPE TEXT;
