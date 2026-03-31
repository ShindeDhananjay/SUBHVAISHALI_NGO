import { useContent } from "../hooks/useContent";

export default function About() {
  const { content: aboutMission } = useContent("about_mission", "Our mission is to alleviate poverty and empower marginalized communities through sustainable development programs.");
  const { content: aboutVision } = useContent("about_vision", "A world where every individual has the opportunity to thrive, regardless of their background or circumstances.");
  const { content: aboutHistory } = useContent("about_history", "Founded in 2010, Subhvaishali Foundation started as a small group of volunteers dedicated to providing after-school tutoring. Today, we operate in 15 countries, impacting over 10,000 lives annually.");

  return (
    <div className="bg-white py-32 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight sm:text-7xl mb-8 leading-tight">Our Story</h1>
          <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto italic">Learn about our journey, our mission, and the people behind the change.</p>
        </div>

        <div className="space-y-24">
          <section className="relative group">
            <div className="absolute -left-8 top-0 bottom-0 w-1 bg-brand-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h2 className="text-xs font-black text-brand-600 uppercase tracking-[0.3em] mb-6 ml-1">Our Mission</h2>
            <p className="text-2xl text-slate-700 leading-relaxed font-medium font-serif">{aboutMission}</p>
          </section>

          <section className="relative group">
            <div className="absolute -left-8 top-0 bottom-0 w-1 bg-brand-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h2 className="text-xs font-black text-brand-600 uppercase tracking-[0.3em] mb-6 ml-1">Our Vision</h2>
            <p className="text-2xl text-slate-700 leading-relaxed font-medium font-serif">{aboutVision}</p>
          </section>

          <section className="relative group">
            <div className="absolute -left-8 top-0 bottom-0 w-1 bg-brand-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h2 className="text-xs font-black text-brand-600 uppercase tracking-[0.3em] mb-6 ml-1">Our History</h2>
            <p className="text-2xl text-slate-700 leading-relaxed font-medium font-serif">{aboutHistory}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
