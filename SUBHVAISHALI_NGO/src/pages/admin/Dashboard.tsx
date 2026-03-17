import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Users, HeartHandshake, Calendar, Award } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    totalDonations: 0,
    totalEvents: 0,
    totalCertificates: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { name: "Total Volunteers", value: stats.totalVolunteers, icon: Users, color: "bg-brand-500", shadow: "shadow-brand-100" },
    { name: "Total Donations", value: stats.totalDonations, icon: HeartHandshake, color: "bg-brand-500", shadow: "shadow-brand-100" },
    { name: "Total Events", value: stats.totalEvents, icon: Calendar, color: "bg-brand-500", shadow: "shadow-brand-100" },
    { name: "Certificates Issued", value: stats.totalCertificates, icon: Award, color: "bg-brand-500", shadow: "shadow-brand-100" },
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-100 border-t-brand-600 shadow-2xl"></div>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-[2.5rem] shadow-3xl shadow-brand-900/5 border border-brand-100/50 p-10 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500">
            <div className={`p-6 rounded-2xl ${stat.color} text-white mb-8 shadow-2xl ${stat.shadow} group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon className="w-10 h-10" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{stat.name}</p>
              <p className="text-5xl font-serif font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] shadow-3xl shadow-brand-900/5 border border-brand-100/50 p-12 sm:p-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-500"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-serif font-black text-slate-900 mb-8 tracking-tight leading-tight">Welcome to the Command Center</h2>
          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-3xl italic">
            "From here, you have full control over the Subhvaishali Foundation platform. Use the navigation to manage volunteers, track donations, update website content, and coordinate events."
          </p>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-50 rounded-full blur-3xl opacity-50"></div>
      </div>
    </div>
  );
}
