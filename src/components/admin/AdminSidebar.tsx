import { LayoutDashboard, Home, UtensilsCrossed, CalendarDays, ShoppingCart, Mail, PartyPopper, Users, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Cottages", url: "/admin/cottages", icon: Home },
  { title: "Bookings", url: "/admin/bookings", icon: CalendarDays },
  { title: "Menu Items", url: "/admin/menu", icon: UtensilsCrossed },
  { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
  { title: "Reservations", url: "/admin/reservations", icon: CalendarDays },
  { title: "Messages", url: "/admin/messages", icon: Mail },
  { title: "Events", url: "/admin/events", icon: PartyPopper },
  { title: "Users", url: "/admin/users", icon: Users },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut, user } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-gold">
      <SidebarContent className="bg-card">
        <div className="p-4 border-b border-gold">
          {!collapsed && (
            <h2 className="font-heading text-lg font-bold text-gradient-gold">Dyvan Admin</h2>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground/70 hover:bg-secondary hover:text-foreground transition-colors"
                      activeClassName="bg-primary/10 text-primary font-medium border-l-2 border-primary"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-card border-t border-gold p-3">
        {!collapsed && (
          <p className="text-xs text-muted-foreground truncate mb-2">{user?.email}</p>
        )}
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
