import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Order = Tables<"orders">;

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, field: "status" | "payment_status", value: string) => {
    const { error } = await supabase.from("orders").update({ [field]: value }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success("Order updated");
    fetchOrders();
  };

  if (loading) return <div className="text-muted-foreground animate-pulse">Loading...</div>;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-gradient-gold mb-6">Order Management</h1>
      <div className="bg-card rounded-lg border border-gold overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Customer</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Total</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Payment</th>
              <th className="text-right px-4 py-3 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border hover:bg-secondary/50">
                <td className="px-4 py-3">
                  <p className="text-foreground font-medium">{o.customer_name}</p>
                  <p className="text-muted-foreground text-xs">{o.customer_phone}</p>
                </td>
                <td className="px-4 py-3 text-primary font-semibold">${o.total_amount}</td>
                <td className="px-4 py-3">
                  <select value={o.status} onChange={(e) => updateStatus(o.id, "status", e.target.value)} className="bg-secondary border border-gold rounded px-2 py-1 text-xs text-foreground">
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select value={o.payment_status} onChange={(e) => updateStatus(o.id, "payment_status", e.target.value)} className="bg-secondary border border-gold rounded px-2 py-1 text-xs text-foreground">
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
