import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import Cottages from "./pages/Cottages";
import Restaurant from "./pages/Restaurant";
import Bar from "./pages/Bar";
import Booking from "./pages/Booking";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminCottages from "./pages/admin/AdminCottages";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminUsers from "./pages/admin/AdminUsers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/cottages" element={<Cottages />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/bar" element={<Bar />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminOverview />} />
              <Route path="cottages" element={<AdminCottages />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="reservations" element={<AdminReservations />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
            <Route path="/*" element={<PublicLayout />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
