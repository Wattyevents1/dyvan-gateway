import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles"> & { roles?: string[] };

const AdminUsers = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    const { data: roles } = await supabase.from("user_roles").select("*");

    const enriched = (profiles || []).map((p) => ({
      ...p,
      roles: (roles || []).filter((r) => r.user_id === p.user_id).map((r) => r.role),
    }));
    setUsers(enriched);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (userId: string, role: "admin" | "staff", hasRole: boolean) => {
    if (hasRole) {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      toast.success(`Removed ${role} role`);
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role });
      toast.success(`Added ${role} role`);
    }
    fetchUsers();
  };

  if (loading) return <div className="text-muted-foreground animate-pulse">Loading...</div>;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-gradient-gold mb-6">User Management</h1>
      <div className="bg-card rounded-lg border border-gold overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Name</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Phone</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Roles</th>
              <th className="text-right px-4 py-3 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-border hover:bg-secondary/50">
                <td className="px-4 py-3 text-foreground font-medium">{u.full_name || "No name"}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.phone || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {(u.roles || []).map((r) => (
                      <span key={r} className="px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary capitalize">{r}</span>
                    ))}
                    {(u.roles || []).length === 0 && <span className="text-muted-foreground text-xs">No roles</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-right space-x-1">
                  <button
                    onClick={() => toggleRole(u.user_id, "admin", (u.roles || []).includes("admin"))}
                    className={`text-xs px-2 py-1 rounded ${(u.roles || []).includes("admin") ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"}`}
                  >
                    {(u.roles || []).includes("admin") ? "Remove Admin" : "Make Admin"}
                  </button>
                  <button
                    onClick={() => toggleRole(u.user_id, "staff", (u.roles || []).includes("staff"))}
                    className={`text-xs px-2 py-1 rounded ${(u.roles || []).includes("staff") ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"}`}
                  >
                    {(u.roles || []).includes("staff") ? "Remove Staff" : "Make Staff"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No users yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
