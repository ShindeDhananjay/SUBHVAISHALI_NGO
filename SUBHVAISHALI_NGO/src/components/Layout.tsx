import { Outlet, Link, useLocation } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useContent } from "../hooks/useContent";

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { content: logoUrl } = useContent("logo_url", "");
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/#home" },
    { name: "About", path: "/#about" },
    { name: "Activities", path: "/#activities" },
    { name: "Events", path: "/#events" },
    { name: "Impact", path: "/#impact" },
    { name: "Volunteer", path: "/volunteer" },
    { name: "Contact", path: "/#contact" },
    { name: "Verify", path: "/verify-certificate" },
  ];

  const handleLinkClick = (path: string) => {
    setIsMenuOpen(false);
    if (path.startsWith("/#") && location.pathname === "/") {
      const id = path.substring(2);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-brand-50/30">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-brand-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              {logoUrl ? (
                <img src={logoUrl} alt="Subhvaishali Foundation" className="h-16 w-auto object-contain transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center group-hover:bg-brand-600 transition-all shadow-brand-100 shadow-xl rotate-3 group-hover:rotate-0">
                  <Heart className="h-7 w-7 text-white" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-black tracking-tight text-brand-900 leading-none">Subhvaishali</span>
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 mt-1">Foundation</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className="text-sm font-bold text-slate-600 hover:text-brand-600 transition-all relative py-2 group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-500 transition-all group-hover:w-full"></span>
                </Link>
              ))}
              <div className="flex items-center gap-3 ml-2">
                <Link
                  to="/admin/login"
                  className="px-5 py-2.5 text-sm font-bold text-brand-700 border-2 border-brand-100 rounded-xl hover:bg-brand-50 transition-all"
                >
                  Admin Portal
                </Link>
                <Link
                  to="/donate"
                  className="px-6 py-2.5 bg-brand-500 text-white text-sm font-black rounded-xl hover:bg-brand-600 transition-all shadow-lg shadow-brand-200 active:scale-95"
                >
                  Donate Now
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top duration-300">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-3 text-base font-semibold text-slate-600 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors"
                  onClick={() => handleLinkClick(link.path)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
                <Link
                  to="/admin/login"
                  className="block w-full text-center px-3 py-4 text-base font-bold text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Login
                </Link>
                <Link
                  to="/donate"
                  className="block w-full text-center px-3 py-4 text-base font-bold text-white bg-orange-500 rounded-xl shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Donate Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-brand-900 text-brand-100 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-4 mb-8">
              {logoUrl ? (
                <img src={logoUrl} alt="Subhvaishali Foundation" className="h-16 w-auto object-contain" referrerPolicy="no-referrer" />
              ) : (
                <Heart className="h-8 w-8 text-brand-400" />
              )}
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-black tracking-tight text-white leading-none">Subhvaishali</span>
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-brand-400 mt-1">Foundation</span>
              </div>
            </Link>
            <p className="text-brand-200/70 leading-relaxed max-w-md font-medium">
              Empowering communities and creating sustainable change through education, healthcare, and environmental initiatives. Join us in our journey towards a better tomorrow.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8">Quick Links</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/#about" onClick={() => handleLinkClick("/#about")} className="text-brand-200/60 hover:text-brand-400 transition-colors">About Us</Link></li>
              <li><Link to="/#activities" onClick={() => handleLinkClick("/#activities")} className="text-brand-200/60 hover:text-brand-400 transition-colors">Our Work</Link></li>
              <li><Link to="/volunteer" className="text-brand-200/60 hover:text-brand-400 transition-colors">Volunteer</Link></li>
              <li><Link to="/#contact" onClick={() => handleLinkClick("/#contact")} className="text-brand-200/60 hover:text-brand-400 transition-colors">Contact</Link></li>
              <li><Link to="/admin/login" className="text-brand-200/30 hover:text-brand-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8">Connect</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="https://www.instagram.com/subhvaishalifoundation?igsh=MmlnaXpiZ3JpejAx" target="_blank" rel="noopener noreferrer" className="text-brand-200/60 hover:text-brand-400 transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-8 border-t border-white/5 text-xs font-bold text-brand-200/40 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Subhvaishali Foundation. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-6">
            <a href="#" className="hover:text-brand-200 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-200 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
