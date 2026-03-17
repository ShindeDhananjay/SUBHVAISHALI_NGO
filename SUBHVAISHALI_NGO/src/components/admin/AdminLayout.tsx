import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { useContent } from "../../hooks/useContent";
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Activity, 
  Users, 
  HeartHandshake, 
  Award, 
  MessageSquare,
  Settings,
  LogOut
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { content: logoUrl } = useContent("logo_url", "");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Website Content", path: "/admin/content", icon: FileText },
    { name: "Events", path: "/admin/events", icon: Calendar },
    { name: "Activities", path: "/admin/activities", icon: Activity },
    { name: "Volunteers", path: "/admin/volunteers", icon: Users },
    { name: "Donations", path: "/admin/donations", icon: HeartHandshake },
    { name: "Certificates", path: "/admin/certificates", icon: Award },
    { name: "Messages", path: "/admin/messages", icon: MessageSquare },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-slate-900 text-white flex flex-col fixed h-full shadow-2xl z-50">
        <div className="h-24 flex items-center px-8 border-b border-slate-800/50">
          {logoUrl ? (
            <img src={logoUrl} alt="Subhvaishali Foundation" className="h-12 w-auto object-contain mr-3" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-brand-500/20">
              <HeartHandshake className="h-6 w-6 text-white" />
            </div>
          )}
          <span className="text-xl font-serif font-black tracking-tight text-white">Admin Hub</span>
        </div>
        <div className="flex-1 overflow-y-auto py-8 px-4 custom-scrollbar">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" 
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-slate-500 group-hover:text-brand-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-6 border-t border-slate-800/50">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-4 text-sm font-black text-slate-400 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all group"
          >
            <LogOut className="mr-3 h-5 w-5 text-slate-500 group-hover:text-red-500 transition-colors" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72">
        <header className="bg-white/80 backdrop-blur-md h-24 flex items-center px-12 border-b border-slate-100 sticky top-0 z-40">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {navItems.find(item => item.path === location.pathname)?.name || "Admin"}
          </h1>
        </header>
        <main className="p-12 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
