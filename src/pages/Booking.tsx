import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import heroBg from "@/assets/hero-bg.jpg";

const Booking = () => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", checkin: "", checkout: "", guests: "1", cottage: "deluxe", payment: "pay-on-arrival",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.from("bookings").insert({
      guest_name: form.name,
      guest_email: form.email,
      guest_phone: form.phone,
      check_in: form.checkin,
      check_out: form.checkout,
      num_guests: parseInt(form.guests),
      payment_method: form.payment,
    });
    setIsLoading(false);
    if (error) {
      toast.error("Failed to submit booking. Please try again.");
    } else {
      toast.success("Booking request submitted! We'll confirm via email shortly.");
      setForm({ name: "", email: "", phone: "", checkin: "", checkout: "", guests: "1", cottage: "deluxe", payment: "pay-on-arrival" });
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const inputClass = "bg-secondary border border-gold rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary w-full";

  return (
    <div>
      <section className="relative h-[60vh] flex items-center justify-center">
        <img src={heroBg} alt="Booking" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center">
          <p className="text-primary text-sm uppercase tracking-[0.4em] mb-2">Reservations</p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-gradient-gold">Book Your Stay</h1>
        </motion.div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <SectionHeading subtitle="Reserve" title="Cottage Booking" description="Fill in the form below and we'll get back to you with confirmation." />
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            onSubmit={handleSubmit}
            className="bg-card p-8 rounded-lg border border-gold flex flex-col gap-5"
          >
            <input type="text" placeholder="Full Name" required value={form.name} onChange={update("name")} className={inputClass} />
            <input type="email" placeholder="Email Address" required value={form.email} onChange={update("email")} className={inputClass} />
            <input type="tel" placeholder="Phone Number" required value={form.phone} onChange={update("phone")} className={inputClass} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Check-in</label>
                <input type="date" required value={form.checkin} onChange={update("checkin")} className={inputClass} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Check-out</label>
                <input type="date" required value={form.checkout} onChange={update("checkout")} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Guests</label>
                <input type="number" min="1" max="10" value={form.guests} onChange={update("guests")} className={inputClass} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Cottage Type</label>
                <select value={form.cottage} onChange={update("cottage")} className={inputClass}>
                  <option value="deluxe">Deluxe Suite – $120/night</option>
                  <option value="premium">Premium Suite – $180/night</option>
                  <option value="family">Family Cottage – $250/night</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Payment Method</label>
              <select value={form.payment} onChange={update("payment")} className={inputClass}>
                <option value="pay-on-arrival">Pay on Arrival</option>
                <option value="mobile-money">Mobile Money (MTN/Airtel)</option>
                <option value="bank-transfer">Bank Transfer</option>
              </select>
            </div>
            <button type="submit" className="bg-gradient-gold text-primary-foreground py-4 font-semibold uppercase tracking-wide text-sm rounded-sm hover:opacity-90 transition-opacity mt-2 shadow-gold">
              Confirm Booking
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
};

export default Booking;
