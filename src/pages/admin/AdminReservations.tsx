import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Reservation = Tables<"reservations">;

const AdminReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    const { data } = await supabase.from("reservations").select("*").order("reservation_date", { ascending: false });
    setReservations(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchReservations(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("reservations").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(`Reservation ${status}`);
    fetchReservations();
  };

  if (loading) return <div className="text-muted-foreground animate-pulse">Loading...</div>;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-gradient-gold mb-6">Reservations</h1>
      <div className="bg-card rounded-lg border border-gold overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Guest</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Contact</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Date & Time</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Guests</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
              <th className="text-right px-4 py-3 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-secondary/50">
                <td className="px-4 py-3 text-foreground font-medium">{r.guest_name}</td>
                <td className="px-4 py-3">
                  <p className="text-foreground text-xs">{r.guest_email}</p>
                  <p className="text-muted-foreground text-xs">{r.guest_phone}</p>
                </td>
                <td className="px-4 py-3 text-foreground text-xs">{r.reservation_date} at {r.reservation_time}</td>
                <td className="px-4 py-3 text-foreground">{r.num_guests}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    r.status === "confirmed" ? "bg-green-500/20 text-green-400" :
                    r.status === "cancelled" ? "bg-destructive/20 text-destructive" :
                    "bg-primary/20 text-primary"
                  }`}>{r.status}</span>
                </td>
                <td className="px-4 py-3 text-right space-x-1">
                  {r.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus(r.id, "confirmed")} className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Confirm</button>
                      <button onClick={() => updateStatus(r.id, "cancelled")} className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded">Cancel</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No reservations yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReservations;
