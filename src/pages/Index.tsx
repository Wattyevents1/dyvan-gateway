import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bed, UtensilsCrossed, Wine, Star, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import cottage1 from "@/assets/cottage-1.jpg";
import cottage2 from "@/assets/cottage-2.jpg";
import restaurant from "@/assets/restaurant.jpg";
import bar from "@/assets/bar.jpg";
import SectionHeading from "@/components/SectionHeading";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const cottages = [
  { name: "Deluxe Suite", price: "$120", img: cottage1, desc: "King bed, private balcony, mountain views" },
  { name: "Premium Suite", price: "$180", img: cottage2, desc: "Spacious suite with lounge area & jacuzzi" },
  { name: "Royal Cottage", price: "$250", img: cottage1, desc: "Full cottage with kitchen & living room" },
];

const testimonials = [
  { name: "Sarah M.", text: "An absolute paradise! The cottages are stunning and the food is incredible.", rating: 5 },
  { name: "John K.", text: "Best lounge experience in Eastern Uganda. The bar service is world-class.", rating: 5 },
  { name: "Grace N.", text: "We had our wedding reception here. Everything was perfect. Highly recommend!", rating: 5 },
];

const Index = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Dyvan Lounge exterior at golden hour" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/60" />
          <div className="absolute inset-0 bg-warm-glow" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative z-10 text-center px-4 max-w-4xl"
        >
          <p className="text-primary font-body text-sm uppercase tracking-[0.4em] mb-4">Welcome to</p>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-gradient-gold leading-tight">
            Dyvan Lounge<br /><span className="text-foreground text-3xl md:text-4xl font-normal">&amp; Cottages</span>
          </h1>
          <p className="text-foreground/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto font-light leading-relaxed">
            Luxury accommodation, exquisite dining, and unforgettable experiences in Sironko, Uganda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              to="/booking"
              className="bg-gradient-gold text-primary-foreground px-8 py-4 font-semibold tracking-wide uppercase text-sm rounded-sm hover:opacity-90 transition-opacity shadow-gold"
            >
              Book Your Stay
            </Link>
            <Link
              to="/restaurant"
              className="border border-gold-strong text-foreground px-8 py-4 font-semibold tracking-wide uppercase text-sm rounded-sm hover:bg-primary/10 transition-colors"
            >
              View Menu
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <SectionHeading subtitle="Our Services" title="Luxury Redefined" description="From premium accommodation to fine dining and an exclusive bar, we offer a complete luxury experience." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Bed, title: "Luxury Cottages", desc: "Premium suites with mountain views and modern amenities", link: "/cottages", img: cottage1 },
              { icon: UtensilsCrossed, title: "Fine Dining", desc: "Local and international cuisine prepared by expert chefs", link: "/restaurant", img: restaurant },
              { icon: Wine, title: "Bar & Lounge", desc: "Premium cocktails and drinks in an elegant atmosphere", link: "/bar", img: bar },
            ].map((s, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.7, delay: i * 0.15 }}>
                <Link to={s.link} className="group block relative rounded-lg overflow-hidden h-96">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <s.icon className="text-primary mb-3" size={32} />
                    <h3 className="font-heading text-2xl font-bold text-foreground">{s.title}</h3>
                    <p className="text-muted-foreground text-sm mt-2">{s.desc}</p>
                    <span className="text-primary text-sm font-semibold flex items-center gap-1 mt-3 group-hover:gap-3 transition-all">
                      Explore <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cottages */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading subtitle="Accommodation" title="Featured Cottages" description="Each cottage is designed for ultimate comfort with breathtaking views of the Elgon region." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cottages.map((c, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.7, delay: i * 0.15 }} className="bg-card rounded-lg overflow-hidden border border-gold group">
                <div className="overflow-hidden h-56">
                  <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="font-heading text-xl font-bold text-foreground">{c.name}</h3>
                    <span className="text-primary font-bold text-lg">{c.price}<span className="text-muted-foreground text-xs font-normal">/night</span></span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">{c.desc}</p>
                  <Link to="/booking" className="mt-4 inline-block bg-gradient-gold text-primary-foreground px-6 py-2 text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity">
                    Book Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <SectionHeading subtitle="Guest Reviews" title="What Our Guests Say" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.7, delay: i * 0.15 }} className="bg-card p-8 rounded-lg border border-gold">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 italic leading-relaxed">"{t.text}"</p>
                <p className="text-primary font-semibold mt-4">— {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Dyvan Lounge" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/80" />
        </div>
        <motion.div {...fadeUp} className="relative z-10 text-center container mx-auto px-4">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gradient-gold">Ready for an Unforgettable Experience?</h2>
          <p className="text-foreground/70 text-lg mt-4 max-w-xl mx-auto">Book your stay today and discover the finest hospitality in Eastern Uganda.</p>
          <Link to="/booking" className="mt-8 inline-block bg-gradient-gold text-primary-foreground px-10 py-4 font-semibold tracking-wide uppercase text-sm rounded-sm hover:opacity-90 transition-opacity shadow-gold">
            Reserve Now
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
