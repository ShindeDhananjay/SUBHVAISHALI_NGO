import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { format } from "date-fns";
import { Download, Edit2, Trash2, X } from "lucide-react";

export default function ManageCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCert, setEditingCert] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.get("/certificates");
      setCertificates(res.data);
    } catch (error) {
      console.error("Error fetching certificates", error);
    } finally {
      setLoading(false);
    }
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/certificates/${id}`);
      setMessage({ type: "success", text: "Certificate deleted successfully" });
      setDeleteConfirmId(null);
      fetchCertificates();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error deleting certificate", error);
      setMessage({ type: "error", text: "Failed to delete certificate" });
    }
  };

  const startEditing = (cert: any) => {
    setEditingCert(cert);
    setEditForm({ ...cert });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/certificates/${editingCert._id}`, editForm);
      setMessage({ type: "success", text: "Certificate updated successfully" });
      setEditingCert(null);
      fetchCertificates();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error updating certificate", error);
      setMessage({ type: "error", text: "Failed to update certificate" });
    }
  };

  if (loading) return <div>Loading certificates...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900">Issued Certificates</h2>
          {message.text && (
            <span className={`text-sm ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
              {message.text}
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Issue Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Volunteer Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Certificate ID</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {certificates.map((cert: any) => (
              <tr key={cert._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {format(new Date(cert.issueDate), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {cert.volunteerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">
                  {cert.certificateId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <a 
                      href={cert.pdfUrl} 
                      download={`Certificate_${cert.volunteerName}.pdf`}
                      className="text-emerald-600 hover:text-emerald-900"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                    <button onClick={() => startEditing(cert)} className="text-slate-400 hover:text-brand-600" title="Edit">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => setDeleteConfirmId(cert._id)} className="text-slate-400 hover:text-red-600" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {certificates.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No certificates issued yet.
                </td>
              </tr>
            )}
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
            <p className="text-slate-500 mb-8">Are you sure you want to delete this certificate record? This action cannot be undone.</p>
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
      {editingCert && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Edit Certificate</h3>
              <button onClick={() => setEditingCert(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Volunteer Name</label>
                <input
                  type="text"
                  required
                  value={editForm.volunteerName}
                  onChange={(e) => setEditForm({ ...editForm, volunteerName: e.target.value })}
                  className="w-full rounded-lg border-slate-200 focus:border-brand-500 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Certificate ID</label>
                <input
                  type="text"
                  required
                  value={editForm.certificateId}
                  onChange={(e) => setEditForm({ ...editForm, certificateId: e.target.value })}
                  className="w-full rounded-lg border-slate-200 focus:border-brand-500 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Issue Date</label>
                <input
                  type="date"
                  required
                  value={new Date(editForm.issueDate).toISOString().split('T')[0]}
                  onChange={(e) => setEditForm({ ...editForm, issueDate: e.target.value })}
                  className="w-full rounded-lg border-slate-200 focus:border-brand-500 focus:ring-brand-500"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
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
