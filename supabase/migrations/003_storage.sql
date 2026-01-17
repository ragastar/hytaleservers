-- Create Storage Buckets for Server Images

-- Bucket for Server Logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'server-logos',
  'server-logos',
  true,
  2097152, -- 2MB limit
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket for Server Banners
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'server-banners',
  'server-banners',
  true,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for Server Logos
CREATE POLICY IF NOT EXISTS "Public read logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'server-logos');

CREATE POLICY IF NOT EXISTS "Authenticated upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'server-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Authenticated delete own logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'server-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS Policies for Server Banners
CREATE POLICY IF NOT EXISTS "Public read banners"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'server-banners');

CREATE POLICY IF NOT EXISTS "Authenticated upload banners"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'server-banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Authenticated delete own banners"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'server-banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;