import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../slices/authSlice';
import { LogOut, User, CheckCircle2, X, Filter, Code2, Search, ChevronRight, Loader2 } from 'lucide-react';

const AVAILABLE_TAGS = ['array','string','hashtable','linkedlist','math','twopointers','tree','graph',
  'depthfirstsearch','breadthfirstsearch','binarysearch','dynamicprogramming','greedy','backtracking',
  'stack','queue','heap','slidingwindow','unionfind','trie','recursion','sorting','bitmanipulation',
  'divideandconquer','segmenttree','fenwicktree','topologicalsort','design','simulation','memoization'];

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // State for Data
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [totalProblems, setTotalProblems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // State for Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tags: [],
    status: 'all' // Note: 'status' filtering is still client-side or requires specific backend support. 
                  // If backend doesn't support 'status' filter, we filter solved/unsolved visually or after fetch.
                  // For this implementation, I will treat 'status' as client-side post-filter or ignored 
                  // if you strictly want server-side. Assuming strict server-side for diff/tags/search.
  });

  // Debounce Search Term (wait 500ms after typing stops)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // Fetch Problems (Server-Side)
  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true);
      try {
        const queryParams = {
          page: page,
          limit: 10,
          search: debouncedSearch,
          difficulty: filters.difficulty !== 'all' ? filters.difficulty : undefined,
          tags: filters.tags.length > 0 ? filters.tags.join(',') : undefined,
        };

        const { data } = await axiosClient.get('/problem/getAllProblem', { params: queryParams });

        // If page is 1, replace data. If page > 1, append data.
        if (page === 1) {
          setProblems(data.problems || []);
        } else {
          setProblems(prev => [...prev, ...data.problems]);
        }
        
        setTotalProblems(data.total || 0);

      } catch (error) {
        // Handle 404 (No problems found) gracefully
        if (error.response && error.response.status === 404) {
          if (page === 1) {
            setProblems([]);
            setTotalProblems(0);
          }
        } else {
          console.error('Error fetching problems:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, [page, filters, debouncedSearch]);

  // Fetch Solved Problems
  useEffect(() => {
    const fetchSolvedProblems = async () => {
      if (!user) return;
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };
    fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const toggleTag = (tag) => {
    setFilters(prev => {
      const currentTags = prev.tags;
      if (currentTags.includes(tag)) {
        return { ...prev, tags: currentTags.filter(t => t !== tag) };
      } else {
        return { ...prev, tags: [...currentTags, tag] };
      }
    });
  };

  // Clear filters helper
  const clearFilters = () => {
    setFilters({ difficulty: 'all', tags: [], status: 'all' });
    setSearchTerm('');
    setPage(1);
  };

  // Client-side filtering for "Status" (Solved/Unsolved) 
  // since the provided backend code doesn't seem to filter by 'solved status' directly in the DB query.
  const displayableProblems = problems.filter(problem => {
    if (filters.status === 'solved') {
      return solvedProblems.some(sp => sp._id === problem._id);
    }
    return true; // Show all (or add 'unsolved' logic here if needed)
  });

  const solvedCount = solvedProblems.length;
  // Note: progressPercentage is based on CURRENTLY fetched/filtered items vs solved, 
  // or you might want global stats. keeping it simple based on available data:
  const progressPercentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;
  // Prevent > 100% if totalProblems is filtered subset
  const safeProgress = Math.min(progressPercentage, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">

      {/* Navbar */}
      <nav className="navbar bg-gray-900/80 backdrop-blur-md border-b border-gray-700 px-6 shadow-xl sticky top-0 z-50">
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-xl font-bold tracking-wide">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <Code2 size={20} className="text-white" />
              </div>
              <span className="text-white">CodeMaster</span>
            </div>
          </NavLink>
        </div>
        <div className="flex items-center gap-4">
          <div>
            {user?.role === 'admin' && (
              <NavLink to="/admin" className="btn btn-sm bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white">
                Admin Panel
              </NavLink>
            )}
          </div>
          {user ? (
          <div className="dropdown dropdown-end">
            {/* Dropdown trigger button */}
            <div
              tabIndex={0}
              role="button"
              className="btn btn-sm bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white gap-2"
            >
              <User size={16} />
              <span className="font-medium">{user.firstName}</span>
            </div>

            {/* Dropdown content */}
            <div
              tabIndex={0}
              className="mt-2 p-4 shadow-xl dropdown-content bg-gray-800 border border-gray-700 rounded-xl w-72 z-50"
            >
              {/* User details table */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">First Name</span>
                  <span className="text-white font-medium">{user.firstName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Name</span>
                  <span className="text-white font-medium">{user.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white font-medium truncate max-w-[180px]">
                    {user.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Role</span>
                  <span className="text-white font-medium capitalize">
                    {user.role}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Problems Solved</span>
                  <span className="text-green-400 font-medium">
                    {user.problemSolved?.length || 0}
                  </span>
                </div>
              </div>

              {/* Optional separator and profile link */}
              <div className="divider my-3 bg-gray-700 h-px"></div>

              {/* View Profile link (placeholder) */}
              <div className="mb-2">
                <NavLink
                  to="/profile"
                  className="block w-full text-left px-3 py-2 text-sm text-blue-400 hover:bg-gray-700 rounded-lg transition"
                >
                  View Profile
                </NavLink>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-lg transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        ) : (
          <NavLink to="/login" className="btn btn-sm btn-primary">
            Login
          </NavLink>
        )}
        </div>
      </nav>

      <div className="container mx-auto p-4 lg:p-6 max-w-6xl">

        {/* Header Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Problem List</h1>
              <p className="text-gray-400">Sharpen your coding skills with curated challenges</p>
            </div>

            {user && (
              <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 min-w-[200px]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">Solved</span>
                  <span className="text-blue-400 text-sm font-medium">{solvedCount}</span>
                </div>
                {/* Visual bar just for decoration since total depends on filters now */}
                 <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${safeProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search problems by title or tag..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col gap-4 mb-8 p-5 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-lg">

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gray-300">
              <Filter size={18} />
              <span className="font-medium">Filters</span>
            </div>

            <select
              className="select bg-gray-900/70 border-gray-700 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Problems</option>
              <option value="solved">Solved Problems</option>
            </select>

            <select
              className="select bg-gray-900/70 border-gray-700 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
              value={filters.difficulty}
              onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {(filters.tags.length > 0 || filters.difficulty !== 'all' || filters.status !== 'all' || searchTerm !== '') && (
               <button
                 onClick={clearFilters}
                 className="btn btn-sm bg-gray-900/70 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white gap-2"
               >
                 <X size={16} /> Clear
               </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-gray-400 text-sm font-medium ml-1">Tags (Strict Match):</span>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map(tag => {
                const isSelected = filters.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 
                      ${isSelected 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-500 text-white shadow-md' 
                        : 'bg-gray-900/60 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                  >
                    {tag}
                    {isSelected && <CheckCircle2 size={12} className="ml-2 inline" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Problems List */}
        <div className="grid gap-4">
          {displayableProblems.map(problem => {
            const isSolved = solvedProblems.some(sp => sp._id === problem._id);
            return (
              <div key={problem._id} className="group">
                <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl hover:bg-gray-800/70 hover:border-gray-600 transition-all duration-300">
                  <div className="card-body p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                            ${getDifficultyColor(problem.difficulty).bg} ${getDifficultyColor(problem.difficulty).text}`}
                          >
                            {problem.title.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2)}
                          </div>
                          <div>
                            <h2 className="card-title text-lg font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
                              <NavLink to={`/problem/${problem._id}`} className="hover:underline">
                                {problem.title}
                              </NavLink>
                            </h2>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty).badge}`}>
                                {problem.difficulty}
                              </div>
                              {problem.tags.slice(0, 3).map((tag, index) => (
                                <div key={index} className="px-3 py-1 rounded-full bg-gray-900/70 text-gray-300 text-xs border border-gray-700">
                                  {tag}
                                </div>
                              ))}
                              {problem.tags.length > 3 && (
                                <div className="px-3 py-1 rounded-full bg-gray-900/50 text-gray-400 text-xs">
                                  +{problem.tags.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {isSolved && (
                          <div className="flex items-center gap-2 bg-green-900/30 text-green-400 px-3 py-2 rounded-lg border border-green-800/50">
                            <CheckCircle2 size={16} />
                            <span className="text-sm font-medium">Solved</span>
                          </div>
                        )}
                        <NavLink
                          to={`/problem/${problem._id}`}
                          className="btn btn-sm bg-gradient-to-r from-blue-600 to-indigo-600 border-none text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20"
                        >
                          Solve <ChevronRight size={16} />
                        </NavLink>
                      </div>
                    </div>

                    {isSolved && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Your Solution Status</span>
                          <span className="text-green-400 font-medium">Accepted</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading State for initial fetch or filters */}
          {isLoading && problems.length === 0 && (
            <div className="text-center py-10">
              <Loader2 className="animate-spin mx-auto text-blue-500" size={32} />
              <p className="text-gray-400 mt-2">Loading problems...</p>
            </div>
          )}

          {/* No Results State */}
          {!isLoading && displayableProblems.length === 0 && (
            <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-700">
              <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Problems Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {debouncedSearch ? `No problems match "${debouncedSearch}"` : 'No problems match your current filters'}
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Load More Button */}
          {problems.length < totalProblems && !isLoading && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setPage(prev => prev + 1)}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl border border-gray-700 transition-colors font-medium flex items-center gap-2"
              >
                Load More Problems
              </button>
            </div>
          )}
          
          {/* Load More Spinner */}
          {isLoading && problems.length > 0 && (
             <div className="flex justify-center mt-6">
               <Loader2 className="animate-spin text-blue-500" size={24} />
             </div>
          )}
        </div>

        {/* Footer Stats */}
        {problems.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="flex flex-wrap justify-between items-center text-sm text-gray-500">
              <div>
                Showing <span className="text-white font-medium">{displayableProblems.length}</span> of{" "}
                <span className="text-white font-medium">{totalProblems}</span> total problems
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return {
        bg: 'bg-green-900/30',
        text: 'text-green-400',
        badge: 'bg-green-900/40 text-green-400 border border-green-800/50'
      };
    case 'medium':
      return {
        bg: 'bg-yellow-900/30',
        text: 'text-yellow-400',
        badge: 'bg-yellow-900/40 text-yellow-400 border border-yellow-800/50'
      };
    case 'hard':
      return {
        bg: 'bg-red-900/30',
        text: 'text-red-400',
        badge: 'bg-red-900/40 text-red-400 border border-red-800/50'
      };
    default:
      return {
        bg: 'bg-gray-900/30',
        text: 'text-gray-400',
        badge: 'bg-gray-900/40 text-gray-400 border border-gray-700'
      };
  }
};

export default Homepage;