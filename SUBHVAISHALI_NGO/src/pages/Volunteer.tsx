import { useState } from "react";
import { api } from "../services/api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().optional(),
  skills: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function Volunteer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError("");
    try {
      // Convert skills string to array
      const skillsArray = data.skills ? data.skills.split(",").map(s => s.trim()) : [];
      await api.post("/volunteers", { ...data, skills: skillsArray });
      setSuccess(true);
      reset();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-50/30 py-32 min-h-screen font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight sm:text-7xl mb-8 leading-tight">Join Our Mission</h1>
          <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto italic">Become a volunteer and help us create a lasting impact in communities around the world.</p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-3xl shadow-brand-900/5 p-12 sm:p-20 border border-brand-100/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-500"></div>
          {success ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-10 border border-brand-100 shadow-xl shadow-brand-900/5">
                <svg className="w-12 h-12 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-4xl font-serif font-black text-slate-900 mb-6 tracking-tight">Application Received!</h2>
              <p className="text-slate-500 mb-12 text-xl font-medium leading-relaxed">Thank you for your interest in volunteering. Our team will review your application and reach out to you shortly.</p>
              <button onClick={() => setSuccess(false)} className="px-12 py-5 bg-brand-500 text-white rounded-2xl font-black text-lg hover:bg-brand-600 transition-all shadow-2xl shadow-brand-500/20 active:scale-95">Submit Another Application</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {error && <div className="bg-red-50 text-red-800 p-6 rounded-2xl text-base font-bold border border-red-100">{error}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="name" className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Full Name</label>
                  <input
                    {...register("name")}
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-0 py-5 px-8 text-slate-900 font-bold text-lg transition-all placeholder:text-slate-200"
                  />
                  {errors.name && <p className="mt-2 text-xs font-bold text-red-500 ml-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Email Address</label>
                  <input
                    {...register("email")}
                    type="email"
                    id="email"
                    placeholder="john@example.com"
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-0 py-5 px-8 text-slate-900 font-bold text-lg transition-all placeholder:text-slate-200"
                  />
                  {errors.email && <p className="mt-2 text-xs font-bold text-red-500 ml-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Phone Number</label>
                <input
                  {...register("phone")}
                  type="tel"
                  id="phone"
                  placeholder="+91 98765 43210"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-0 py-5 px-8 text-slate-900 font-bold text-lg transition-all placeholder:text-slate-200"
                />
                {errors.phone && <p className="mt-2 text-xs font-bold text-red-500 ml-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label htmlFor="address" className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Address</label>
                <textarea
                  {...register("address")}
                  id="address"
                  rows={3}
                  placeholder="Your current address"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-0 py-5 px-8 text-slate-900 font-bold text-lg transition-all placeholder:text-slate-200"
                ></textarea>
              </div>

              <div>
                <label htmlFor="skills" className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Skills & Interests</label>
                <input
                  {...register("skills")}
                  type="text"
                  id="skills"
                  placeholder="e.g. Teaching, Design, Event Planning"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-0 py-5 px-8 text-slate-900 font-bold text-lg transition-all placeholder:text-slate-200"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 px-10 rounded-2xl bg-brand-600 text-white font-black text-2xl hover:bg-brand-700 focus:outline-none focus:ring-8 focus:ring-brand-500/10 disabled:opacity-50 transition-all shadow-3xl shadow-brand-500/20 active:scale-[0.98] transform"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-4">
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </span>
                  ) : "Submit Application"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
