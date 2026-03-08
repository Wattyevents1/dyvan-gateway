import { motion } from "framer-motion";
import { Music, Calendar, Clock } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import barImg from "@/assets/bar.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const drinks = [
  { name: "Dyvan Sunset", price: 12, desc: "Rum, passion fruit, lime, orange bitters" },
  { name: "Elgon Mist", price: 14, desc: "Gin, elderflower, cucumber, tonic" },
  { name: "Safari Sour", price: 11, desc: "Whiskey, lemon, honey, egg white" },
  { name: "Golden Hour", price: 13, desc: "Vodka, mango, ginger, champagne float" },
  { name: "African Spirit", price: 10, desc: "Waragi, pineapple, coconut, lime" },
  { name: "Nile Breeze", price: 9, desc: "Tequila, watermelon, mint, soda" },
];

const events = [
  { title: "Jazz & Cocktails Night", date: "Every Friday", time: "7 PM – 11 PM", desc: "Live jazz performances with premium cocktail pairings" },
  { title: "Afrobeats Saturday", date: "Every Saturday", time: "8 PM – 2 AM", desc: "DJ sets featuring the best of African music" },
  { title: "Wine & Dine Sunday", date: "Every Sunday", time: "5 PM – 9 PM", desc: "Curated wine tasting with light bites" },
];

const Bar = () => (
  <div>
    <section className="relative h-[60vh] flex items-center justify-center">
      <img src={barImg} alt="Bar & Lounge" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/70" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center">
        <p className="text-primary text-sm uppercase tracking-[0.4em] mb-2">Drinks & Entertainment</p>
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-gradient-gold">Bar & Lounge</h1>
      </motion.div>
    </section>

    {/* Signature Cocktails */}
    <section className="py-24">
      <div className="container mx-auto px-4">
        <SectionHeading subtitle="Cocktails" title="Signature Drinks" description="Hand-crafted cocktails inspired by Uganda's vibrant flavors and culture." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drinks.map((d, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="bg-card p-6 rounded-lg border border-gold hover:shadow-gold transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-heading text-xl font-semibold text-foreground">{d.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{d.desc}</p>
                </div>
                <span className="text-primary font-bold text-lg font-heading">UGX {d.price.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Events */}
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <SectionHeading subtitle="Entertainment" title="Upcoming Events" description="Join us for unforgettable nights of music, cocktails, and great company." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((e, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.15 }} className="bg-card p-8 rounded-lg border border-gold">
              <Music className="text-primary mb-4" size={28} />
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">{e.title}</h3>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Calendar size={14} className="text-primary" /> {e.date}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                <Clock size={14} className="text-primary" /> {e.time}
              </div>
              <p className="text-muted-foreground text-sm">{e.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Bar;
