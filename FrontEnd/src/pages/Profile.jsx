// pages/Profile.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router';
import { 
  User, Mail, Calendar, Award, Shield, Edit2, ArrowLeft, Code2, 
  CheckCircle2, Loader2, ChevronRight, X, Save 
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { updateUser } from '../slices/authSlice'; // Import the new action

function Profile() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // State for solved problems
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loadingSolved, setLoadingSolved] = useState(false);
  const [errorSolved, setErrorSolved] = useState(null);

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    age: ''
  });
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch solved problems
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

  // Populate edit form when modal opens
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

    // Basic validation
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
      
      // Update Redux store
      dispatch(updateUser(data.user));
      
      // Close modal
      setIsEditModalOpen(false);
    } catch (error) {
      setUpdateError(error.response?.data?.error || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
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
          <NavLink to="/" className="btn btn-sm bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white">
            <ArrowLeft size={16} /> Back to Home
          </NavLink>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-4 lg:p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">View and manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Header with avatar and name */}
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 px-6 py-8 border-b border-gray-700">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-400 flex items-center gap-1 mt-1">
                  <Mail size={14} /> {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="text-blue-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-400">Full Name</p>
                  <p className="text-white font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="text-blue-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-400">Email Address</p>
                  <p className="text-white font-medium break-all">{user.email}</p>
                </div>
              </div>
              {user.age && (
                <div className="flex items-start gap-3">
                  <Calendar className="text-blue-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-400">Age</p>
                    <p className="text-white font-medium">{user.age} years</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="text-blue-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-400">Role</p>
                  <p className="text-white font-medium capitalize">{user.role}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="text-blue-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-400">Problems Solved</p>
                  <p className="text-white font-medium">{solvedProblems.length}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="text-blue-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="text-white font-medium">{joinDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-900/30 border-t border-gray-700 flex justify-end gap-3">
            <button
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition flex items-center gap-2"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit2 size={16} /> Edit Profile
            </button>
          </div>
        </div>

        {/* Solved Problems Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-400" />
              Solved Problems
            </h2>
            <span className="text-sm text-gray-400">{solvedProblems.length} total</span>
          </div>
          <div className="p-6">
            {loadingSolved && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="animate-spin text-blue-500" size={32} />
                <span className="ml-3 text-gray-400">Loading solved problems...</span>
              </div>
            )}
            {errorSolved && (
              <div className="text-center py-8 text-red-400">{errorSolved}</div>
            )}
            {!loadingSolved && !errorSolved && solvedProblems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">You haven't solved any problems yet.</p>
                <NavLink to="/" className="btn btn-sm mt-4 bg-blue-600 text-white hover:bg-blue-500">
                  Start Solving
                </NavLink>
              </div>
            )}
            {!loadingSolved && solvedProblems.length > 0 && (
              <div className="space-y-3">
                {solvedProblems.map((problem) => (
                  <NavLink
                    key={problem._id}
                    to={`/problem/${problem._id}`}
                    className="block group"
                  >
                    <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-xl border border-gray-700 hover:border-gray-600 transition-all">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-green-400" />
                        <span className="text-white font-medium group-hover:text-blue-300 transition">
                          {problem.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        <ChevronRight size={16} className="text-gray-500 group-hover:text-gray-300" />
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">Edit Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {updateError && (
                <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-2 rounded-lg text-sm">
                  {updateError}
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-400 mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={editForm.firstName}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-2 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={editForm.lastName}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-2 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Age (optional)</label>
                <input
                  type="number"
                  name="age"
                  value={editForm.age}
                  onChange={handleEditInputChange}
                  min="6"
                  max="80"
                  className="w-full px-4 py-2 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Email (cannot be changed)</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 bg-gray-900/30 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
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