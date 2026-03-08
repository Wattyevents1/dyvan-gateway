import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, ShoppingCart, Mail, DollarSign, Home, UtensilsCrossed } from "lucide-react";

interface Stats {
  bookings: number;
  orders: number;
  messages: number;
  cottages: number;
  menuItems: number;
  reservations: number;
}

const AdminOverview = () => {
  const [stats, setStats] = useState<Stats>({ bookings: 0, orders: 0, messages: 0, cottages: 0, menuItems: 0, reservations: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [bookings, orders, messages, cottages, menuItems, reservations] = await Promise.all([
        supabase.from("bookings").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
        supabase.from("cottages").select("*", { count: "exact", head: true }),
        supabase.from("menu_items").select("*", { count: "exact", head: true }),
        supabase.from("reservations").select("*", { count: "exact", head: true }),
      ]);
      setStats({
        bookings: bookings.count || 0,
        orders: orders.count || 0,
        messages: messages.count || 0,
        cottages: cottages.count || 0,
        menuItems: menuItems.count || 0,
        reservations: reservations.count || 0,
      });

      const { data: rb } = await supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(5);
      setRecentBookings(rb || []);
      const { data: rm } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(5);
      setRecentMessages(rm || []);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Bookings", value: stats.bookings, icon: CalendarDays, color: "text-primary" },
    { label: "Orders", value: stats.orders, icon: ShoppingCart, color: "text-primary" },
    { label: "Messages", value: stats.messages, icon: Mail, color: "text-primary" },
    { label: "Cottages", value: stats.cottages, icon: Home, color: "text-primary" },
    { label: "Menu Items", value: stats.menuItems, icon: UtensilsCrossed, color: "text-primary" },
    { label: "Reservations", value: stats.reservations, icon: DollarSign, color: "text-primary" },
  ];

  if (loading) return <div className="text-muted-foreground animate-pulse">Loading dashboard...</div>;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-gradient-gold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-card p-6 rounded-lg border border-gold">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="text-3xl font-bold font-heading text-foreground mt-1">{c.value}</p>
              </div>
              <c.icon className={`h-8 w-8 ${c.color} opacity-60`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg border border-gold">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Recent Bookings</h3>
          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground text-sm">No bookings yet</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex justify-between items-center text-sm border-b border-border pb-2">
                  <div>
                    <p className="text-foreground font-medium">{b.guest_name}</p>
                    <p className="text-muted-foreground text-xs">{b.check_in} → {b.check_out}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    b.status === "confirmed" ? "bg-green-500/20 text-green-400" :
                    b.status === "cancelled" ? "bg-destructive/20 text-destructive" :
                    "bg-primary/20 text-primary"
                  }`}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card p-6 rounded-lg border border-gold">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Recent Messages</h3>
          {recentMessages.length === 0 ? (
            <p className="text-muted-foreground text-sm">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((m) => (
                <div key={m.id} className="border-b border-border pb-2">
                  <div className="flex justify-between items-start">
                    <p className="text-foreground font-medium text-sm">{m.name}</p>
                    {!m.is_read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
