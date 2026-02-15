import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { 
  Code2, Target, Zap, Shield, Users, Database, 
  Server, Cpu, Github, Linkedin, Mail, ArrowRight, Menu, X 
} from "lucide-react";

function AboutUs() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-black font-sans selection:bg-indigo-500/30">
      
      {/* --- Animations --- */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>

      {/* --- Background Layer --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://cdn.mgig.fr/2019/05/mg-8a20e9d8-9188-421a-b00f-w1000h666-sc.jpg" 
          alt="Server Background" 
          className="w-full h-full object-cover opacity-30 grayscale-[30%]"
        />
        {/* Deep Black/Indigo Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>
        <div className="absolute inset-0 bg-indigo-950/20 mix-blend-overlay"></div>
      </div>

      {/* --- Navbar (Matching Home Page) --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
          
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <Code2 size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">CodeMaster</span>
          </NavLink>

          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">Home</NavLink>
            <NavLink to="/problems" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">Problems</NavLink>
            <NavLink to="/about" className="text-sm font-medium text-white hover:text-indigo-400 transition-colors">About Us</NavLink>
            <NavLink to="/discuss" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">Discuss</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="px-5 py-2.5 text-sm font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  Sign Up
                </button>
              </>
            )}
          </div>

          <button 
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 py-4 px-6 flex flex-col gap-4 shadow-2xl">
            <NavLink to="/" className="text-slate-300 font-medium py-2">Home</NavLink>
            <NavLink to="/problems" className="text-slate-300 font-medium py-2">Problems</NavLink>
            <NavLink to="/about" className="text-white font-medium py-2">About Us</NavLink>
            <hr className="border-white/10 my-2" />
            {isAuthenticated ? (
              <button onClick={() => navigate('/dashboard')} className="w-full py-3 bg-white/10 rounded-xl text-white font-bold">Dashboard</button>
            ) : (
              <div className="flex flex-col gap-3">
                <button onClick={() => navigate('/login')} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold">Log In</button>
                <button onClick={() => navigate('/signup')} className="w-full py-3 bg-indigo-600 rounded-xl text-white font-bold">Sign Up</button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* --- Main Content --- */}
      <main className="relative z-10 pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mt-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Empowering the Next Generation of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">
              Software Engineers.
            </span>
          </h1>
          <p className="text-lg text-slate-400 mb-10 leading-relaxed">
            CodeMaster is a cutting-edge platform designed to bridge the gap between learning algorithms and landing your dream tech job. Built with modern web technologies, AI, and a passion for code.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mt-12 animate-fade-in-up delay-100">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6">
                <Target size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-slate-400 leading-relaxed">
                To provide a seamless, robust, and intelligent environment where developers of all skill levels can practice Data Structures and Algorithms without friction. We believe that mastering problem-solving should be accessible and engaging.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6">
                <Zap size={24} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Edge</h3>
              <p className="text-slate-400 leading-relaxed">
                Unlike traditional platforms, CodeMaster integrates AI-driven assistance, high-performance remote code execution, and curated video editorials in one unified, distraction-free Dark Mode interface.
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="w-full max-w-5xl mt-32 animate-fade-in-up delay-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Powered by Modern Technology</h2>
            <p className="text-slate-400">Built from the ground up using industry-standard tools.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Tech Item */}
            <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-[#0f172a]/80 transition-colors">
              <Cpu size={32} className="text-blue-400" />
              <span className="text-white font-bold">React & Redux</span>
              <span className="text-xs text-slate-500 text-center">Frontend UI & State</span>
            </div>
            
            <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-[#0f172a]/80 transition-colors">
              <Server size={32} className="text-green-400" />
              <span className="text-white font-bold">Node & Express</span>
              <span className="text-xs text-slate-500 text-center">Robust Backend API</span>
            </div>

            <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-[#0f172a]/80 transition-colors">
              <Database size={32} className="text-emerald-400" />
              <span className="text-white font-bold">MongoDB</span>
              <span className="text-xs text-slate-500 text-center">NoSQL Database</span>
            </div>

            <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-[#0f172a]/80 transition-colors">
              <Shield size={32} className="text-red-400" />
              <span className="text-white font-bold">Redis & JWT</span>
              <span className="text-xs text-slate-500 text-center">Caching & Security</span>
            </div>
          </div>
        </div>

        {/* Creator Section */}
        <div className="w-full max-w-3xl mt-32 bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 animate-fade-in-up delay-300">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 flex-shrink-0">
              <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                {/* Fallback to an icon if you don't have a profile image */}
                <Users size={48} className="text-indigo-400" />
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">Built by Prashant Yanpallewar</h2>
              <p className="text-indigo-400 font-medium mb-4">Full Stack Developer</p>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                I created CodeMaster to combine my love for Data Structures with modern web development. 
                This platform is a testament to scalable architecture, clean UI/UX, and the power of the MERN stack.
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-4">
                <a href="https://github.com/Prashanty2005" target="_blank" className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5">
                  <Github size={20} />
                </a>
                <a href="https://www.linkedin.com/in/prashant-yanpallewar-b02441282/" target="_blank" className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-blue-400 transition-colors border border-white/5">
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=prashantyanpallewar@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-red-400 transition-colors border border-white/5"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-32 text-center animate-fade-in-up delay-400 pb-10">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to start coding?</h2>
          <button 
            onClick={() => navigate('/signup')}
            className="px-8 py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-1 inline-flex items-center gap-2"
          >
            Join the Community <ArrowRight size={20} />
          </button>
        </div>

      </main>

      {/* --- Footer (Matching Home Page) --- */}
      <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-md pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Code2 size={20} className="text-indigo-500" />
            <span className="text-lg font-bold text-white">CodeMaster</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <NavLink to="/about" className="text-white transition-colors">About Us</NavLink>
            <NavLink to="/privacy" className="hover:text-white transition-colors">Privacy Policy</NavLink>
            <NavLink to="/terms" className="hover:text-white transition-colors">Terms of Service</NavLink>
          </div>
          <p className="text-slate-500 text-sm">© 2026 CodeMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default AboutUs;