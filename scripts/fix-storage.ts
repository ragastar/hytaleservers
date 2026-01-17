console.log(`
=== Проверка и настройка Storage для серверных изображений ===

Выполните следующие команды по очереди в Supabase Dashboard > SQL Editor:

--- ШАГ 1: Проверить существующие buckets ---
SELECT id, name, public, file_size_limit FROM storage.buckets 
WHERE id IN ('server-logos', 'server-banners');


--- ШАГ 2: Если buckets уже существуют, обновим их (или создадим если нет) ---
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
WHERE id = 'server-logos';

UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
WHERE id = 'server-banners';

-- Если buckets не существуют, создадим их
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 'server-logos', 'server-logos', true, 2097152, 
       ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'server-logos');

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 'server-banners', 'server-banners', true, 5242880, 
       ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'server-banners');


--- ШАГ 3: Удалить старые policies если они есть ---
DROP POLICY IF EXISTS "Public read logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete own logos" ON storage.objects;
DROP POLICY IF EXISTS "Public read banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete own banners" ON storage.objects;


--- ШАГ 4: Включить RLS (если еще не включен) ---
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;


--- ШАГ 5: Создать новые policies для Server Logos ---
CREATE POLICY "Public read logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'server-logos');

CREATE POLICY "Authenticated upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'server-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Authenticated delete own logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'server-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);


--- ШАГ 6: Создать новые policies для Server Banners ---
CREATE POLICY "Public read banners"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'server-banners');

CREATE POLICY "Authenticated upload banners"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'server-banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Authenticated delete own banners"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'server-banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);


--- ШАГ 7: Проверить созданные policies ---
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage';


================================
ИЛИ ПРОСТО ЗАПУСТИТЕ ОДНИМ БЛОКОМ:

-- Обновить/создать buckets
UPDATE storage.buckets 
SET public = true, file_size_limit = 2097152,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
WHERE id = 'server-logos';

UPDATE storage.buckets 
SET public = true, file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
WHERE id = 'server-banners';

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 'server-logos', 'server-logos', true, 2097152, 
       ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'server-logos');

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 'server-banners', 'server-banners', true, 5242880, 
       ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'server-banners');

-- Удалить старые policies
DROP POLICY IF EXISTS "Public read logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete own logos" ON storage.objects;
DROP POLICY IF EXISTS "Public read banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete own banners" ON storage.objects;

-- Включить RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Создать новые policies
CREATE POLICY "Public read logos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'server-logos');

CREATE POLICY "Authenticated upload logos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'server-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated delete own logos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'server-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public read banners"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'server-banners');

CREATE POLICY "Authenticated upload banners"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'server-banners' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated delete own banners"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'server-banners' AND auth.uid()::text = (storage.foldername(name))[1]);

================================

После выполнения проверьте в Supabase Dashboard > Storage:
1. Buckets 'server-logos' и 'server-banners' должны быть публичными (public = true)
2. У каждого bucket должны быть 3 policies (SELECT, INSERT, DELETE)
3. File size limits: logos - 2MB, banners - 5MB
4. Allowed MIME types: image/png, image/jpeg, image/webp, image/gif
`);