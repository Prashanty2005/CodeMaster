import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { 
  Code2, Search, MessageSquare, Plus, Flame, 
  Clock, Eye, ChevronUp, Tag, User, Menu, X 
} from "lucide-react";

// --- MOCK DATA FOR DISCUSSIONS ---
const CATEGORIES = ["All", "Interview Questions", "Interview Experience", "Compensation", "Study Guide", "General"];

const MOCK_POSTS = [
  {
    id: 1,
    title: "Google | SDE 2 (L4) | Bangalore | Interview Experience (Offer)",
    author: "code_ninja99",
    avatar: "bg-blue-500",
    category: "Interview Experience",
    tags: ["Google", "System Design", "Offer"],
    upvotes: 342,
    views: "12.4k",
    comments: 45,
    timestamp: "2 hours ago",
    hot: true
  },
  {
    id: 2,
    title: "How to effectively prepare for Dynamic Programming? I'm stuck.",
    author: "dp_struggler",
    avatar: "bg-purple-500",
    category: "Study Guide",
    tags: ["Dynamic Programming", "Advice"],
    upvotes: 128,
    views: "3.2k",
    comments: 32,
    timestamp: "5 hours ago",
    hot: false
  },
  {
    id: 3,
    title: "Amazon | SWE III | Seattle | Phone Screen Question",
    author: "tech_enthusiast",
    avatar: "bg-emerald-500",
    category: "Interview Questions",
    tags: ["Amazon", "Graphs", "BFS"],
    upvotes: 89,
    views: "1.5k",
    comments: 12,
    timestamp: "1 day ago",
    hot: false
  },
  {
    id: 4,
    title: "TCS vs Infosys vs Wipro - Which is better for a fresher?",
    author: "fresher_2026",
    avatar: "bg-rose-500",
    category: "General",
    tags: ["Career Advice", "India"],
    upvotes: 215,
    views: "8.9k",
    comments: 104,
    timestamp: "2 days ago",
    hot: true
  },
  {
    id: 5,
    title: "Microsoft | SDE 1 | Base 18LPA + Stocks | Is this a lowball?",
    author: "anon_dev",
    avatar: "bg-indigo-500",
    category: "Compensation",
    tags: ["Microsoft", "Salary", "India"],
    upvotes: 450,
    views: "22k",
    comments: 156,
    timestamp: "3 days ago",
    hot: true
  }
];

const TRENDING_TAGS = ["Amazon", "Google", "System Design", "Dynamic Programming", "OOD", "Offer"];

function Discuss() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredPosts = MOCK_POSTS.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
        .delay-300 { animation-delay: 0.3s; }
      `}</style>

      {/* --- Background Layer (Matches theme) --- */}
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
            <NavLink to="/problems" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">Problems</NavLink>
            <NavLink to="/about" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">About Us</NavLink>
            <NavLink to="/discuss" className="text-sm font-medium text-white hover:text-indigo-400 transition-colors">Discuss</NavLink>
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
            <NavLink to="/about" className="text-slate-300 font-medium py-2">About Us</NavLink>
            <NavLink to="/discuss" className="text-white font-medium py-2">Discuss</NavLink>
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
        
        {/* Header & Search */}
        <div className="w-full animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
            Community Discuss
          </h1>
          <p className="text-slate-400 mb-8">
            Share interview experiences, ask questions, and discuss compensation.
          </p>

          <div className="flex flex-col md:flex-row gap-4 items-center w-full mb-10">
            {/* Search Bar */}
            <div className="relative w-full flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="Search topics, tags, or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#0f172a]/60 backdrop-blur-md border border-white/10 text-white placeholder-slate-500 focus:bg-[#0f172a]/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all duration-300 shadow-lg"
              />
            </div>

            {/* New Post Button */}
            <button className="w-full md:w-auto px-6 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 flex-shrink-0">
              <Plus size={20} /> New Post
            </button>
          </div>
        </div>

        {/* Grid Layout (Main Content + Sidebar) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* --- LEFT: MAIN FEED --- */}
          <div className="lg:col-span-3 flex flex-col gap-6 animate-fade-in-up delay-100">
            
            {/* Category Filter Scroll */}
            <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border
                    ${activeCategory === category 
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30 shadow-inner' 
                      : 'bg-[#0f172a]/60 text-slate-400 border-white/5 hover:bg-white/5 hover:text-slate-200'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <div key={post.id} className="group bg-[#0f172a]/60 backdrop-blur-xl border border-white/5 hover:border-white/15 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:bg-[#0f172a]/80 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex gap-4 md:gap-6 items-start">
                    
                    {/* Upvote Column (Hidden on tiny mobile, visible on sm+) */}
                    <div className="hidden sm:flex flex-col items-center gap-1 text-slate-500 group-hover:text-slate-300 transition-colors min-w-[50px]">
                      <ChevronUp size={28} className="hover:text-indigo-400" />
                      <span className="font-bold text-sm">{post.upvotes}</span>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 min-w-0">
                      
                      {/* Meta info (Mobile upvotes included here) */}
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${post.avatar}`}>
                            {post.author.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs font-semibold text-indigo-300">{post.author}</span>
                        </div>
                        <span className="text-slate-600 text-xs">•</span>
                        <span className="text-slate-500 text-xs flex items-center gap-1"><Clock size={12}/> {post.timestamp}</span>
                        <span className="text-slate-600 text-xs hidden md:inline">•</span>
                        <span className="text-slate-500 text-xs hidden md:inline">{post.category}</span>
                        {post.hot && (
                          <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ml-auto md:ml-0">
                            <Flame size={10} /> HOT
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-slate-200 group-hover:text-indigo-300 transition-colors mb-3 leading-snug break-words">
                        {post.title}
                      </h3>

                      {/* Tags & Stats Footer */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, i) => (
                            <span key={i} className="flex items-center gap-1 bg-white/5 border border-white/5 text-slate-400 px-2.5 py-1 rounded-md text-xs transition-colors group-hover:bg-white/10 group-hover:text-slate-300">
                              <Tag size={10} /> {tag}
                            </span>
                          ))}
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center gap-5 text-slate-500 text-xs">
                          <span className="sm:hidden flex items-center gap-1 font-bold"><ChevronUp size={14} /> {post.upvotes}</span>
                          <span className="flex items-center gap-1.5"><Eye size={14} /> {post.views}</span>
                          <span className="flex items-center gap-1.5"><MessageSquare size={14} /> {post.comments}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                  <Search size={48} className="text-slate-600 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
                  <p className="text-slate-400">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>

          {/* --- RIGHT: SIDEBAR --- */}
          <div className="lg:col-span-1 flex flex-col gap-6 animate-fade-in-up delay-200">
            
            {/* User Stat Box / Join CTA */}
            {isAuthenticated ? (
              <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><User size={64}/></div>
                <h3 className="font-bold text-white mb-4 relative z-10">Your Stats</h3>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-black/30 rounded-xl p-3 border border-white/5 text-center">
                    <div className="text-2xl font-bold text-indigo-400">12</div>
                    <div className="text-xs text-slate-500 mt-1">Posts</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 border border-white/5 text-center">
                    <div className="text-2xl font-bold text-blue-400">348</div>
                    <div className="text-xs text-slate-500 mt-1">Reputation</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-6 text-center">
                <h3 className="font-bold text-white mb-2">Join the Community</h3>
                <p className="text-sm text-indigo-200/70 mb-5">Create an account to ask questions, upvote answers, and build your reputation.</p>
                <button 
                  onClick={() => navigate('/signup')}
                  className="w-full py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
                >
                  Sign Up Now
                </button>
              </div>
            )}

            {/* Trending Tags */}
            <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Flame size={18} className="text-orange-500" /> Trending Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map((tag, i) => (
                  <span key={i} className="cursor-pointer bg-white/5 hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Community Rules snippet */}
            <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-5">
              <h4 className="font-bold text-slate-300 text-sm mb-3">Community Guidelines</h4>
              <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4 marker:text-slate-700">
                <li>Be respectful and polite.</li>
                <li>Do not post exact interview questions from active contests.</li>
                <li>Format your code using Markdown.</li>
                <li>Search before you post to avoid duplicates.</li>
              </ul>
            </div>

          </div>
        </div>

      </main>

      {/* --- Footer (Matching) --- */}
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

export default Discuss;