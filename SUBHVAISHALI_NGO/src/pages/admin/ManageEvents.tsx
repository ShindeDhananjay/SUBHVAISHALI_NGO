import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Plus, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({ title: "", description: "", date: "", location: "", imageUrl: "", status: "upcoming" });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (event: any = null) => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().split('T')[0],
        location: event.location,
        imageUrl: event.imageUrl || "",
        status: event.status
      });
      setEditingId(event._id);
    } else {
      setFormData({ title: "", description: "", date: "", location: "", imageUrl: "", status: "upcoming" });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (editingId) {
        await api.put(`/events/${editingId}`, formData);
      } else {
        await api.post("/events", formData);
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      console.error("Error saving event", error);
      setErrorMsg("Failed to save event");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/events/${id}`);
      setDeleteConfirmId(null);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };

  if (loading) return <div>Loading events...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-slate-900">Manage Events</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </button>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {events.map((event: any) => (
              <tr key={event._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{event.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{format(new Date(event.date), "MMM d, yyyy")}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{event.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    event.status === 'ongoing' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(event)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteConfirmId(event._id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {events.map((event: any) => (
          <div key={event._id} className="border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-slate-900">{event.title}</h3>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                event.status === 'ongoing' ? 'bg-emerald-100 text-emerald-800' :
                'bg-slate-100 text-slate-800'
              }`}>
                {event.status}
              </span>
            </div>
            <div className="text-sm text-slate-600">
              <p>📅 {format(new Date(event.date), "MMM d, yyyy")}</p>
              <p>📍 {event.location}</p>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button onClick={() => handleOpenModal(event)} className="text-indigo-600 text-sm font-medium">Edit</button>
              <button onClick={() => setDeleteConfirmId(event._id)} className="text-red-600 text-sm font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{editingId ? "Edit Event" : "Add Event"}</h3>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border bg-white">
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
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
            <p className="text-slate-600 mb-6">Are you sure you want to delete this event? This action cannot be undone.</p>
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
