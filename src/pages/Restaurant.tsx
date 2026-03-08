import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import restaurantImg from "@/assets/restaurant.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const categories = ["All", "Local Dishes", "International", "Soft Drinks", "Alcoholic Drinks"];

const menuItems = [
  { name: "Rolex (Chapati Egg Wrap)", price: 5, category: "Local Dishes", desc: "Uganda's beloved street food, elevated" },
  { name: "Luwombo", price: 15, category: "Local Dishes", desc: "Traditional steamed meat in banana leaves" },
  { name: "Matoke & Ground Nut Sauce", price: 12, category: "Local Dishes", desc: "Steamed plantain with rich peanut stew" },
  { name: "Grilled Tilapia", price: 18, category: "Local Dishes", desc: "Fresh Lake Victoria tilapia, charcoal grilled" },
  { name: "Grilled Ribeye Steak", price: 28, category: "International", desc: "200g prime ribeye with garlic butter & fries" },
  { name: "Pasta Carbonara", price: 16, category: "International", desc: "Classic Italian pasta with creamy sauce" },
  { name: "Caesar Salad", price: 12, category: "International", desc: "Fresh romaine, croutons, parmesan dressing" },
  { name: "Grilled Salmon", price: 25, category: "International", desc: "Atlantic salmon with herb butter & vegetables" },
  { name: "Fresh Juice", price: 4, category: "Soft Drinks", desc: "Mango, passion fruit, or watermelon" },
  { name: "Sodas", price: 2, category: "Soft Drinks", desc: "Coca-Cola, Fanta, Sprite, Stoney" },
  { name: "Mineral Water", price: 1.5, category: "Soft Drinks", desc: "Still or sparkling" },
  { name: "Bell Lager", price: 3, category: "Alcoholic Drinks", desc: "Uganda's finest lager" },
  { name: "Nile Special", price: 3, category: "Alcoholic Drinks", desc: "Premium Ugandan beer" },
  { name: "House Wine", price: 8, category: "Alcoholic Drinks", desc: "Red or white, glass" },
  { name: "Signature Cocktail", price: 12, category: "Alcoholic Drinks", desc: "Dyvan Sunset – rum, passion fruit, lime" },
];

const Restaurant = () => {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? menuItems : menuItems.filter((m) => m.category === active);

  return (
    <div>
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
          <SectionHeading subtitle="Our Menu" title="Taste the Finest" description="From authentic Ugandan dishes to international classics, crafted with the freshest ingredients." />

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
              <motion.div key={item.name} {...fadeUp} transition={{ delay: i * 0.05 }} className="bg-card p-6 rounded-lg border border-gold group hover:shadow-gold transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">{item.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{item.desc}</p>
                    <span className="text-muted-foreground text-xs mt-2 inline-block bg-secondary px-2 py-0.5 rounded">{item.category}</span>
                  </div>
                  <span className="text-primary font-bold text-lg font-heading">${item.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 max-w-2xl">
          <SectionHeading subtitle="Reserve" title="Book a Table" description="Reserve your table for a memorable dining experience." />
          <motion.form {...fadeUp} className="bg-card p-8 rounded-lg border border-gold flex flex-col gap-4">
            <input type="text" placeholder="Full Name" className="bg-secondary border border-gold rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            <input type="email" placeholder="Email" className="bg-secondary border border-gold rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            <input type="tel" placeholder="Phone Number" className="bg-secondary border border-gold rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            <div className="grid grid-cols-2 gap-4">
              <input type="date" className="bg-secondary border border-gold rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary" />
              <input type="time" className="bg-secondary border border-gold rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary" />
            </div>
            <input type="number" placeholder="Number of Guests" min="1" className="bg-secondary border border-gold rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            <button type="submit" className="bg-gradient-gold text-primary-foreground py-3 font-semibold uppercase tracking-wide text-sm rounded-sm hover:opacity-90 transition-opacity mt-2">
              Reserve Table
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
};

export default Restaurant;
