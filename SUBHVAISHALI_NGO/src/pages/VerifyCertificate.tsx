import React, { useState } from "react";
import { api } from "../services/api";
import { Search, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function VerifyCertificate() {
  const [certificateId, setCertificateId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.get(`/certificates/verify/${certificateId.trim()}`);
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Certificate not found or invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-50/30 py-32 min-h-screen font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight sm:text-7xl mb-8 leading-tight">Verify Certificate</h1>
          <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto italic">Enter the unique certificate ID to verify its authenticity and details.</p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-3xl shadow-brand-900/5 p-12 sm:p-20 border border-brand-100/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-500"></div>
          <form onSubmit={handleVerify} className="mb-12">
            <div className="flex flex-col sm:flex-row gap-6">
              <input
                type="text"
                placeholder="Enter Certificate ID"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                className="flex-1 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-0 py-5 px-8 text-slate-900 font-black transition-all placeholder:text-slate-200 font-mono text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-12 py-5 rounded-2xl bg-brand-600 text-white font-black text-xl hover:bg-brand-700 focus:outline-none focus:ring-8 focus:ring-brand-500/10 disabled:opacity-50 flex items-center justify-center gap-4 transition-all shadow-3xl shadow-brand-500/20 active:scale-[0.98] transform"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : <Search className="w-6 h-6" />}
                Verify
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-12 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-8">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-3xl font-black text-red-900 mb-4 tracking-tight">Verification Failed</h3>
              <p className="text-red-600 font-medium text-lg">{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-brand-50/50 border border-brand-100/50 rounded-[2.5rem] p-12 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-brand-900/5">
                <CheckCircle className="w-10 h-10 text-brand-500" />
              </div>
              <h3 className="text-3xl font-black text-brand-900 mb-4 tracking-tight">Certificate Verified!</h3>
              <p className="text-brand-700 mb-12 font-medium text-lg italic">"This is a valid certificate issued by Subhvaishali Foundation."</p>
              
              <div className="bg-white rounded-[2rem] p-10 w-full max-w-md text-left border border-brand-100 shadow-3xl shadow-brand-900/5">
                <div className="space-y-8">
                  <div>
                    <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Volunteer Name</div>
                    <div className="text-2xl font-black text-slate-900">{result.volunteerName}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Issue Date</div>
                      <div className="font-black text-slate-900">{format(new Date(result.issueDate), "MMM d, yyyy")}</div>
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Status</div>
                      <div className="font-black text-brand-500">Authentic</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Certificate ID</div>
                    <div className="font-mono text-xs text-slate-500 break-all bg-slate-50 p-4 rounded-xl border border-slate-100">{result.certificateId}</div>
                  </div>
                </div>
                
                {result.pdfUrl && (
                  <div className="mt-12 pt-10 border-t border-slate-100 text-center">
                    <a 
                      href={result.pdfUrl} 
                      download={`Certificate_${result.volunteerName}.pdf`} 
                      className="inline-flex items-center gap-3 text-brand-600 font-black text-lg hover:text-brand-700 transition-all group"
                    >
                      Download PDF Copy
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
