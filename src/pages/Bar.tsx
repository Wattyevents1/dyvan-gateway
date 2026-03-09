import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Calendar, Clock, X, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
const barBg = "/gallery/bar-cocktail-bw.jpg";

type Event = Tables<"events">;

const barImages = [
  { src: "/gallery/bar-cocktail-bw.jpg", alt: "Cocktail bar" },
  { src: "/gallery/bar-menu-cocktails.jpg", alt: "Bar cocktails" },
  { src: "/gallery/bar-menu-drink.jpg", alt: "Bar drink" },
  { src: "/gallery/bar-menu-spread.jpg", alt: "Bar menu spread" },
  { src: "/gallery/bar-shots.jpg", alt: "Bar shots" },
  { src: "/gallery/lounge-blue-sofas.jpg", alt: "Lounge blue sofas" },
  { src: "/gallery/lounge-exterior-1.jpg", alt: "Lounge exterior" },
  { src: "/gallery/lounge-exterior-2.jpg", alt: "Lounge exterior" },
  { src: "/gallery/lounge-exterior-3.jpg", alt: "Lounge exterior" },
  { src: "/gallery/lounge-swings.jpg", alt: "Lounge swings" },
  { src: "/gallery/lounge-vip-seating.jpg", alt: "VIP seating" },
  { src: "/gallery/lounge-wide-view.jpg", alt: "Lounge wide view" },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const Bar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const navigateLightbox = (dir: number) => {
    if (lightbox === null) return;
    const next = (lightbox + dir + barImages.length) % barImages.length;
    setLightbox(next);
  };

  useEffect(() => {
    if (lightbox === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") navigateLightbox(-1);
      else if (e.key === "ArrowRight") navigateLightbox(1);
      else if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("is_active", true)
        .gte("event_date", new Date().toISOString().split("T")[0])
        .order("event_date")
        .limit(6);
      setEvents(data || []);
    };
    fetchData();
  }, []);

  return (
    <div>
      <SEO title="Bar & Lounge" description="Enjoy fresh juices, refreshments, live music, and vibrant nightlife at Dyvan Bar & Lounge in Sironko, Uganda." path="/bar" />
      <section className="relative h-[60vh] flex items-center justify-center">
        <img src={barBg} alt="Bar & Lounge" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center">
          <p className="text-primary text-sm uppercase tracking-[0.4em] mb-2">Drinks & Entertainment</p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-gradient-gold">Bar & Lounge</h1>
        </motion.div>
      </section>

      {/* Gallery */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading subtitle="Gallery" title="Our Space" description="Take a look at our bar and lounge." />
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {barImages.map((img, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: Math.min(i, 6) * 0.05 }} className="break-inside-avoid cursor-pointer group" onClick={() => setLightbox(i)}>
                <div className="rounded-lg overflow-hidden border border-gold">
                  <img src={img.src} alt={img.alt} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      {events.length > 0 && (
        <section className="py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <SectionHeading subtitle="Entertainment" title="Upcoming Events" description="Join us for unforgettable nights of music, cocktails, and great company." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.map((e, i) => (
                <motion.div key={e.id} {...fadeUp} transition={{ delay: i * 0.15 }} className="bg-card p-8 rounded-lg border border-gold">
                  {e.poster_url && <img src={e.poster_url} alt={e.title} className="w-full h-40 object-cover rounded-md mb-4" />}
                  <Music className="text-primary mb-4" size={28} />
                  <h3 className="font-heading text-xl font-bold text-foreground mb-3">{e.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Calendar size={14} className="text-primary" /> {new Date(e.event_date).toLocaleDateString("en-UG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </div>
                  {e.event_time && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                      <Clock size={14} className="text-primary" /> {e.event_time}
                    </div>
                  )}
                  {e.description && <p className="text-muted-foreground text-sm">{e.description}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-foreground hover:text-primary z-10" onClick={() => setLightbox(null)}>
              <X size={28} />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-primary bg-background/50 rounded-full p-2 z-10"
              onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
            >
              <ChevronLeft size={32} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-primary bg-background/50 rounded-full p-2 z-10"
              onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
            >
              <ChevronRight size={32} />
            </button>
            <motion.div key={lightbox} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="max-w-4xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
              <img src={barImages[lightbox].src} alt={barImages[lightbox].alt} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
              <p className="text-center text-foreground/80 mt-4 text-sm">{barImages[lightbox].alt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bar;
