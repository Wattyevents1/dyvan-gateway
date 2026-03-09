import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Tables } from "@/integrations/supabase/types";

type Event = Tables<"events">;

interface WeeklyEvent {
  id: string;
  day: string;
  title: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [weeklyEvents, setWeeklyEvents] = useState<WeeklyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", event_date: "", event_time: "", poster_url: "", is_active: true });

  // Weekly event state
  const [editingWeekly, setEditingWeekly] = useState<WeeklyEvent | null>(null);
  const [showWeeklyForm, setShowWeeklyForm] = useState(false);
  const [weeklyForm, setWeeklyForm] = useState({ day: "", title: "", description: "", is_active: true, sort_order: 0 });

  const fetchEvents = async () => {
    const [evRes, wRes] = await Promise.all([
      supabase.from("events").select("*").order("event_date", { ascending: false }),
      supabase.from("weekly_events" as any).select("*").order("sort_order"),
    ]);
    setEvents(evRes.data || []);
    setWeeklyEvents((wRes.data as unknown as WeeklyEvent[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", event_date: "", event_time: "", poster_url: "", is_active: true });
    setEditing(null);
    setShowForm(false);
  };

  const resetWeeklyForm = () => {
    setWeeklyForm({ day: "", title: "", description: "", is_active: true, sort_order: 0 });
    setEditingWeekly(null);
    setShowWeeklyForm(false);
  };

  const handleEdit = (e: Event) => {
    setForm({ title: e.title, description: e.description || "", event_date: e.event_date, event_time: e.event_time || "", poster_url: e.poster_url || "", is_active: e.is_active });
    setEditing(e);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title: form.title, description: form.description || null, event_date: form.event_date, event_time: form.event_time || null, poster_url: form.poster_url || null, is_active: form.is_active };
    if (editing) {
      const { error } = await supabase.from("events").update(payload).eq("id", editing.id);
      if (error) { toast.error("Failed to update"); return; }
      toast.success("Event updated");
    } else {
      const { error } = await supabase.from("events").insert(payload);
      if (error) { toast.error("Failed to create"); return; }
      toast.success("Event created");
    }
    resetForm();
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await supabase.from("events").delete().eq("id", id);
    toast.success("Deleted");
    fetchEvents();
  };

  // Weekly event handlers
  const handleEditWeekly = (w: WeeklyEvent) => {
    setWeeklyForm({ day: w.day, title: w.title, description: w.description || "", is_active: w.is_active, sort_order: w.sort_order });
    setEditingWeekly(w);
    setShowWeeklyForm(true);
  };

  const handleWeeklySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { day: weeklyForm.day, title: weeklyForm.title, description: weeklyForm.description || null, is_active: weeklyForm.is_active, sort_order: weeklyForm.sort_order };
    if (editingWeekly) {
      const { error } = await (supabase.from("weekly_events" as any) as any).update(payload).eq("id", editingWeekly.id);
      if (error) { toast.error("Failed to update"); return; }
      toast.success("Weekly event updated");
    } else {
      const { error } = await (supabase.from("weekly_events" as any) as any).insert(payload);
      if (error) { toast.error("Failed to create"); return; }
      toast.success("Weekly event created");
    }
    resetWeeklyForm();
    fetchEvents();
  };

  const handleDeleteWeekly = async (id: string) => {
    if (!confirm("Delete this weekly event?")) return;
    await (supabase.from("weekly_events" as any) as any).delete().eq("id", id);
    toast.success("Deleted");
    fetchEvents();
  };

  const inputClass = "bg-secondary border border-gold rounded-sm px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary w-full";

  if (loading) return <div className="text-muted-foreground animate-pulse">Loading...</div>;

  return (
    <div>
      {/* Weekly Events Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-3xl font-bold text-gradient-gold">Weekly Lineup</h1>
        <button onClick={() => { resetWeeklyForm(); setShowWeeklyForm(!showWeeklyForm); }} className="flex items-center gap-2 bg-gradient-gold text-primary-foreground px-4 py-2 text-sm font-semibold rounded-sm hover:opacity-90">
          <Plus size={16} /> Add Weekly Event
        </button>
      </div>

      {showWeeklyForm && (
        <form onSubmit={handleWeeklySubmit} className="bg-card p-6 rounded-lg border border-gold mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Day (e.g. Every Wednesday)" required value={weeklyForm.day} onChange={(e) => setWeeklyForm({ ...weeklyForm, day: e.target.value })} className={inputClass} />
          <input type="text" placeholder="Title" required value={weeklyForm.title} onChange={(e) => setWeeklyForm({ ...weeklyForm, title: e.target.value })} className={inputClass} />
          <input type="number" placeholder="Sort Order" value={weeklyForm.sort_order} onChange={(e) => setWeeklyForm({ ...weeklyForm, sort_order: parseInt(e.target.value) || 0 })} className={inputClass} />
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={weeklyForm.is_active} onChange={(e) => setWeeklyForm({ ...weeklyForm, is_active: e.target.checked })} className="accent-primary" />
            Active
          </label>
          <textarea placeholder="Description" value={weeklyForm.description} onChange={(e) => setWeeklyForm({ ...weeklyForm, description: e.target.value })} className={inputClass + " md:col-span-2 resize-none"} rows={2} />
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="bg-gradient-gold text-primary-foreground px-6 py-2 text-sm font-semibold rounded-sm hover:opacity-90">{editingWeekly ? "Update" : "Create"}</button>
            <button type="button" onClick={resetWeeklyForm} className="border border-gold text-foreground px-6 py-2 text-sm rounded-sm hover:bg-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {weeklyEvents.map((w) => (
          <div key={w.id} className="bg-card p-6 rounded-lg border border-gold">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-heading text-lg font-semibold text-foreground">{w.title}</h3>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${w.is_active ? "bg-green-500/20 text-green-400" : "bg-destructive/20 text-destructive"}`}>
                {w.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-primary text-sm">{w.day}</p>
            {w.description && <p className="text-foreground/70 text-sm mt-2 line-clamp-2">{w.description}</p>}
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleEditWeekly(w)} className="text-muted-foreground hover:text-primary"><Pencil size={16} /></button>
              <button onClick={() => handleDeleteWeekly(w.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {weeklyEvents.length === 0 && (
          <div className="md:col-span-3 bg-card p-8 rounded-lg border border-gold text-center text-muted-foreground">No weekly events yet</div>
        )}
      </div>

      {/* Upcoming Events Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-3xl font-bold text-gradient-gold">Upcoming Events</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="flex items-center gap-2 bg-gradient-gold text-primary-foreground px-4 py-2 text-sm font-semibold rounded-sm hover:opacity-90">
          <Plus size={16} /> Add Event
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border border-gold mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Event Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
          <input type="date" required value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className={inputClass} />
          <input type="text" placeholder="Event Time (e.g. 7 PM – 11 PM)" value={form.event_time} onChange={(e) => setForm({ ...form, event_time: e.target.value })} className={inputClass} />
          <ImageUpload value={form.poster_url} onChange={(url) => setForm({ ...form, poster_url: url })} folder="events" />
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-primary" />
            Active
          </label>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass + " md:col-span-2 resize-none"} rows={2} />
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="bg-gradient-gold text-primary-foreground px-6 py-2 text-sm font-semibold rounded-sm hover:opacity-90">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={resetForm} className="border border-gold text-foreground px-6 py-2 text-sm rounded-sm hover:bg-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((ev) => (
          <div key={ev.id} className="bg-card p-6 rounded-lg border border-gold">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-heading text-lg font-semibold text-foreground">{ev.title}</h3>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${ev.is_active ? "bg-green-500/20 text-green-400" : "bg-destructive/20 text-destructive"}`}>
                {ev.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">{ev.event_date} {ev.event_time && `• ${ev.event_time}`}</p>
            {ev.description && <p className="text-foreground/70 text-sm mt-2 line-clamp-2">{ev.description}</p>}
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleEdit(ev)} className="text-muted-foreground hover:text-primary"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(ev.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="md:col-span-3 bg-card p-8 rounded-lg border border-gold text-center text-muted-foreground">No upcoming events yet</div>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;
