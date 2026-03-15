import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { format } from "date-fns";
import { CheckCircle, XCircle, Award, Edit2, Trash2, X } from "lucide-react";

export default function ManageVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [editingVolunteer, setEditingVolunteer] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const res = await api.get("/volunteers");
      setVolunteers(res.data);
    } catch (error) {
      console.error("Error fetching volunteers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.put(`/volunteers/${id}/status`, { status });
      fetchVolunteers();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const handleGenerateCertificate = async (id: string) => {
    setGeneratingId(id);
    setMessage({ type: "", text: "" });
    try {
      await api.post("/certificates/generate", { volunteerId: id });
      setMessage({ type: "success", text: "Certificate generated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error generating certificate", error);
      setMessage({ type: "error", text: "Failed to generate certificate" });
    } finally {
      setGeneratingId(null);
    }
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/volunteers/${id}`);
      setMessage({ type: "success", text: "Volunteer deleted successfully" });
      setDeleteConfirmId(null);
      fetchVolunteers();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error deleting volunteer", error);
      setMessage({ type: "error", text: "Failed to delete volunteer" });
    }
  };

  const startEditing = (volunteer: any) => {
    setEditingVolunteer(volunteer);
    setEditForm({ ...volunteer, skills: Array.isArray(volunteer.skills) ? volunteer.skills.join(", ") : "" });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...editForm,
        skills: editForm.skills.split(",").map((s: string) => s.trim()).filter((s: string) => s !== "")
      };
      await api.put(`/volunteers/${editingVolunteer._id}`, updatedData);
      setMessage({ type: "success", text: "Volunteer updated successfully" });
      setEditingVolunteer(null);
      fetchVolunteers();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error updating volunteer", error);
      setMessage({ type: "error", text: "Failed to update volunteer" });
    }
  };

  if (loading) return <div>Loading volunteers...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-slate-900">Manage Volunteers</h2>
        {message.text && (
          <span className={`text-sm ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
            {message.text}
          </span>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Skills</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {volunteers.map((volunteer: any) => (
              <tr key={volunteer._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{volunteer.name}</div>
                  <div className="text-xs text-slate-500">Applied: {format(new Date(volunteer.createdAt), "MMM d, yyyy")}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{volunteer.email}</div>
                  <div className="text-sm text-slate-500">{volunteer.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {volunteer.skills.map((skill: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">{skill}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    volunteer.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    volunteer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {volunteer.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    {volunteer.status === 'pending' && (
                      <>
                        <button onClick={() => handleStatusChange(volunteer._id, 'approved')} className="text-emerald-600 hover:text-emerald-900" title="Approve">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleStatusChange(volunteer._id, 'rejected')} className="text-red-600 hover:text-red-900" title="Reject">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {volunteer.status === 'approved' && (
                      <button 
                        onClick={() => handleGenerateCertificate(volunteer._id)} 
                        disabled={generatingId === volunteer._id}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        title="Generate Certificate"
                      >
                        <Award className="w-5 h-5 mr-1" />
                        {generatingId === volunteer._id ? "..." : "Cert"}
                      </button>
                    )}
                    <button onClick={() => startEditing(volunteer)} className="text-slate-400 hover:text-brand-600" title="Edit">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => setDeleteConfirmId(volunteer._id)} className="text-slate-400 hover:text-red-600" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {volunteers.map((volunteer: any) => (
          <div key={volunteer._id} className="border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900">{volunteer.name}</h3>
                <p className="text-[10px] text-slate-500">Applied: {format(new Date(volunteer.createdAt), "MMM d, yyyy")}</p>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                volunteer.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                volunteer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {volunteer.status}
              </span>
            </div>
            <div className="text-sm text-slate-600">
              <p>📧 {volunteer.email}</p>
              <p>📞 {volunteer.phone}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {volunteer.skills.map((skill: string, idx: number) => (
                <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded">{skill}</span>
              ))}
            </div>
            <div className="flex justify-end gap-4 pt-2 border-t border-slate-100">
              {volunteer.status === 'pending' && (
                <>
                  <button onClick={() => handleStatusChange(volunteer._id, 'approved')} className="text-emerald-600 text-sm font-medium">Approve</button>
                  <button onClick={() => handleStatusChange(volunteer._id, 'rejected')} className="text-red-600 text-sm font-medium">Reject</button>
                </>
              )}
              {volunteer.status === 'approved' && (
                <button 
                  onClick={() => handleGenerateCertificate(volunteer._id)} 
                  disabled={generatingId === volunteer._id}
                  className="text-indigo-600 text-sm font-medium flex items-center"
                >
                  <Award className="w-4 h-4 mr-1" />
                  {generatingId === volunteer._id ? "Generating..." : "Cert"}
                </button>
              )}
              <button onClick={() => startEditing(volunteer)} className="text-slate-600 text-sm font-medium">Edit</button>
              <button onClick={() => setDeleteConfirmId(volunteer._id)} className="text-red-600 text-sm font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Deletion</h3>
            <p className="text-slate-500 mb-8">Are you sure you want to delete this volunteer? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)} 
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)} 
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingVolunteer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Edit Volunteer</h3>
              <button onClick={() => setEditingVolunteer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded-lg border-slate-200 focus:border-brand-500 focus:ring-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full rounded-lg border-slate-200 focus:border-brand-500 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full rounded-lg border-slate-200 focus:border-brand-500 focus:ring-brand-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  className="w-full rounded-lg border-slate-200 focus:border-brand-500 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full rounded-lg border-slate-200 focus:border-brand-500 focus:ring-brand-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingVolunteer(null)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
