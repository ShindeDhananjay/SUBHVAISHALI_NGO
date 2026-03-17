import React, { useState } from "react";
import { api } from "../../services/api";
import { Save } from "lucide-react";

export default function ManageAdmin() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.put("/admin/credentials", {
        email: email || undefined,
        currentPassword,
        newPassword: newPassword || undefined
      });
      setMessage({ type: "success", text: "Credentials updated successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to update credentials" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900">Admin Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Update your login email and password.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-md mb-6 ${message.type === 'success' ? 'bg-orange-50 text-orange-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">New Email (Optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Leave blank to keep current email"
            className="w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
          />
        </div>

        <div className="pt-4 border-t border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-1">Current Password (Required)</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">New Password (Optional)</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
            className="w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
          />
        </div>

        {newPassword && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
            />
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
