import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard = () => {
  const { user, signOut, isAdmin, isStaff } = useAuth();

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-gradient-gold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome, {user?.email} ({isAdmin ? "Admin" : "Staff"})
            </p>
          </div>
          <button
            onClick={signOut}
            className="bg-secondary border border-gold px-6 py-2 text-sm font-medium text-foreground rounded-sm hover:bg-destructive/20 hover:border-destructive transition-colors"
          >
            Sign Out
          </button>
        </div>
        <div className="bg-card p-8 rounded-lg border border-gold text-center">
          <p className="text-muted-foreground">Dashboard features coming in Step 3!</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
