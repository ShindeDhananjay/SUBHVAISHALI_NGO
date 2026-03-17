import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Users, Globe, BookOpen, Calendar, MapPin } from "lucide-react";
import { useContent } from "../hooks/useContent";
import { api } from "../services/api";
import { format } from "date-fns";
import { motion } from "motion/react";

export default function Home() {
  const { content: heroTitle } = useContent("homepage_hero_title", "Empowering Communities, Changing Lives");
  const { content: heroSubtitle } = useContent("homepage_hero_subtitle", "Join us in our mission to provide education, healthcare, and sustainable solutions to those in need.");
  const { content: heroImage } = useContent("homepage_hero_image", "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80");
  const { content: impactText } = useContent("impact_text", "Our work is driven by a deep commitment to social justice and human dignity. Through our various programs, we aim to create lasting change and empower individuals to build better futures for themselves and their communities.");
  const { content: aboutMission } = useContent("about_mission", "Our mission is to alleviate poverty and empower marginalized communities through sustainable development programs.");
  const { content: aboutVision } = useContent("about_vision", "A world where every individual has the opportunity to thrive, regardless of their background or circumstances.");
  const { content: aboutHistory } = useContent("about_history", "Founded in 2010, Subhvaishali Foundation started as a small group of volunteers dedicated to providing after-school tutoring. Today, we operate in 15 countries, impacting over 10,000 lives annually.");

  const [activities, setActivities] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activitiesRes, eventsRes] = await Promise.all([
          api.get("/activities"),
          api.get("/events")
        ]);
        setActivities(activitiesRes.data.slice(0, 3)); // Show latest 3
        setEvents(eventsRes.data.slice(0, 2)); // Show latest 2
      } catch (error) {
        console.error("Error fetching home data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section id="home" className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Hero Background"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-950/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-950/20 via-transparent to-brand-50/30" />
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-bold uppercase tracking-[0.3em] mb-8">
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></span>
              Making a Difference
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-black text-white tracking-tight mb-10 leading-[0.95] text-balance">
              {heroTitle}
            </h1>
            <p className="mt-4 text-xl sm:text-2xl text-brand-50/90 max-w-3xl mx-auto font-medium leading-relaxed mb-14 text-balance">
              {heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/donate"
                className="group relative inline-flex items-center justify-center px-12 py-5 bg-brand-500 text-white text-xl font-black rounded-2xl hover:bg-brand-600 transition-all shadow-2xl shadow-brand-500/30 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Donate Now
                  <Heart className="h-6 w-6 fill-current group-hover:scale-125 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Link>
              <Link
                to="/volunteer"
                className="inline-flex items-center justify-center px-12 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 text-xl font-black rounded-2xl text-white hover:bg-white hover:text-brand-900 transition-all shadow-xl active:scale-95"
              >
                Get Involved
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section id="impact" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: "10K+", label: "Lives Impacted" },
              { val: "50+", label: "Active Projects" },
              { val: "1,200", label: "Volunteers" },
              { val: "15", label: "Countries" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[2.5rem] bg-brand-50/50 border border-brand-100/50 hover:bg-brand-50 transition-colors"
              >
                <div className="text-5xl font-serif font-black text-brand-600 mb-3">{stat.val}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-32 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-serif font-black text-slate-900 mb-10 tracking-tight leading-tight">Our Global Impact</h2>
            <p className="text-slate-500 leading-relaxed text-2xl font-medium italic">
              "{impactText}"
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-brand-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8">Our Journey</div>
              <h2 className="text-5xl font-serif font-black text-slate-900 sm:text-6xl mb-12 tracking-tight leading-[1.1]">About Subhvaishali Foundation</h2>
              <div className="space-y-12">
                <div className="flex gap-8 group">
                  <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-brand-200 group-hover:rotate-6 transition-transform">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3">Our Mission</h3>
                    <p className="text-slate-500 leading-relaxed text-lg font-medium">{aboutMission}</p>
                  </div>
                </div>
                <div className="flex gap-8 group">
                  <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-brand-200 group-hover:rotate-6 transition-transform">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3">Our Vision</h3>
                    <p className="text-slate-500 leading-relaxed text-lg font-medium">{aboutVision}</p>
                  </div>
                </div>
                <div className="flex gap-8 group">
                  <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-brand-200 group-hover:rotate-6 transition-transform">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3">Our History</h3>
                    <p className="text-slate-500 leading-relaxed text-lg font-medium">{aboutHistory}</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-3xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Our Team" 
                  className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-12 -left-12 bg-brand-900 text-white p-12 rounded-[3rem] shadow-3xl hidden sm:block border-4 border-white">
                <div className="text-6xl font-serif font-black mb-2">14+</div>
                <div className="text-brand-300 text-[10px] font-black uppercase tracking-[0.3em]">Years of Service</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-serif font-black text-slate-900 tracking-tight sm:text-6xl">Our Focus Areas</h2>
            <p className="mt-6 text-2xl text-slate-500 font-medium">Targeted initiatives for maximum impact.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Education", icon: BookOpen, desc: "Providing access to quality education for underprivileged children." },
              { title: "Healthcare", icon: Heart, desc: "Delivering essential medical services and health education to remote areas." },
              { title: "Community", icon: Users, desc: "Building resilient communities through skill development and empowerment." }
            ].map((area, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-12 rounded-[3rem] bg-brand-50/30 border border-brand-100/50 hover:bg-brand-500 transition-all duration-500 hover:-translate-y-3"
              >
                <div className="w-20 h-20 bg-brand-100 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-white/20 transition-colors">
                  <area.icon className="w-10 h-10 text-brand-600 group-hover:text-white" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-6 group-hover:text-white">{area.title}</h3>
                <p className="text-slate-500 group-hover:text-brand-50 leading-relaxed text-lg font-medium">{area.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="py-32 bg-brand-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <h2 className="text-5xl font-serif font-black text-slate-900 tracking-tight sm:text-6xl">Recent Activities</h2>
              <p className="mt-6 text-2xl text-slate-500 font-medium">A glimpse into our ongoing efforts.</p>
            </div>
            <Link to="/activities" className="inline-flex items-center text-brand-600 font-black text-lg hover:text-brand-700 transition-colors group">
              View All Activities <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[1, 2, 3].map(i => <div key={i} className="h-96 bg-brand-100 animate-pulse rounded-[3rem]"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {activities.map((activity: any) => (
                <motion.div 
                  key={activity._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-brand-900/5 hover:shadow-2xl hover:shadow-brand-900/10 transition-all duration-500 group border border-brand-100/50"
                >
                  <div className="h-72 overflow-hidden relative">
                    <img 
                      src={activity.imageUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"} 
                      alt={activity.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-8 left-8 px-5 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 shadow-lg">
                      {format(new Date(activity.date), "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className="p-12">
                    <h3 className="text-2xl font-black text-slate-900 mb-6 line-clamp-1">{activity.title}</h3>
                    <p className="text-slate-500 text-lg leading-relaxed line-clamp-3 mb-10 font-medium">{activity.description}</p>
                    <Link to={`/activities/${activity._id}`} className="inline-flex items-center text-brand-600 font-black text-sm hover:gap-3 transition-all group">
                      Read More <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-32 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-serif font-black tracking-tight sm:text-6xl text-slate-900">Upcoming Events</h2>
            <p className="mt-6 text-2xl text-slate-500 font-medium">Join us in person and be part of the change.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {events.map((event: any) => (
                <motion.div 
                  key={event._id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex flex-col sm:flex-row bg-brand-50/30 border border-brand-100/50 rounded-[3rem] overflow-hidden hover:shadow-2xl hover:shadow-brand-900/5 transition-all duration-500 group"
                >
                  <div className="w-full sm:w-64 h-64 sm:h-auto overflow-hidden">
                    <img 
                      src={event.imageUrl || "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=400&q=80"} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-12 flex-grow">
                    <div className="flex justify-between items-start mb-8">
                      <div className="px-4 py-1.5 bg-brand-500/10 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-brand-500/20">
                        {event.status}
                      </div>
                      <div className="text-slate-400 text-xs font-black uppercase tracking-widest">{format(new Date(event.date), "MMM d, yyyy")}</div>
                    </div>
                    <h3 className="text-3xl font-black mb-4 group-hover:text-brand-600 transition-colors text-slate-900 leading-tight">{event.title}</h3>
                    <p className="text-slate-500 text-lg mb-10 line-clamp-2 font-medium leading-relaxed">{event.description}</p>
                    <div className="flex items-center text-xs text-slate-400 font-black uppercase tracking-[0.2em]">
                      <MapPin className="w-5 h-5 mr-3 text-brand-500" /> {event.location}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-brand-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-900/20 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-serif font-black text-white sm:text-7xl mb-16 tracking-tight leading-tight text-balance">Ready to make a difference?</h2>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Link to="/donate" className="px-14 py-6 bg-white text-brand-600 rounded-2xl font-black text-xl hover:bg-brand-50 transition-all shadow-3xl hover:-translate-y-2 active:scale-95">
                Support Our Cause
              </Link>
              <Link to="/volunteer" className="px-14 py-6 bg-brand-900 text-white rounded-2xl font-black text-xl hover:bg-brand-950 transition-all shadow-3xl hover:-translate-y-2 active:scale-95 border border-white/10">
                Join as Volunteer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8">Contact</div>
              <h2 className="text-5xl font-serif font-black text-slate-900 sm:text-6xl mb-10 tracking-tight leading-tight">Get in Touch</h2>
              <p className="text-2xl text-slate-500 font-medium mb-16 leading-relaxed">Have questions about our programs or want to learn more about how you can help? We're here to answer any questions you may have.</p>
              
              <div className="space-y-12">
                <div className="flex items-start gap-8 group">
                  <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-brand-100 group-hover:bg-brand-100 transition-colors">
                    <Globe className="w-8 h-8 text-brand-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-xl mb-2">Our Office</h4>
                    <p className="text-slate-500 leading-relaxed text-lg font-medium">Mumbai, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-8 group">
                  <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-brand-100 group-hover:bg-brand-100 transition-colors">
                    <Users className="w-8 h-8 text-brand-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-xl mb-2">Email Us</h4>
                    <p className="text-brand-600 leading-relaxed text-lg font-black">subhvaishalifoundation@gmail.com</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-brand-50/50 rounded-[4rem] p-12 sm:p-20 border border-brand-100/50 shadow-3xl shadow-brand-900/5"
            >
              <form className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Name</label>
                    <input type="text" className="w-full rounded-2xl border-brand-100 shadow-sm focus:border-brand-500 focus:ring-0 py-5 px-8 border transition-all bg-white font-bold text-slate-900 placeholder:text-slate-300" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Email</label>
                    <input type="email" className="w-full rounded-2xl border-brand-100 shadow-sm focus:border-brand-500 focus:ring-0 py-5 px-8 border transition-all bg-white font-bold text-slate-900 placeholder:text-slate-300" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Subject</label>
                  <input type="text" className="w-full rounded-2xl border-brand-100 shadow-sm focus:border-brand-500 focus:ring-0 py-5 px-8 border transition-all bg-white font-bold text-slate-900 placeholder:text-slate-300" placeholder="How can I help?" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Message</label>
                  <textarea rows={5} className="w-full rounded-2xl border-brand-100 shadow-sm focus:border-brand-500 focus:ring-0 py-5 px-8 border transition-all bg-white font-bold text-slate-900 placeholder:text-slate-300" placeholder="Your message here..."></textarea>
                </div>
                <button type="submit" className="w-full py-6 bg-brand-600 text-white rounded-2xl font-black text-xl hover:bg-brand-700 transition-all shadow-2xl shadow-brand-500/20 active:scale-[0.98] transform">
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
