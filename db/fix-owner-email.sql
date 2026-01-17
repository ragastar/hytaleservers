-- Сделать owner_email nullable
ALTER TABLE servers ALTER COLUMN owner_email DROP NOT NULL;

-- Сделать owner_id nullable (для обратной совместимости)
ALTER TABLE servers ALTER COLUMN owner_id DROP NOT NULL;
