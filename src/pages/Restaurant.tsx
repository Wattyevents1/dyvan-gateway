import { useState, useEffect, useMemo } from "react";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import type { Tables } from "@/integrations/supabase/types";
import restaurantImg from "@/assets/restaurant.jpg";

type MenuItem = Tables<"menu_items">;

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const Restaurant = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("menu_items")
        .select("*")
        .eq("is_available", true)
        .order("category")
        .order("name");
      setItems(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(items.map((i) => i.category))];
    return ["All", ...cats];
  }, [items]);

  const filtered = active === "All" ? items : items.filter((m) => m.category === active);

  return (
    <div>
      <SEO title="Restaurant & Menu" description="Savor exquisite local and international cuisine at Dyvan Lounge restaurant in Sironko, Uganda. Fresh ingredients, expert chefs, unforgettable flavors." path="/restaurant" />
      <section className="relative h-[60vh] flex items-center justify-center">
        <img src={restaurantImg} alt="Restaurant" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center">
          <p className="text-primary text-sm uppercase tracking-[0.4em] mb-2">Dining</p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-gradient-gold">Restaurant</h1>
        </motion.div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading subtitle="Our Menu" title="Taste the Finest" description="From authentic local dishes to international classics, crafted with the freshest ingredients." />

          {loading ? (
            <div className="text-center text-muted-foreground animate-pulse py-12">Loading menu...</div>
          ) : (
            <>
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((item, i) => (
                  <motion.div key={item.id} {...fadeUp} transition={{ delay: i * 0.05 }} className="bg-card p-6 rounded-lg border border-gold group hover:shadow-gold transition-shadow">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name} className="w-full h-40 object-cover rounded-md mb-4" />
                    )}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-foreground">{item.name}</h3>
                        {item.description && <p className="text-muted-foreground text-sm mt-1">{item.description}</p>}
                        <span className="text-muted-foreground text-xs mt-2 inline-block bg-secondary px-2 py-0.5 rounded">{item.category}</span>
                      </div>
                      <span className="text-primary font-bold text-lg font-heading">UGX {item.price.toLocaleString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <ReservationForm />
    </div>
  );
};

const ReservationForm = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", time: "", guests: "1" });
  const [isLoading, setIsLoading] = useState(false);
  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const inputClass = "bg-secondary border border-gold rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary w-full";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.from("reservations").insert({
      guest_name: form.name,
      guest_email: form.email,
      guest_phone: form.phone,
      reservation_date: form.date,
      reservation_time: form.time,
      num_guests: parseInt(form.guests),
    });
    setIsLoading(false);
    if (error) {
      toast.error("Failed to submit reservation. Please try again.");
    } else {
      toast.success("Table reserved! We'll confirm shortly.");
      setForm({ name: "", email: "", phone: "", date: "", time: "", guests: "1" });
    }
  };

  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4 max-w-2xl">
        <SectionHeading subtitle="Reserve" title="Book a Table" description="Reserve your table for a memorable dining experience." />
        <motion.form initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} onSubmit={handleSubmit} className="bg-card p-8 rounded-lg border border-gold flex flex-col gap-4">
          <input type="text" placeholder="Full Name" required value={form.name} onChange={update("name")} className={inputClass} />
          <input type="email" placeholder="Email" required value={form.email} onChange={update("email")} className={inputClass} />
          <input type="tel" placeholder="Phone Number" required value={form.phone} onChange={update("phone")} className={inputClass} />
          <div className="grid grid-cols-2 gap-4">
            <input type="date" required value={form.date} onChange={update("date")} className={inputClass} />
            <input type="time" required value={form.time} onChange={update("time")} className={inputClass} />
          </div>
          <input type="number" placeholder="Number of Guests" min="1" required value={form.guests} onChange={update("guests")} className={inputClass} />
          <button type="submit" disabled={isLoading} className="bg-gradient-gold text-primary-foreground py-3 font-semibold uppercase tracking-wide text-sm rounded-sm hover:opacity-90 transition-opacity mt-2 disabled:opacity-50">
            {isLoading ? "Reserving..." : "Reserve Table"}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Restaurant;
