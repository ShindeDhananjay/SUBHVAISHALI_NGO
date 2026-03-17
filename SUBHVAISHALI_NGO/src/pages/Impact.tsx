import { useContent } from "../hooks/useContent";

export default function Impact() {
  const { content: impactText } = useContent("impact_text", "Over the last decade, we have reached over 10,000 individuals across 15 countries, providing essential services, education, and hope.");

  return (
    <div className="bg-brand-50/30 py-32 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight sm:text-7xl mb-8 leading-tight">Our Global Impact</h1>
          <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto italic">Measuring the change we bring to the world, one life at a time.</p>
        </div>

        <div className="bg-white rounded-[3rem] p-16 sm:p-24 shadow-3xl shadow-brand-900/5 border border-brand-100/50 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-500"></div>
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-brand-50 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-brand-50 rounded-full blur-3xl opacity-50"></div>
          
          <p className="text-3xl sm:text-4xl text-slate-700 leading-relaxed font-serif font-medium italic relative z-10">
            "{impactText}"
          </p>
          
          <div className="mt-16 flex justify-center gap-8 relative z-10">
            <div className="w-12 h-1 bg-brand-200 rounded-full"></div>
            <div className="w-12 h-1 bg-brand-500 rounded-full"></div>
            <div className="w-12 h-1 bg-brand-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
