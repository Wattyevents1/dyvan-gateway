import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface GalleryPhoto {
  id: string;
  image_url: string;
  caption: string | null;
  category: string;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
}

const galleryCategories = ["General", "Cottages", "Restaurant", "Bar & Lounge", "Events", "Grounds"];

const AdminGallery = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ image_url: "", caption: "", category: "General" });

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false });
    setPhotos((data as GalleryPhoto[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchPhotos(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) { toast.error("Please upload an image"); return; }
    const { error } = await supabase.from("gallery_photos").insert({
      image_url: form.image_url,
      caption: form.caption || null,
      category: form.category,
    });
    if (error) { toast.error("Failed to add photo"); return; }
    toast.success("Photo added to gallery");
    setForm({ image_url: "", caption: "", category: "General" });
    setShowForm(false);
    fetchPhotos();
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    await supabase.from("gallery_photos").update({ is_visible: !current }).eq("id", id);
    fetchPhotos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    await supabase.from("gallery_photos").delete().eq("id", id);
    toast.success("Photo deleted");
    fetchPhotos();
  };

  const inputClass = "bg-secondary border border-gold rounded-sm px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary w-full";

  if (loading) return <div className="text-muted-foreground animate-pulse">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-3xl font-bold text-gradient-gold">Gallery Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-gradient-gold text-primary-foreground px-4 py-2 text-sm font-semibold rounded-sm hover:opacity-90">
          <Plus size={16} /> Add Photo
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border border-gold mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="gallery" />
          <div className="flex flex-col gap-4">
            <input type="text" placeholder="Caption (optional)" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className={inputClass} />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
              {galleryCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex gap-3">
              <button type="submit" className="bg-gradient-gold text-primary-foreground px-6 py-2 text-sm font-semibold rounded-sm hover:opacity-90">Add</button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-gold text-foreground px-6 py-2 text-sm rounded-sm hover:bg-secondary">Cancel</button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className={`relative group rounded-lg overflow-hidden border border-gold ${!photo.is_visible ? "opacity-50" : ""}`}>
            <img src={photo.image_url} alt={photo.caption || "Gallery"} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button onClick={() => toggleVisibility(photo.id, photo.is_visible)} className="p-2 rounded-full bg-secondary text-foreground hover:text-primary">
                {photo.is_visible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button onClick={() => handleDelete(photo.id)} className="p-2 rounded-full bg-secondary text-foreground hover:text-destructive">
                <Trash2 size={16} />
              </button>
            </div>
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-background/80 px-2 py-1">
                <p className="text-xs text-foreground truncate">{photo.caption}</p>
              </div>
            )}
            <span className="absolute top-1 right-1 text-[10px] bg-secondary/80 text-muted-foreground px-1.5 py-0.5 rounded">{photo.category}</span>
          </div>
        ))}
        {photos.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">No photos yet. Add your first one!</div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
