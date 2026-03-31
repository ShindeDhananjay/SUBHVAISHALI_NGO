import { useState, useEffect } from "react";
import { api } from "../services/api";
import { format } from "date-fns";
import { Calendar, MapPin } from "lucide-react";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
      } catch (error) {
        console.error("Error fetching events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bg-white py-32 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight sm:text-7xl mb-8 leading-tight">Upcoming Gatherings</h1>
          <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto italic">Join us at our next event and make a difference.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-100 border-t-brand-600 shadow-2xl"></div>
          </div>
        ) : (
          <div className="space-y-12 max-w-5xl mx-auto">
            {events.length === 0 ? (
              <div className="py-24 text-center bg-brand-50/30 rounded-[3rem] border border-brand-100/50 shadow-3xl shadow-brand-900/5">
                <p className="text-2xl text-slate-400 font-medium italic">No upcoming events at the moment. Check back soon!</p>
              </div>
            ) : (
              events.map((event: any) => (
                <div key={event._id} className="group flex flex-col md:flex-row bg-white rounded-[3rem] overflow-hidden border border-brand-100/50 shadow-3xl shadow-brand-900/5 hover:shadow-brand-500/10 transition-all duration-500 hover:-translate-y-1">
                  {event.imageUrl ? (
                    <div className="md:w-2/5 relative overflow-hidden">
                      <img src={event.imageUrl} alt={event.title} className="w-full h-64 md:h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="md:w-2/5 bg-brand-50 flex items-center justify-center h-64 md:h-auto">
                      <Calendar className="w-16 h-16 text-brand-200" />
                    </div>
                  )}
                  <div className="p-10 md:p-14 md:w-3/5 flex flex-col justify-center relative">
                    <div className="flex flex-wrap items-center gap-6 text-xs font-black text-brand-600 uppercase tracking-[0.2em] mb-6">
                      <span className="flex items-center gap-2 bg-brand-50 px-4 py-2 rounded-xl"><Calendar className="w-4 h-4" /> {format(new Date(event.date), "MMM d, yyyy")}</span>
                      <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-slate-500"><MapPin className="w-4 h-4" /> {event.location}</span>
                    </div>
                    <h3 className="text-3xl font-serif font-black text-slate-900 mb-6 leading-tight group-hover:text-brand-600 transition-colors">{event.title}</h3>
                    <p className="text-slate-500 mb-8 text-lg leading-relaxed font-medium line-clamp-3 italic">"{event.description}"</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className={`inline-flex items-center px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                        event.status === 'upcoming' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        event.status === 'ongoing' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {event.status}
                      </span>
                      <button className="text-brand-600 font-black text-sm uppercase tracking-widest hover:text-brand-700 flex items-center gap-2 group/btn">
                        Learn More
                        <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
