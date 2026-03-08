import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wifi, Car, Coffee, Tv, Bath, Mountain } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import heroBg from "@/assets/hero-bg.jpg";
import cottage1 from "@/assets/cottage-1.jpg";
import cottage2 from "@/assets/cottage-2.jpg";
import cottage3 from "@/assets/cottage-3.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const amenities = [
  { icon: Wifi, label: "Free Wi-Fi" },
  { icon: Car, label: "Free Parking" },
  { icon: Coffee, label: "Room Service" },
  { icon: Tv, label: "Smart TV" },
  { icon: Bath, label: "Private Bath" },
  { icon: Mountain, label: "Mountain View" },
];

const cottages = [
  { name: "Deluxe Suite", price: 120, img: cottage1, desc: "A beautifully appointed suite featuring a king-size bed, private balcony with stunning mountain views, and premium amenities.", guests: "2 Guests", size: "45 sqm" },
  { name: "Premium Suite", price: 180, img: cottage2, desc: "Spacious suite with a separate lounge area, jacuzzi, and panoramic views of the Elgon highlands. Perfect for couples.", guests: "2 Guests", size: "65 sqm" },
  { name: "Family Cottage", price: 250, img: cottage3, desc: "A full cottage with two bedrooms, living room, kitchenette, and fireplace. Ideal for families or extended stays.", guests: "4-6 Guests", size: "120 sqm" },
];

const Cottages = () => (
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
        <div className="flex flex-col gap-16">
          {cottages.map((c, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}>
              <div className={`rounded-lg overflow-hidden shadow-gold ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <img src={c.img} alt={c.name} className="w-full h-[400px] object-cover" />
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <h3 className="font-heading text-3xl font-bold text-foreground mb-2">{c.name}</h3>
                <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                  <span>{c.guests}</span>
                  <span>•</span>
                  <span>{c.size}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">{c.desc}</p>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {amenities.map((a, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-foreground/70">
                      <a.icon size={16} className="text-primary" />
                      {a.label}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-primary font-heading text-3xl font-bold">${c.price}<span className="text-muted-foreground text-sm font-body font-normal">/night</span></span>
                  <Link to="/booking" className="bg-gradient-gold text-primary-foreground px-8 py-3 font-semibold text-sm rounded-sm hover:opacity-90 transition-opacity">
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Cottages;
