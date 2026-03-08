import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wifi, Car, Coffee, Tv, Bath, Mountain } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import heroBg from "@/assets/hero-bg.jpg";
import cottage1 from "@/assets/cottage-1.jpg";

type Cottage = Tables<"cottages">;

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const defaultAmenities = [
  { icon: Wifi, label: "Free Wi-Fi" },
  { icon: Car, label: "Free Parking" },
  { icon: Coffee, label: "Room Service" },
  { icon: Tv, label: "Smart TV" },
  { icon: Bath, label: "Private Bath" },
  { icon: Mountain, label: "Mountain View" },
];

const Cottages = () => {
  const [cottages, setCottages] = useState<Cottage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("cottages")
        .select("*")
        .eq("is_available", true)
        .order("price_per_night");
      setCottages(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div>
      <section className="relative h-[60vh] flex items-center justify-center">
        <img src={heroBg} alt="Dyvan Cottages" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center">
          <p className="text-primary text-sm uppercase tracking-[0.4em] mb-2">Accommodation</p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-gradient-gold">Our Cottages</h1>
        </motion.div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading subtitle="Stay With Us" title="Luxury Accommodation" description="Choose from our selection of premium cottages, each designed for the ultimate comfort experience." />
          
          {loading ? (
            <div className="text-center text-muted-foreground animate-pulse py-12">Loading cottages...</div>
          ) : cottages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">No cottages available at the moment.</div>
          ) : (
            <div className="flex flex-col gap-16">
              {cottages.map((c, i) => (
                <motion.div key={c.id} {...fadeUp} transition={{ delay: i * 0.1 }} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center`}>
                  <div className={`rounded-lg overflow-hidden shadow-gold ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    <img 
                      src={c.image_url || cottage1} 
                      alt={c.name} 
                      className="w-full h-[400px] object-cover" 
                    />
                  </div>
                  <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                    <h3 className="font-heading text-3xl font-bold text-foreground mb-2">{c.name}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                      <span>{c.max_guests} Guest{c.max_guests > 1 ? "s" : ""}</span>
                      {c.size_sqm && (
                        <>
                          <span>•</span>
                          <span>{c.size_sqm} sqm</span>
                        </>
                      )}
                    </div>
                    {c.description && (
                      <p className="text-muted-foreground leading-relaxed mb-6">{c.description}</p>
                    )}
                    {c.amenities && c.amenities.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {c.amenities.map((a, j) => (
                          <span key={j} className="text-sm text-foreground/70 bg-secondary px-3 py-1 rounded-sm border border-gold/30">
                            {a}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {defaultAmenities.map((a, j) => (
                          <div key={j} className="flex items-center gap-2 text-sm text-foreground/70">
                            <a.icon size={16} className="text-primary" />
                            {a.label}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-6">
                      <span className="text-primary font-heading text-3xl font-bold">
                        UGX {c.price_per_night.toLocaleString()}
                        <span className="text-muted-foreground text-sm font-body font-normal">/night</span>
                      </span>
                      <Link to="/booking" className="bg-gradient-gold text-primary-foreground px-8 py-3 font-semibold text-sm rounded-sm hover:opacity-90 transition-opacity">
                        Book Now
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Cottages;
