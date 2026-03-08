import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Cottage = Tables<"cottages">;

const AdminCottages = () => {
  const [cottages, setCottages] = useState<Cottage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Cottage | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price_per_night: "", max_guests: "2", size_sqm: "", image_url: "", is_available: true });

  const fetchCottages = async () => {
    const { data } = await supabase.from("cottages").select("*").order("created_at", { ascending: false });
    setCottages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCottages(); }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", price_per_night: "", max_guests: "2", size_sqm: "", image_url: "", is_available: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (c: Cottage) => {
    setForm({
      name: c.name, description: c.description || "", price_per_night: String(c.price_per_night),
      max_guests: String(c.max_guests), size_sqm: String(c.size_sqm || ""), image_url: c.image_url || "", is_available: c.is_available,
    });
    setEditing(c);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name, description: form.description || null, price_per_night: parseFloat(form.price_per_night),
      max_guests: parseInt(form.max_guests), size_sqm: form.size_sqm ? parseInt(form.size_sqm) : null,
      image_url: form.image_url || null, is_available: form.is_available,
    };

    if (editing) {
      const { error } = await supabase.from("cottages").update(payload).eq("id", editing.id);
      if (error) { toast.error("Failed to update"); return; }
      toast.success("Cottage updated");
    } else {
      const { error } = await supabase.from("cottages").insert(payload);
      if (error) { toast.error("Failed to create"); return; }
      toast.success("Cottage created");
    }
    resetForm();
    fetchCottages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this cottage?")) return;
    const { error } = await supabase.from("cottages").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Cottage deleted");
    fetchCottages();
  };

  const inputClass = "bg-secondary border border-gold rounded-sm px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary w-full";

  if (loading) return <div className="text-muted-foreground animate-pulse">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-3xl font-bold text-gradient-gold">Cottage Management</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="flex items-center gap-2 bg-gradient-gold text-primary-foreground px-4 py-2 text-sm font-semibold rounded-sm hover:opacity-90">
          <Plus size={16} /> Add Cottage
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border border-gold mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Cottage Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
          <input type="number" placeholder="Price per Night" required value={form.price_per_night} onChange={(e) => setForm({ ...form, price_per_night: e.target.value })} className={inputClass} />
          <input type="number" placeholder="Max Guests" value={form.max_guests} onChange={(e) => setForm({ ...form, max_guests: e.target.value })} className={inputClass} />
          <input type="number" placeholder="Size (sqm)" value={form.size_sqm} onChange={(e) => setForm({ ...form, size_sqm: e.target.value })} className={inputClass} />
          <input type="text" placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputClass} />
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} className="accent-primary" />
            Available
          </label>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass + " md:col-span-2 resize-none"} rows={3} />
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="bg-gradient-gold text-primary-foreground px-6 py-2 text-sm font-semibold rounded-sm hover:opacity-90">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={resetForm} className="border border-gold text-foreground px-6 py-2 text-sm rounded-sm hover:bg-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-card rounded-lg border border-gold overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Name</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Price/Night</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Guests</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
              <th className="text-right px-4 py-3 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cottages.map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-secondary/50">
                <td className="px-4 py-3 text-foreground font-medium">{c.name}</td>
                <td className="px-4 py-3 text-primary font-semibold">${c.price_per_night}</td>
                <td className="px-4 py-3 text-foreground hidden md:table-cell">{c.max_guests}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.is_available ? "bg-green-500/20 text-green-400" : "bg-destructive/20 text-destructive"}`}>
                    {c.is_available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleEdit(c)} className="text-muted-foreground hover:text-primary mr-2"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(c.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {cottages.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No cottages yet. Add your first one!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCottages;
