import { useState, useEffect } from "react";
import { api } from "../services/api";
import { format } from "date-fns";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.get("/activities");
        setActivities(res.data);
      } catch (error) {
        console.error("Error fetching activities", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="bg-brand-50/30 py-32 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight sm:text-7xl mb-8 leading-tight">Our Impact in Action</h1>
          <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto italic">A glimpse into the lives we touch and the change we create together.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-100 border-t-brand-600 shadow-2xl"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {activities.length === 0 ? (
              <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-brand-100 shadow-3xl shadow-brand-900/5">
                <p className="text-2xl text-slate-400 font-medium italic">No activities recorded yet. Stay tuned!</p>
              </div>
            ) : (
              activities.map((activity: any) => (
                <div key={activity._id} className="group bg-white rounded-[2.5rem] shadow-3xl shadow-brand-900/5 overflow-hidden border border-brand-100/50 hover:shadow-brand-500/10 transition-all duration-500 hover:-translate-y-2">
                  <div className="relative h-64 overflow-hidden">
                    {activity.imageUrl ? (
                      <img src={activity.imageUrl} alt={activity.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-brand-50 flex items-center justify-center">
                        <span className="text-brand-200 font-black text-4xl">SVF</span>
                      </div>
                    )}
                    <div className="absolute top-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-xs font-black text-brand-600 uppercase tracking-widest shadow-xl">
                      {format(new Date(activity.date), "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className="p-10">
                    <h3 className="text-2xl font-serif font-black text-slate-900 mb-4 leading-tight group-hover:text-brand-600 transition-colors">{activity.title}</h3>
                    <p className="text-slate-500 line-clamp-3 text-lg leading-relaxed font-medium">{activity.description}</p>
                    <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Activity Log</span>
                      <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center group-hover:bg-brand-500 transition-colors">
                        <svg className="w-4 h-4 text-brand-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                      </div>
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
