import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
const heroBg = "/gallery/lounge-exterior-2.jpg";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryPhoto {
  id: string;
  image_url: string;
  caption: string | null;
  category: string;
}

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const ITEMS_PER_PAGE = 12;

const Gallery = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const categories = ["All", ...new Set(photos.map((p) => p.category))];
  const filtered = active === "All" ? photos : photos.filter((p) => p.category === active);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const navigateLightbox = (dir: number) => {
    if (lightbox === null) return;
    const next = (lightbox + dir + filtered.length) % filtered.length;
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
  }, [lightbox, filtered]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data } = await supabase
        .from("gallery_photos")
        .select("id, image_url, caption, category")
        .eq("is_visible", true)
        .order("sort_order")
        .order("created_at", { ascending: false });
      setPhotos((data as GalleryPhoto[]) || []);
      setLoading(false);
    };
    fetchPhotos();
  }, []);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [active]);


  return (
    <div>
      <SEO title="Photo Gallery" description="Browse photos of Dyvan Lounge & Cottages — luxury rooms, fine dining, scenic views, and memorable events in Sironko, Uganda." path="/gallery" />
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <img src={heroBg} alt="Gallery" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center">
          <p className="text-primary text-sm uppercase tracking-[0.4em] mb-2">Explore</p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-gradient-gold">Our Gallery</h1>
        </motion.div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading subtitle="Photos" title="Capture the Moments" description="A glimpse into the beauty and experiences at Dyvan Lounge & Cottages." />

          {loading ? (
            <div className="text-center text-muted-foreground animate-pulse py-12">Loading gallery...</div>
          ) : photos.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">Gallery coming soon. Check back later!</div>
          ) : (
            <>
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActive(cat)}
                    className={`px-6 py-2 text-sm font-medium rounded-sm border transition-all ${
                      active === cat
                        ? "bg-gradient-gold text-primary-foreground border-transparent"
                        : "border-gold text-foreground/70 hover:text-primary hover:border-gold-strong"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Masonry-ish Grid */}
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {visible.map((photo, i) => (
                  <motion.div
                    key={photo.id}
                    {...fadeUp}
                    transition={{ delay: Math.min(i, 6) * 0.05 }}
                    className="break-inside-avoid cursor-pointer group"
                    onClick={() => setLightbox(filtered.indexOf(photo))}
                  >
                    <div className="rounded-lg overflow-hidden border border-gold relative">
                      <img
                        src={photo.image_url}
                        alt={photo.caption || "Gallery photo"}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                      {photo.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-foreground text-sm">{photo.caption}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
                    className="px-8 py-3 text-sm font-medium rounded-sm border border-gold text-foreground/70 hover:text-primary hover:border-gold-strong transition-all"
                  >
                    Load More Photos
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
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
              <img src={filtered[lightbox].image_url} alt={filtered[lightbox].caption || "Gallery photo"} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
              {filtered[lightbox].caption && (
                <p className="text-center text-foreground/80 mt-4 text-sm">{filtered[lightbox].caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
