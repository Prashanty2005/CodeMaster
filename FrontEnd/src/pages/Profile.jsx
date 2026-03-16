import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router';
import { 
  User, Mail, Calendar, Award, Shield, Edit2, ArrowLeft, Code2, 
  CheckCircle2, Loader2, ChevronRight, X, Save 
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { updateUser } from '../slices/authSlice';
import ActivityHeatmap from '../components/ActivityHeatmap';

function Profile() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loadingSolved, setLoadingSolved] = useState(false);
  const [errorSolved, setErrorSolved] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    age: ''
  });
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      if (!user) return;
      setLoadingSolved(true);
      setErrorSolved(null);
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
        setErrorSolved('Failed to load solved problems.');
      } finally {
        setLoadingSolved(false);
      }
    };
    fetchSolvedProblems();
  }, [user]);

  useEffect(() => {
    if (user && isEditModalOpen) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        age: user.age || ''
      });
      setUpdateError('');
    }
  }, [user, isEditModalOpen]);

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateError('');

    if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
      setUpdateError('First name and last name are required.');
      setUpdating(false);
      return;
    }

    try {
      const { data } = await axiosClient.put('/user/update', {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        age: editForm.age ? Number(editForm.age) : undefined
      });
      
      dispatch(updateUser(data.user));
      setIsEditModalOpen(false);
    } catch (error) {
      setUpdateError(error.response?.data?.error || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  }) : 'N/A';

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-900/40 text-green-400 border border-green-800/50';
      case 'medium': return 'bg-yellow-900/40 text-yellow-400 border border-yellow-800/50';
      case 'hard': return 'bg-red-900/40 text-red-400 border border-red-800/50';
      default: return 'bg-gray-900/40 text-gray-400 border border-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-200">
      {/* Navbar */}
      <nav className="navbar bg-[#13161f]/80 backdrop-blur-md border-b border-gray-800 px-6 shadow-xl sticky top-0 z-50">
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost hover:bg-transparent text-xl font-bold tracking-wide">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Code2 size={20} className="text-white" />
              </div>
              <span className="text-white">CodeMaster</span>
            </div>
          </NavLink>
        </div>
        <div className="flex items-center gap-4">
          <NavLink to="/" className="btn btn-sm bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition-all">
            <ArrowLeft size={16} /> Home
          </NavLink>
        </div>
      </nav>

      {/* Main Layout Grid */}
      <div className="container mx-auto p-4 lg:py-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Profile Sidebar (Takes ~33% width on large screens) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#151821] border border-gray-800 rounded-3xl shadow-xl overflow-hidden sticky top-24">
              {/* Banner */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                 <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-md transition-all"
                  title="Edit Profile"
                >
                  <Edit2 size={16} />
                </button>
              </div>
              
              <div className="px-6 pb-8 -mt-16 relative z-10 text-center">
                {/* Avatar */}
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gray-800 to-gray-900 p-1 ring-4 ring-[#151821] shadow-2xl mb-4">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                    {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-white mb-1">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-400 text-sm mb-4">{user.email}</p>

                <div className="flex justify-center mb-6">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                    user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {user.role}
                  </span>
                </div>

                <div className="divider border-gray-800 my-0"></div>

                {/* Vertical Details List */}
                <div className="space-y-4 text-left mt-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Award className="text-gray-500" size={18} />
                    <span className="text-gray-400 w-24">Solved</span>
                    <span className="text-white font-medium">{solvedProblems.length} Problems</span>
                  </div>
                  
                  {user.age && (
                    <div className="flex items-center gap-3 text-sm">
                      <User className="text-gray-500" size={18} />
                      <span className="text-gray-400 w-24">Age</span>
                      <span className="text-white font-medium">{user.age} Years Old</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="text-gray-500" size={18} />
                    <span className="text-gray-400 w-24">Joined</span>
                    <span className="text-white font-medium">{joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Activity & Solved Problems (Takes ~67% width) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Activity Heatmap Section */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Code2 size={22} className="text-blue-400" /> Activity Heatmap
              </h2>
              <ActivityHeatmap />
            </div>

            {/* Solved Problems Section */}
            <div className="bg-[#151821] border border-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col" style={{ maxHeight: '800px' }}>
              <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between bg-[#151821] z-10">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CheckCircle2 size={22} className="text-green-500" />
                  Solved Problems
                </h2>
                <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-medium text-gray-300">
                  {solvedProblems.length} Total
                </span>
              </div>
              
              {/* Scrollable List */}
              <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                {loadingSolved ? (
                  <div className="flex flex-col justify-center items-center py-16 gap-4">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                    <span className="text-gray-400">Loading your accomplishments...</span>
                  </div>
                ) : errorSolved ? (
                  <div className="text-center py-16 text-red-400 bg-red-500/10 rounded-xl border border-red-500/20">{errorSolved}</div>
                ) : solvedProblems.length === 0 ? (
                  <div className="text-center py-16 bg-[#1a1e2a] rounded-xl border border-gray-800">
                    <p className="text-gray-400 mb-4">You haven't solved any problems yet. Time to change that!</p>
                    <NavLink to="/" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors font-medium">
                      Start Practicing
                    </NavLink>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {solvedProblems.map((problem) => (
                      <NavLink
                        key={problem._id}
                        to={`/problem/${problem._id}`}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#1a1e2a] rounded-xl border border-gray-800 hover:border-gray-600 hover:bg-[#1e2330] transition-all gap-4"
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <CheckCircle2 size={18} className="text-green-500 mt-1 sm:mt-0 flex-shrink-0" />
                          <span className="text-gray-200 font-medium group-hover:text-blue-400 transition-colors">
                            {problem.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 self-start sm:self-auto pl-7 sm:pl-0">
                          <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                          <ChevronRight size={18} className="text-gray-600 group-hover:text-gray-300 transition-colors hidden sm:block" />
                        </div>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Edit Profile Modal (Remains Unchanged Logically, Styled to Match) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#151821] border border-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-[#1a1e2a]">
              <h3 className="text-xl font-bold text-white">Edit Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:bg-gray-800 hover:text-white p-1.5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              {updateError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                  <X size={16} className="mt-0.5 flex-shrink-0" /> {updateError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 bg-[#0f1117] border border-gray-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 bg-[#0f1117] border border-gray-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Age (Optional)</label>
                <input
                  type="number"
                  name="age"
                  value={editForm.age}
                  onChange={handleEditInputChange}
                  min="6"
                  max="80"
                  className="w-full px-4 py-2.5 bg-[#0f1117] border border-gray-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5 flex justify-between">
                  Email <span className="text-gray-600 text-xs">Uneditable</span>
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2.5 bg-[#0f1117]/50 border border-gray-800 rounded-xl text-gray-500 cursor-not-allowed opacity-70"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 bg-transparent border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 hover:text-white transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                >
                  {updating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;