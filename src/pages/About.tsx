import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import SectionHeading from "@/components/SectionHeading";
import heroBg from "@/assets/hero-bg.jpg";
import restaurant from "@/assets/restaurant.jpg";
import bar from "@/assets/bar.jpg";
import cottage1 from "@/assets/cottage-1.jpg";
import cottage2 from "@/assets/cottage-2.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const gallery = [heroBg, cottage1, restaurant, bar, cottage2];

const About = () => (
  <div>
    {/* Hero */}
    <section className="relative h-[60vh] flex items-center justify-center">
      <img src={heroBg} alt="About Dyvan Lounge" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/70" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center">
        <p className="text-primary text-sm uppercase tracking-[0.4em] mb-2">Our Story</p>
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-gradient-gold">About Us</h1>
      </motion.div>
    </section>

    {/* Story */}
    <section className="py-24">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div {...fadeUp}>
          <p className="text-primary text-sm uppercase tracking-[0.3em] mb-2">Who We Are</p>
          <h2 className="font-heading text-4xl font-bold text-foreground mb-6">A Haven of Luxury in Sironko</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Nestled along the scenic Mbale–Moroto Road in Sironko District, Uganda, Dyvan Lounge & Cottages
            was born from a vision to bring world-class hospitality to Eastern Uganda.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Our founders saw the breathtaking beauty of the Elgon region and knew it deserved a destination
            that matched its natural splendor. Today, we offer luxury cottages, a premium restaurant serving
            both local and international cuisine, and an elegant bar & lounge.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Every detail — from the hand-crafted furnishings to our carefully curated menu — reflects
            our commitment to excellence and authentic Ugandan warmth.
          </p>
        </motion.div>
        <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.2 }} className="rounded-lg overflow-hidden shadow-gold">
          <img src={cottage2} alt="Luxury cottage with mountain view" className="w-full h-[400px] object-cover" />
        </motion.div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div {...fadeUp} className="bg-card p-10 rounded-lg border border-gold">
            <h3 className="font-heading text-2xl font-bold text-primary mb-4">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To provide an unparalleled hospitality experience that combines luxury accommodation,
              exceptional cuisine, and heartfelt Ugandan hospitality, creating lasting memories for every guest.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="bg-card p-10 rounded-lg border border-gold">
            <h3 className="font-heading text-2xl font-bold text-primary mb-4">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To be the premier luxury destination in Eastern Uganda, recognized for our outstanding service,
              sustainable practices, and contribution to the local community's growth and prosperity.
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Gallery */}
    <section className="py-24">
      <div className="container mx-auto px-4">
        <SectionHeading subtitle="Gallery" title="Moments at Dyvan" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {gallery.map((img, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="rounded-lg overflow-hidden aspect-square group">
              <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
