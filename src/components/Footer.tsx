import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";
import logo from "@/assets/logo.jpg";

const Footer = () => (
  <footer className="bg-secondary border-t border-gold">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="Dyvan Lounge" className="h-12 w-12 rounded-full object-cover" />
            <h3 className="font-heading text-2xl font-bold text-gradient-gold">Dyvan Lounge</h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Dine. Meet. Memories
          </p>
          <div className="flex gap-4 mt-6">
            <a href="https://www.facebook.com/dyvanlounge1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={20} /></a>
            <a href="https://www.instagram.com/dyvanlounge1/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={20} /></a>
            <a href="https://x.com/DyvanLounge1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-lg font-semibold text-foreground mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {["/about", "/cottages", "/restaurant", "/bar", "/booking", "/contact"].map((path) => (
              <Link key={path} to={path} className="text-muted-foreground text-sm hover:text-primary transition-colors capitalize">
                {path.slice(1).replace("-", " ") || "Home"}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading text-lg font-semibold text-foreground mb-4">Contact Info</h4>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2"><MapPin size={16} className="text-primary mt-0.5 shrink-0" /> Mbale–Moroto Road, Sironko District, Uganda</div>
            <div className="flex items-center gap-2"><Phone size={16} className="text-primary shrink-0" /> +256 704 240 261</div>
            <div className="flex items-center gap-2"><Mail size={16} className="text-primary shrink-0" /> dyvanlounge1@gmail.com</div>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-lg font-semibold text-foreground mb-4">Opening Hours</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p className="text-primary font-medium">Open 24 Hours</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gold mt-12 pt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Dyvan Lounge & Cottages. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
