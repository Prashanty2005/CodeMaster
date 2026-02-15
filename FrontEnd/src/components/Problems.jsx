import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import { getAllProblems } from "../slices/authSlice1"; // Make sure this path is correct
import { 
  Code2, Search, Play, Lock, CheckCircle, 
  CircleDashed, BarChart2, Menu, X, ChevronRight 
} from "lucide-react";

function Problems() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Fetching both auth state and problems state
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { problems, loading, error } = useSelector((state) => state.problems); // Make sure your store uses 'problems' (lowercase)
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fix: Added proper dependency array to prevent infinite loops
  useEffect(() => {
    dispatch(getAllProblems());
  }, [dispatch]);

  // Click handler for problems
  const handleProblemClick = (problemId) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login");
    } else {
      // Go to problem page if authenticated
      navigate(`/problem/${problemId}`);
    }
  };

  // Filter problems based on search and difficulty
  const filteredProblems = problems?.filter((p) => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === "All" || p.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();
    return matchesSearch && matchesDifficulty;
  }) || [];

  // Difficulty Badge Color Helper
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-[#00b8a3] bg-[#00b8a3]/10 border border-[#00b8a3]/20'; 
      case 'medium': return 'text-[#ffc01e] bg-[#ffc01e]/10 border border-[#ffc01e]/20'; 
      case 'hard': return 'text-[#ff375f] bg-[#ff375f]/10 border border-[#ff375f]/20'; 
      default: return 'text-gray-400 bg-gray-700/30 border border-gray-600';
    }
  };

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
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>

      {/* --- Background Layer --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://cdn.mgig.fr/2019/05/mg-8a20e9d8-9188-421a-b00f-w1000h666-sc.jpg" 
          alt="Server Background" 
          className="w-full h-full object-cover opacity-30 grayscale-[30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>
        <div className="absolute inset-0 bg-indigo-950/20 mix-blend-overlay"></div>
      </div>

      {/* --- Navbar --- */}
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
            <NavLink to="/problems" className="text-sm font-medium text-white hover:text-indigo-400 transition-colors">Problems</NavLink>
            <NavLink to="/about" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">About Us</NavLink>
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
                  className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  Sign Up
                </button>
              </>
            )}
          </div>

          <button className="md:hidden text-slate-300 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="relative z-10 pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center min-h-[80vh]">
        
        {/* Header Section */}
        <div className="w-full animate-fade-in-up">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Problem <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">Library</span>
          </h1>
          <p className="text-slate-400 mb-8 max-w-2xl">
            Master your algorithms. Browse our collection of coding challenges ranging from beginner to advanced.
          </p>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 w-full mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0f172a]/60 backdrop-blur-md border border-white/10 text-white placeholder-slate-500 focus:bg-[#0f172a]/90 focus:border-indigo-500 outline-none transition-all duration-300"
              />
            </div>

            {/* Difficulty Tabs */}
            <div className="flex bg-[#0f172a]/60 backdrop-blur-md border border-white/10 rounded-xl p-1">
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    difficultyFilter === diff 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- Problem Table / List --- */}
        <div className="w-full bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden animate-fade-in-up delay-100">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-black/40 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-6 md:col-span-7">Title</div>
            <div className="col-span-3 md:col-span-2 text-center">Difficulty</div>
            <div className="col-span-2 hidden md:block text-center">Acceptance</div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <span className="loading loading-spinner loading-lg text-indigo-500"></span>
              <p className="text-slate-400">Loading problems...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-red-400">
              <BarChart2 size={48} className="opacity-50 mb-2" />
              <p className="font-bold">Failed to load problems</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          )}

          {/* Empty State (No problems match filter) */}
          {!loading && !error && filteredProblems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
              <Code2 size={48} className="opacity-20" />
              <p>No problems found.</p>
            </div>
          )}

          {/* Problem Rows */}
          {!loading && !error && filteredProblems.map((p, index) => (
            <div 
              key={p._id || index}
              onClick={() => handleProblemClick(p._id)}
              className="grid grid-cols-12 gap-4 p-4 items-center border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors group"
            >
              {/* Status Icon */}
              <div className="col-span-1 flex justify-center">
                {isAuthenticated ? (
                  <CircleDashed size={18} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                ) : (
                  <Lock size={16} className="text-slate-600 group-hover:text-red-400 transition-colors" />
                )}
              </div>

              {/* Title */}
              <div className="col-span-6 md:col-span-7">
                <span className="text-slate-200 font-medium group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                  {p.title || "Untitled Problem"}
                </span>
              </div>

              {/* Difficulty */}
              <div className="col-span-3 md:col-span-2 flex justify-center">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getDifficultyColor(p.difficulty)}`}>
                  {p.difficulty || "Unknown"}
                </span>
              </div>

              {/* Acceptance / Action Icon */}
              <div className="col-span-2 hidden md:flex justify-center items-center text-slate-400 text-sm font-mono">
                {/* Dummy acceptance rate for UI aesthetics */}
                {Math.floor(Math.random() * 40 + 40)}.<span className="text-[10px]">{Math.floor(Math.random() * 99)}%</span>
              </div>

              {/* Mobile Arrow */}
              <div className="col-span-2 md:hidden flex justify-end text-slate-600 group-hover:text-indigo-400">
                <ChevronRight size={18} />
              </div>
            </div>
          ))}
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

export default Problems;