
CREATE TABLE public.weekly_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.weekly_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view weekly events" ON public.weekly_events FOR SELECT USING (true);
CREATE POLICY "Admins can manage weekly events" ON public.weekly_events FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.weekly_events (day, title, description, sort_order) VALUES
  ('Every Wednesday', 'Live Bands Night', 'Enjoy live music performances from top local bands.', 1),
  ('Every Thursday', 'Oldies Night', 'A throwback to the golden classics — sing along to your favorite oldies.', 2),
  ('Sundown Sets', 'DJ Set by DVJ Divon', 'Catch the vibe with electrifying sundown DJ sets by DVJ Divon.', 3);
