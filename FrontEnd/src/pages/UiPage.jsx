import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { 
  Code2, Terminal, Cpu, MessageSquare, Video, 
  ChevronRight, Sparkles, Github, Menu, X ,CheckCircle
} from "lucide-react";

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add background blur to navbar when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
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
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>

      {/* --- Background Layer (Matches Auth Pages) --- */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://cdn.mgig.fr/2019/05/mg-8a20e9d8-9188-421a-b00f-w1000h666-sc.jpg" 
          alt="Server Background" 
          className="w-full h-full object-cover opacity-30 grayscale-[30%]"
        />
        {/* Deep Black/Indigo Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>
        <div className="absolute inset-0 bg-indigo-950/20 mix-blend-overlay"></div>
      </div>

      {/* --- Navbar --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
          
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <Code2 size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">CodeMaster</span>
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className="text-sm font-medium text-white hover:text-indigo-400 transition-colors">Home</NavLink>
            <NavLink to="/problems" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">Problems</NavLink>
            <NavLink to="/about" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">About Us</NavLink>
            <NavLink to="/discuss" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">Discuss</NavLink>
          </div>

          {/* Auth Buttons */}
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

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 py-4 px-6 flex flex-col gap-4 shadow-2xl">
            <NavLink to="/" className="text-white font-medium py-2">Home</NavLink>
            <NavLink to="/problems" className="text-slate-300 font-medium py-2">Problems</NavLink>
            <NavLink to="/about" className="text-slate-300 font-medium py-2">About Us</NavLink>
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
        <div className="text-center max-w-4xl mx-auto mt-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-sm">
            <Sparkles size={16} /> A New Way to Master Algorithms
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Level Up Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-300 to-indigo-500">
              Coding Skills.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The ultimate platform to practice data structures, solve interview questions, 
            watch video editorials, and get real-time help from our AI Assistant.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-100">
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Start Coding <ChevronRight size={20} />
            </button>
            <button 
              onClick={() => window.open(
                                    "https://github.com/Prashanty2005/CodeMaster",
                                    "_blank",
                                    "noopener,noreferrer"
                                    )}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Github size={20} /> View Documentation
            </button>
          </div>
        </div>

        {/* Floating Mockup / Art */}
        <div className="w-full max-w-5xl mt-20 relative animate-fade-in-up delay-200">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
          <div className="relative rounded-2xl bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 shadow-2xl p-4 flex flex-col md:flex-row gap-6 items-center">
            
            {/* Mockup Editor Left */}
            <div className="w-full md:w-2/3 bg-black/50 rounded-xl border border-white/5 p-4 font-mono text-sm text-slate-300 overflow-hidden">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="text-indigo-400">class <span className="text-yellow-300">Solution</span> {'{'}</div>
              <div className="ml-4 text-indigo-400">public <span className="text-green-300">int[]</span> twoSum<span className="text-white">(</span><span className="text-green-300">int[]</span> nums, <span className="text-green-300">int</span> target<span className="text-white">)</span> {'{'}</div>
              <div className="ml-8 text-slate-500">{'// Map to store value and its index'}</div>
              <div className="ml-8">Map&lt;Integer, Integer&gt; map = new HashMap&lt;&gt;();</div>
              <div className="ml-8 text-purple-400">for <span className="text-white">(</span>int i = 0; i &lt; nums.length; i++<span className="text-white">)</span> {'{'}</div>
              <div className="ml-12">int complement = target - nums[i];</div>
              <div className="ml-12 text-slate-500">{'// AI Hint: Check if complement exists'}</div>
              <div className="ml-8">{'}'}</div>
              <div className="ml-4">{'}'}</div>
              <div>{'}'}</div>
            </div>

            {/* Mockup AI Right */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              <div className="bg-indigo-900/30 border border-indigo-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-sm">
                  <MessageSquare size={16} /> AI Assistant
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Looks like you are solving Two Sum! Instead of a nested loop O(n²), try using a HashMap to achieve O(n) time complexity.
                </p>
              </div>
              <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-green-400 font-bold text-sm">Accepted</div>
                  <div className="text-slate-400 text-xs">Runtime: 1ms (Beats 99%)</div>
                </div>
                <CheckCircle className="text-green-500" size={24} />
              </div>
            </div>

          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full animate-fade-in-up delay-300">
          
          <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 hover:bg-[#0f172a]/80 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Terminal size={24} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Multi-Language Compiler</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Write, run, and test your code instantly in C++, Java, or JavaScript using our highly optimized backend execution engine.
            </p>
          </div>

          <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 hover:bg-[#0f172a]/80 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare size={24} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Integrated AI Chat</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Stuck on a bug? Our built-in AI assistant reads your code and provides hints, complexity analysis, and debugging support.
            </p>
          </div>

          <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 hover:bg-[#0f172a]/80 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Video size={24} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Video Editorials</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Learn the optimal approach. Watch detailed, step-by-step video solutions attached directly to the problems.
            </p>
          </div>

        </div>

      </main>

      {/* --- Footer --- */}
      <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-md pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Code2 size={20} className="text-indigo-500" />
            <span className="text-lg font-bold text-white">CodeMaster</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <NavLink to="/about" className="hover:text-white transition-colors">About Us</NavLink>
            <NavLink to="/privacy" className="hover:text-white transition-colors">Privacy Policy</NavLink>
            <NavLink to="/terms" className="hover:text-white transition-colors">Terms of Service</NavLink>
          </div>
          <p className="text-slate-500 text-sm">© 2026 CodeMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;