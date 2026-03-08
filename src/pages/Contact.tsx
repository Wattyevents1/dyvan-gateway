import { useState } from "react";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import heroBg from "@/assets/hero-bg.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      message: form.message,
    });
    setIsLoading(false);
    if (error) {
      toast.error("Failed to send message. Please try again.");
    } else {
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const inputClass = "bg-secondary border border-gold rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary w-full";

  return (
    <div>
      <SEO title="Contact Us" description="Get in touch with Dyvan Lounge & Cottages. Located on Mbale–Moroto Road, Sironko District, Uganda. Call, email, or visit us." path="/contact" />
      <section className="relative h-[60vh] flex items-center justify-center">
        <img src={heroBg} alt="Contact" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center">
          <p className="text-primary text-sm uppercase tracking-[0.4em] mb-2">Get In Touch</p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-gradient-gold">Contact Us</h1>
        </motion.div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <SectionHeading subtitle="Reach Out" title="We'd Love to Hear From You" className="text-left" />
              <motion.form {...fadeUp} onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="text" placeholder="Full Name" required value={form.name} onChange={update("name")} className={inputClass} />
                <input type="email" placeholder="Email Address" required value={form.email} onChange={update("email")} className={inputClass} />
                <input type="tel" placeholder="Phone Number" value={form.phone} onChange={update("phone")} className={inputClass} />
                <textarea placeholder="Your Message" required rows={5} value={form.message} onChange={update("message")} className={inputClass + " resize-none"} />
                <button type="submit" className="bg-gradient-gold text-primary-foreground py-3 font-semibold uppercase tracking-wide text-sm rounded-sm hover:opacity-90 transition-opacity">
                  Send Message
                </button>
              </motion.form>
            </div>

            <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
              <div className="flex flex-col gap-6 mb-8">
                {[
                  { icon: MapPin, label: "Location", value: "Mbale–Moroto Road, Sironko District, Uganda" },
                  { icon: Phone, label: "Phone", value: "+256 700 000 000" },
                  { icon: Mail, label: "Email", value: "info@dyvanlounge.com" },
                  { icon: Clock, label: "Hours", value: "Mon–Fri 7AM–11PM | Sat–Sun 8AM–12AM" },
                ].map((info, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="bg-card p-3 rounded-lg border border-gold">
                      <info.icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{info.label}</p>
                      <p className="text-foreground font-medium">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Google Map Embed */}
              <div className="rounded-lg overflow-hidden border border-gold h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63835.04!2d34.25!3d1.23!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177f8f0f0f0f0f0f%3A0x0!2sSironko%2C%20Uganda!5e0!3m2!1sen!2s!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Dyvan Lounge Location"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
