import { useState } from "react";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
const restaurantBg = "/gallery/restaurant-full-spread.jpg";

const menuPages = Array.from({ length: 14 }, (_, i) => `/menu/page-${i + 1}.jpg`);

const Restaurant = () => {
  return (
    <div>
      <SEO title="Restaurant & Menu" description="Savor exquisite local and international cuisine at Dyvan Lounge restaurant in Sironko, Uganda. Fresh ingredients, expert chefs, unforgettable flavors." path="/restaurant" />
      <section className="relative h-[60vh] flex items-center justify-center">
        <img src={restaurantBg} alt="Restaurant" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center">
          <p className="text-primary text-sm uppercase tracking-[0.4em] mb-2">Dining</p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-gradient-gold">Restaurant</h1>
        </motion.div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading subtitle="Our Menu" title="Taste the Finest" description="From authentic local dishes to international classics, crafted with the freshest ingredients." />

          <div className="max-w-3xl mx-auto overflow-y-auto max-h-[80vh] rounded-lg border border-gold shadow-gold scrollbar-thin">
            {menuPages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Menu page ${i + 1}`}
                className="w-full block"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      <ReservationForm />
    </div>
  );
};
