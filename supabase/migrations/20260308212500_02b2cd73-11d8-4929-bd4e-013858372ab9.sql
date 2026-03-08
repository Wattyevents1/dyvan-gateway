
CREATE TABLE public.gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text,
  category text NOT NULL DEFAULT 'General',
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery photos"
ON public.gallery_photos FOR SELECT
USING (true);

CREATE POLICY "Admins can manage gallery photos"
ON public.gallery_photos FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));
