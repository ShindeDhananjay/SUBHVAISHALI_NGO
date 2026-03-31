import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Plus, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

export default function ManageActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({ title: "", description: "", date: "", imageUrl: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await api.get("/activities");
      setActivities(res.data);
    } catch (error) {
      console.error("Error fetching activities", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (activity: any = null) => {
    if (activity) {
      setFormData({
        title: activity.title,
        description: activity.description,
        date: new Date(activity.date).toISOString().split('T')[0],
        imageUrl: activity.imageUrl || ""
      });
      setEditingId(activity._id);
    } else {
      setFormData({ title: "", description: "", date: "", imageUrl: "" });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (editingId) {
        await api.put(`/activities/${editingId}`, formData);
      } else {
        await api.post("/activities", formData);
      }
      setIsModalOpen(false);
      fetchActivities();
    } catch (error) {
      console.error("Error saving activity", error);
      setErrorMsg("Failed to save activity");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/activities/${id}`);
      setDeleteConfirmId(null);
      fetchActivities();
    } catch (error) {
      console.error("Error deleting activity", error);
    }
  };

  if (loading) return <div>Loading activities...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-slate-900">Manage Activities</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity: any) => (
          <div key={activity._id} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {activity.imageUrl && (
              <img src={activity.imageUrl} alt={activity.title} className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
            )}
            <div className="p-4">
              <div className="text-xs font-medium text-emerald-600 mb-1">{format(new Date(activity.date), "MMM d, yyyy")}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{activity.title}</h3>
              <p className="text-slate-600 text-sm line-clamp-2 mb-4">{activity.description}</p>
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 mt-auto">
                <button onClick={() => handleOpenModal(activity)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteConfirmId(activity._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{editingId ? "Edit Activity" : "Add Activity"}</h3>
            {errorMsg && <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">{errorMsg}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[70]">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Deletion</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to delete this activity? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
