import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Music, Calendar, Clock, Phone } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import barImg from "@/assets/bar.jpg";

type MenuItem = Tables<"menu_items">;
type Event = Tables<"events">;

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const Bar = () => {
  const [drinks, setDrinks] = useState<MenuItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [drinksRes, eventsRes] = await Promise.all([
        supabase
          .from("menu_items")
          .select("*")
          .eq("is_available", true)
          .in("category", ["Refreshments"])
          .order("name"),
        supabase
          .from("events")
          .select("*")
          .eq("is_active", true)
          .gte("event_date", new Date().toISOString().split("T")[0])
          .order("event_date")
          .limit(6),
      ]);
      setDrinks(drinksRes.data || []);
      setEvents(eventsRes.data || []);
    };
    fetchData();
  }, []);

  return (
    <div>
      <SEO title="Bar & Lounge" description="Enjoy fresh juices, refreshments, live music, and vibrant nightlife at Dyvan Bar & Lounge in Sironko, Uganda." path="/bar" />
      <section className="relative h-[60vh] flex items-center justify-center">
        <img src={barImg} alt="Bar & Lounge" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center">
          <p className="text-primary text-sm uppercase tracking-[0.4em] mb-2">Drinks & Entertainment</p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-gradient-gold">Bar & Lounge</h1>
        </motion.div>
      </section>

      {/* Refreshments */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading subtitle="Drinks" title="Refreshments" description="Fresh juices and beverages to cool you down." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drinks.map((d, i) => (
              <motion.div key={d.id} {...fadeUp} transition={{ delay: i * 0.1 }} className="bg-card p-6 rounded-lg border border-gold hover:shadow-gold transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-foreground">{d.name}</h3>
                    {d.description && <p className="text-muted-foreground text-sm mt-1">{d.description}</p>}
                  </div>
                  <span className="text-primary font-bold text-lg font-heading whitespace-nowrap">UGX {d.price.toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
              <Phone size={14} className="text-primary" /> For deliveries, call <span className="text-primary font-semibold">0756 091987</span>
            </p>
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
    </div>
  );
};

export default Bar;
