import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { format } from "date-fns";
import { Search, Edit2, Trash2, X } from "lucide-react";

export default function ManageDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDonation, setEditingDonation] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await api.get("/donations");
      setDonations(res.data);
    } catch (error) {
      console.error("Error fetching donations", error);
    } finally {
      setLoading(false);
    }
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/donations/${id}`);
      setMessage({ type: "success", text: "Donation deleted successfully" });
      setDeleteConfirmId(null);
      fetchDonations();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error deleting donation", error);
      setMessage({ type: "error", text: "Failed to delete donation" });
    }
  };

  const startEditing = (donation: any) => {
    setEditingDonation(donation);
    setEditForm({ ...donation });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/donations/${editingDonation._id}`, editForm);
      setMessage({ type: "success", text: "Donation updated successfully" });
      setEditingDonation(null);
      fetchDonations();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error updating donation", error);
      setMessage({ type: "error", text: "Failed to update donation" });
    }
  };

  const filteredDonations = donations.filter((d: any) => 
    d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.paymentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading donations...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900">Donations Log</h2>
          {message.text && (
            <span className={`text-sm ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
              {message.text}
            </span>
          )}
        </div>
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search donations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Donor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payment ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredDonations.map((donation: any) => (
              <tr key={donation._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {format(new Date(donation.createdAt), "MMM d, yyyy HH:mm")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{donation.donorName}</div>
                  <div className="text-sm text-slate-500">{donation.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                  {donation.currency === 'INR' ? '₹' : donation.currency} {donation.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">
                  {donation.paymentId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    donation.status === 'successful' ? 'bg-emerald-100 text-emerald-800' :
                    donation.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {donation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => startEditing(donation)} className="text-slate-400 hover:text-brand-600" title="Edit">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => setDeleteConfirmId(donation._id)} className="text-slate-400 hover:text-red-600" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Deletion</h3>
            <p className="text-slate-500 mb-8">Are you sure you want to delete this donation record? This action cannot be undone.</p>
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
      {editingDonation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Edit Donation</h3>
              <button onClick={() => setEditingDonation(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Donor Name</label>
                <input
                  type="text"
                  required
                  value={editForm.donorName}
                  onChange={(e) => setEditForm({ ...editForm, donorName: e.target.value })}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                  <input
                    type="number"
                    required
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
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
                    <option value="successful">Successful</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingDonation(null)}
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
