import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Booking = Tables<"bookings">;

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchBookings = async () => {
    let query = supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(`Booking ${status}`);
    fetchBookings();
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Check-in", "Check-out", "Guests", "Status", "Payment"];
    const rows = bookings.map((b) => [b.guest_name, b.guest_email, b.guest_phone, b.check_in, b.check_out, b.num_guests, b.status, b.payment_method]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "bookings.csv"; a.click();
  };

  if (loading) return <div className="text-muted-foreground animate-pulse">Loading...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="font-heading text-3xl font-bold text-gradient-gold">Booking Management</h1>
        <div className="flex gap-2">
          {["all", "pending", "confirmed", "cancelled"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-medium rounded-sm border capitalize ${filter === f ? "bg-gradient-gold text-primary-foreground border-transparent" : "border-gold text-foreground/70"}`}>
              {f}
            </button>
          ))}
          <button onClick={exportCSV} className="px-3 py-1.5 text-xs font-medium rounded-sm border border-gold text-foreground/70 hover:text-primary">Export CSV</button>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-gold overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Guest</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Contact</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Dates</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Guests</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
              <th className="text-right px-4 py-3 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t border-border hover:bg-secondary/50">
                <td className="px-4 py-3 text-foreground font-medium">{b.guest_name}</td>
                <td className="px-4 py-3">
                  <a href={`mailto:${b.guest_email}`} className="text-primary text-xs hover:underline block">{b.guest_email}</a>
                  <a href={`tel:${b.guest_phone}`} className="text-primary text-xs hover:underline block">{b.guest_phone}</a>
                </td>
                <td className="px-4 py-3 text-foreground text-xs">{b.check_in} → {b.check_out}</td>
                <td className="px-4 py-3 text-foreground">{b.num_guests}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    b.status === "confirmed" ? "bg-green-500/20 text-green-400" :
                    b.status === "cancelled" ? "bg-destructive/20 text-destructive" :
                    "bg-primary/20 text-primary"
                  }`}>{b.status}</span>
                </td>
                <td className="px-4 py-3 text-right space-x-1">
                  {b.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus(b.id, "confirmed")} className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded hover:bg-green-500/30">Confirm</button>
                      <button onClick={() => updateStatus(b.id, "cancelled")} className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded hover:bg-destructive/30">Cancel</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No bookings found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
