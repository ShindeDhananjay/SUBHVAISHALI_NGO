import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Save } from "lucide-react";

export default function ManageContent() {
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get("/content");
        setContent(res.data);
      } catch (error) {
        console.error("Error fetching content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleChange = (key: string, value: string) => {
    setContent((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const updates = Object.keys(content).map((key) => ({ key, value: content[key] }));
      await api.put("/content/multiple", updates);
      setMessage({ type: "success", text: "Content updated successfully" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error updating content", error);
      setMessage({ type: "error", text: "Failed to update content" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading content...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-slate-900">Website Content</h2>
        <div className="flex items-center gap-4">
          {message.text && (
            <span className={`text-sm ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
              {message.text}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Homepage */}
        <div className="border border-slate-100 rounded-xl p-6 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Homepage & Global</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Website Logo URL</label>
              <input
                type="text"
                value={content.logo_url || ""}
                onChange={(e) => handleChange("logo_url", e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hero Title</label>
              <input
                type="text"
                value={content.homepage_hero_title || ""}
                onChange={(e) => handleChange("homepage_hero_title", e.target.value)}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hero Subtitle</label>
              <textarea
                value={content.homepage_hero_subtitle || ""}
                onChange={(e) => handleChange("homepage_hero_subtitle", e.target.value)}
                rows={3}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hero Image URL</label>
              <input
                type="text"
                value={content.homepage_hero_image || ""}
                onChange={(e) => handleChange("homepage_hero_image", e.target.value)}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
              />
            </div>
          </div>
        </div>

        {/* About Page */}
        <div className="border border-slate-100 rounded-xl p-6 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">About Page</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mission</label>
              <textarea
                value={content.about_mission || ""}
                onChange={(e) => handleChange("about_mission", e.target.value)}
                rows={3}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vision</label>
              <textarea
                value={content.about_vision || ""}
                onChange={(e) => handleChange("about_vision", e.target.value)}
                rows={3}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">History</label>
              <textarea
                value={content.about_history || ""}
                onChange={(e) => handleChange("about_history", e.target.value)}
                rows={4}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
              />
            </div>
          </div>
        </div>

        {/* Impact & Donate */}
        <div className="border border-slate-100 rounded-xl p-6 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Other Pages</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Impact Text</label>
              <textarea
                value={content.impact_text || ""}
                onChange={(e) => handleChange("impact_text", e.target.value)}
                rows={3}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Donation Description</label>
              <textarea
                value={content.donation_description || ""}
                onChange={(e) => handleChange("donation_description", e.target.value)}
                rows={3}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">UPI ID (for Donations)</label>
                <input
                  type="text"
                  value={content.upi_id || ""}
                  onChange={(e) => handleChange("upi_id", e.target.value)}
                  placeholder="mayursubhashthoke888-1@oksbi"
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">UPI Payee Name</label>
                <input
                  type="text"
                  value={content.upi_name || ""}
                  onChange={(e) => handleChange("upi_name", e.target.value)}
                  placeholder="Mayur Thoke"
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
