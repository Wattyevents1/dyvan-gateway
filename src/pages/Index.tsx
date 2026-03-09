import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bed, UtensilsCrossed, Wine, Star, ArrowRight, CalendarDays } from "lucide-react";
const heroBg = "/gallery/lounge-wide-view.jpg";
const cottage1 = "/gallery/cottage-bedroom-white.jpg";
const restaurant = "/gallery/restaurant-dining.jpg";
const bar = "/gallery/bar-cocktail-bw.jpg";
import SectionHeading from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Cottage = Tables<"cottages">;
type Event = Tables<"events">;

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const testimonials = [
  { name: "Sarah M.", text: "An absolute paradise! The cottages are stunning and the food is incredible.", rating: 5 },
  { name: "John K.", text: "Best lounge experience in Eastern Uganda. The bar service is world-class.", rating: 5 },
  { name: "Grace N.", text: "We had our wedding reception here. Everything was perfect. Highly recommend!", rating: 5 },
];

const Index = () => {
  const [cottages, setCottages] = useState<Cottage[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [cottageRes, eventRes] = await Promise.all([
        supabase.from("cottages").select("*").eq("is_available", true).order("price_per_night").limit(3),
        supabase.from("events").select("*").eq("is_active", true).gte("event_date", new Date().toISOString().split("T")[0]).order("event_date").limit(3),
      ]);
      setCottages(cottageRes.data || []);
      setEvents(eventRes.data || []);
    };
    fetchAll();
  }, []);

  return (
    <div className="overflow-hidden">
      <SEO title="Dyvan Lounge & Cottages | Luxury Stay in Sironko, Uganda" description="Experience luxury cottages, fine dining, and premium bar services at Dyvan Lounge & Cottages on Mbale–Moroto Road, Sironko District, Uganda." path="/" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        "name": "Dyvan Lounge & Cottages",
        "description": "Luxury cottages, fine dining, and premium bar services in Sironko, Uganda.",
        "address": { "@type": "PostalAddress", "streetAddress": "Mbale–Moroto Road", "addressLocality": "Sironko", "addressRegion": "Eastern", "addressCountry": "UG" },
        "hasMap": "https://maps.google.com/?q=Sironko+District+Uganda",
        "priceRange": "$$",
        "servesCuisine": ["Ugandan", "International"]
      }) }} />
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
            <Link to="/booking" className="bg-gradient-gold text-primary-foreground px-8 py-4 font-semibold tracking-wide uppercase text-sm rounded-sm hover:opacity-90 transition-opacity shadow-gold">
              Book Your Stay
            </Link>
            <Link to="/restaurant" className="border border-gold-strong text-foreground px-8 py-4 font-semibold tracking-wide uppercase text-sm rounded-sm hover:bg-primary/10 transition-colors">
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
              <motion.div key={c.id} {...fadeUp} transition={{ duration: 0.7, delay: i * 0.15 }} className="bg-card rounded-lg overflow-hidden border border-gold group">
                <div className="overflow-hidden h-56">
                  <img src={c.image_url || cottage1} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="font-heading text-xl font-bold text-foreground">{c.name}</h3>
                    <span className="text-primary font-bold text-lg">UGX {c.price_per_night.toLocaleString()}<span className="text-muted-foreground text-xs font-normal">/night</span></span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{c.description}</p>
                  <Link to="/booking" className="mt-4 inline-block bg-gradient-gold text-primary-foreground px-6 py-2 text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity">
                    Book Now
                  </Link>
                </div>
              </motion.div>
            ))}
            {cottages.length === 0 && (
              <div className="md:col-span-3 text-center text-muted-foreground py-8">Loading cottages...</div>
            )}
          </div>
        </div>
      </section>

      {/* Menu Highlights */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <SectionHeading subtitle="Dining" title="Menu Highlights" description="A taste of what awaits you at our restaurant." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, i) => (
              <motion.div key={item.id} {...fadeUp} transition={{ duration: 0.7, delay: i * 0.1 }} className="bg-card p-6 rounded-lg border border-gold">
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} className="w-full h-36 object-cover rounded-md mb-4" />
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">{item.name}</h3>
                    {item.description && <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{item.description}</p>}
                    <span className="text-muted-foreground text-xs mt-2 inline-block bg-secondary px-2 py-0.5 rounded">{item.category}</span>
                  </div>
                  <span className="text-primary font-bold text-lg font-heading">UGX {item.price.toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
          {menuItems.length > 0 && (
            <div className="text-center mt-10">
              <Link to="/restaurant" className="border border-gold-strong text-foreground px-8 py-3 font-semibold uppercase text-sm rounded-sm hover:bg-primary/10 transition-colors inline-flex items-center gap-2">
                View Full Menu <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <SectionHeading subtitle="What's On" title="Upcoming Events" description="Join us for exciting events and unforgettable nights." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.map((ev, i) => (
                <motion.div key={ev.id} {...fadeUp} transition={{ duration: 0.7, delay: i * 0.15 }} className="bg-card rounded-lg overflow-hidden border border-gold">
                  {ev.poster_url && (
                    <img src={ev.poster_url} alt={ev.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-primary text-sm mb-2">
                      <CalendarDays size={14} />
                      <span>{new Date(ev.event_date).toLocaleDateString("en-UG", { weekday: "short", month: "short", day: "numeric" })}</span>
                      {ev.event_time && <span>• {ev.event_time}</span>}
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground">{ev.title}</h3>
                    {ev.description && <p className="text-muted-foreground text-sm mt-2 line-clamp-3">{ev.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

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
