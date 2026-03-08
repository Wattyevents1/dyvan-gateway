import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Message = Tables<"contact_messages">;

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id: string) => {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    toast.success("Message deleted");
    fetchMessages();
  };

  if (loading) return <div className="text-muted-foreground animate-pulse">Loading...</div>;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-gradient-gold mb-6">Contact Messages</h1>
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`bg-card p-6 rounded-lg border ${m.is_read ? "border-border" : "border-primary"}`} onClick={() => !m.is_read && markRead(m.id)}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground">{m.name}</h3>
                  {!m.is_read && <span className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <p className="text-xs text-muted-foreground">{m.email} {m.phone && `• ${m.phone}`}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
              </div>
            </div>
            <p className="text-foreground/80 text-sm mt-3 leading-relaxed">{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="bg-card p-8 rounded-lg border border-gold text-center text-muted-foreground">No messages yet</div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
