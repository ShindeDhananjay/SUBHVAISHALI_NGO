import React, { useState } from "react";
import { api } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import { useContent } from "../../hooks/useContent";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { content: logoUrl } = useContent("logo_url", "");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/admin/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify(res.data.admin));
      navigate("/admin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <Link to="/" className="absolute top-8 left-8 flex items-center text-slate-400 hover:text-brand-600 transition-all font-bold group">
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="flex justify-center mb-10">
          {logoUrl ? (
            <img src={logoUrl} alt="Subhvaishali Foundation" className="h-24 w-auto object-contain" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-20 h-20 bg-brand-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-brand-500/20">
              <Heart className="h-10 w-10 text-white" />
            </div>
          )}
        </div>
        <h2 className="text-center text-5xl font-serif font-black text-slate-900 tracking-tight">Admin Portal</h2>
        <p className="mt-4 text-center text-slate-500 font-medium text-lg italic">
          Sign in to manage the Subhvaishali Foundation platform
        </p>
      </div>

      <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-14 px-10 shadow-3xl shadow-brand-900/5 rounded-[3rem] sm:px-14 border border-brand-100/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-500"></div>
          <form className="space-y-10" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-800 p-5 rounded-2xl text-base font-bold border border-red-100 text-center">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@foundation.org"
                  className="appearance-none block w-full px-8 py-5 border-2 border-slate-100 rounded-2xl bg-slate-50 placeholder-slate-200 focus:outline-none focus:bg-white focus:ring-0 focus:border-brand-500 text-slate-900 font-bold text-lg transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="appearance-none block w-full px-8 py-5 border-2 border-slate-100 rounded-2xl bg-slate-50 placeholder-slate-200 focus:outline-none focus:bg-white focus:ring-0 focus:border-brand-500 text-slate-900 font-bold text-lg transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-6 px-10 border border-transparent rounded-2xl shadow-3xl shadow-brand-500/20 text-xl font-black text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-8 focus:ring-brand-500/10 disabled:opacity-50 transition-all active:scale-[0.98] transform"
              >
                {loading ? (
                  <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
