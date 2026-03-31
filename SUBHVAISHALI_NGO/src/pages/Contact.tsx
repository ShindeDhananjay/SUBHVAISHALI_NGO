import React, { useState } from "react";
import { api } from "../services/api";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await api.post("/contact", formData);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="bg-white py-32 min-h-screen font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight sm:text-7xl mb-8 leading-tight">Get in Touch</h1>
          <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto italic">Have questions? We'd love to hear from you.</p>
        </div>

        <div className="bg-brand-50/30 rounded-[3rem] p-12 sm:p-20 border border-brand-100/50 shadow-3xl shadow-brand-900/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-500"></div>
          {status === "success" ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-brand-900/5">
                <svg className="w-12 h-12 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-4xl font-serif font-black text-brand-700 mb-6 tracking-tight">Message Sent!</h2>
              <p className="text-slate-500 mb-12 text-xl font-medium leading-relaxed italic">"Thank you for reaching out. We will get back to you shortly."</p>
              <button onClick={() => setStatus("idle")} className="text-brand-600 font-black text-lg hover:text-brand-700 underline underline-offset-8 decoration-2">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              {status === "error" && <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-base font-bold border border-red-100">Failed to send message. Please try again.</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full rounded-2xl border-2 border-slate-100 bg-white/50 focus:bg-white focus:border-brand-500 focus:ring-0 py-5 px-8 text-slate-900 font-bold text-lg transition-all placeholder:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full rounded-2xl border-2 border-slate-100 bg-white/50 focus:bg-white focus:border-brand-500 focus:ring-0 py-5 px-8 text-slate-900 font-bold text-lg transition-all placeholder:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="How can we help?"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-white/50 focus:bg-white focus:border-brand-500 focus:ring-0 py-5 px-8 text-slate-900 font-bold text-lg transition-all placeholder:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your message here..."
                  className="w-full rounded-2xl border-2 border-slate-100 bg-white/50 focus:bg-white focus:border-brand-500 focus:ring-0 py-5 px-8 text-slate-900 font-bold text-lg transition-all placeholder:text-slate-200"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-7 px-10 rounded-2xl bg-brand-600 text-white font-black text-2xl hover:bg-brand-700 focus:outline-none focus:ring-8 focus:ring-brand-500/10 disabled:opacity-50 transition-all shadow-3xl shadow-brand-500/20 active:scale-[0.98] transform mt-8"
              >
                {status === "submitting" ? (
                  <span className="flex items-center justify-center gap-4">
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </span>
                ) : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
