import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { format } from "date-fns";
import { CheckCircle } from "lucide-react";

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get("/contact");
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/contact/${id}/read`);
      fetchMessages();
    } catch (error) {
      console.error("Error marking as read", error);
    }
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-slate-900">Contact Messages</h2>
      </div>

      <div className="space-y-6">
        {messages.map((msg: any) => (
          <div key={msg._id} className={`border rounded-xl p-6 ${msg.isRead ? 'bg-white border-slate-200' : 'bg-slate-50 border-emerald-200'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{msg.subject}</h3>
                <div className="text-sm text-slate-500 mt-1">
                  From: <span className="font-medium text-slate-700">{msg.name}</span> ({msg.email})
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-slate-400">{format(new Date(msg.createdAt), "MMM d, yyyy HH:mm")}</span>
                {!msg.isRead && (
                  <button 
                    onClick={() => handleMarkAsRead(msg._id)}
                    className="flex items-center text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" /> Mark as Read
                  </button>
                )}
              </div>
            </div>
            <div className="text-slate-700 whitespace-pre-wrap bg-white p-4 rounded-lg border border-slate-100">
              {msg.message}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No messages received yet.
          </div>
        )}
      </div>
    </div>
  );
}
