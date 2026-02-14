import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Eye, EyeOff, Loader2, Code2, Mail, User, Lock, ArrowRight, Sparkles 
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { registerUser } from "../slices/authSlice";

// Schema (Unchanged)
const signUpSchema = z.object({
  firstName: z.string().min(3, "First name should contain at least 3 characters"),
  lastName: z.string().min(3, "Last name should contain at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password should contain at least 8 characters"),
});

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const submittedData = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-black font-sans selection:bg-indigo-500/30">
      
      {/* --- Animations --- */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.1); }
          50% { box-shadow: 0 0 25px rgba(99, 102, 241, 0.4); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .input-glow:focus-within { 
          border-color: #6366f1; 
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
        }
      `}</style>

      {/* --- Background Layer --- */}
      <div className="absolute inset-0 z-0">
        {/* Background Image - Darkened significantly to match "Black" theme */}
        <img 
          src="https://cdn.pixabay.com/photo/2016/11/29/11/39/computer-1869236_1280.jpg" 
          alt="Server Background" 
          className="w-full h-full object-cover opacity-40 grayscale-[20%]"
        />
        
        {/* Black Gradient Overlays */}
        {/* Mobile: Fade to black on top/bottom. Desktop: Fade to pure black on the right. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/80 to-black lg:bg-gradient-to-r lg:from-transparent lg:via-black/60 lg:to-black"></div>
        
        {/* Subtle Blue/Indigo Tint to keep the 'Tech' feel alive in the darkness */}
        <div className="absolute inset-0 bg-indigo-950/20 mix-blend-overlay"></div>
      </div>

      {/* --- Main Content Container --- */}
      <div className="w-full flex flex-col lg:flex-row items-center lg:justify-end justify-center p-4 sm:p-6 lg:p-12 relative z-10 h-full">
        
        {/* --- Form Section --- */}
        <div className="w-full max-w-[500px] lg:mr-16 animate-fade-in-up">
          
          {/* Form Card */}
          <div className="relative group">
            {/* Ambient Back Glow (Subtle Indigo) */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-900 to-blue-900 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            {/* Darker Glass Container */}
            <div className="relative p-8 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/5 shadow-2xl">
              
              {/* Close Button */}
              <button
                onClick={() => navigate('/')}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full group/btn"
                title="Back to Home"
              >
                <XCircleIcon className="group-hover/btn:rotate-90 transition-transform duration-300" />
              </button>

              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 shadow-lg shadow-indigo-500/10">
                    <Code2 size={24} className="text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">CodeMaster</h1>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                  Get Started <Sparkles size={24} className="text-indigo-500 animate-pulse" />
                </h2>
                <p className="text-gray-400 font-medium">Join the elite community of developers.</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-200 text-sm flex items-center gap-3 animate-fade-in-up">
                  <AlertCircleIcon />
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(submittedData)} className="space-y-5">
                
                {/* Names Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in-up delay-100">
                  <div className="group/input">
                    <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 ml-1">First Name</label>
                    <div className="relative input-glow rounded-xl transition-all duration-300">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-indigo-400 transition-colors">
                        <User size={18} />
                      </div>
                      <input
                        {...register("firstName")}
                        placeholder="John"
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:bg-black/50 focus:border-indigo-500 focus:ring-0 outline-none transition-all duration-300"
                      />
                    </div>
                    {errors.firstName && <p className="text-red-400 text-xs mt-1.5 ml-1 flex items-center gap-1">● {errors.firstName.message}</p>}
                  </div>

                  <div className="group/input">
                    <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 ml-1">Last Name</label>
                    <div className="relative input-glow rounded-xl transition-all duration-300">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-indigo-400 transition-colors">
                        <User size={18} />
                      </div>
                      <input
                        {...register("lastName")}
                        placeholder="Doe"
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:bg-black/50 focus:border-indigo-500 focus:ring-0 outline-none transition-all duration-300"
                      />
                    </div>
                    {errors.lastName && <p className="text-red-400 text-xs mt-1.5 ml-1 flex items-center gap-1">● {errors.lastName.message}</p>}
                  </div>
                </div>

                {/* Email */}
                <div className="group/input animate-fade-in-up delay-200">
                  <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                  <div className="relative input-glow rounded-xl transition-all duration-300">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-indigo-400 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      {...register("email")}
                      placeholder="dev@codemaster.com"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:bg-black/50 focus:border-indigo-500 focus:ring-0 outline-none transition-all duration-300"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1 flex items-center gap-1">● {errors.email.message}</p>}
                </div>

                {/* Password */}
                <div className="group/input animate-fade-in-up delay-300">
                  <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 ml-1">Password</label>
                  <div className="relative input-glow rounded-xl transition-all duration-300">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-indigo-400 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:bg-black/50 focus:border-indigo-500 focus:ring-0 outline-none transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1 flex items-center gap-1">● {errors.password.message}</p>}
                </div>

                {/* Submit Button */}
                <div className="animate-fade-in-up delay-300 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`group w-full py-4 px-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden shadow-lg
                      ${loading 
                        ? 'bg-gray-800 cursor-not-allowed opacity-70' 
                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
                      }`}
                  >
                    {!loading && <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>}
                    
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Initializing...</span>
                      </>
                    ) : (
                      <>
                        Create Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center animate-fade-in-up delay-300">
                <p className="text-gray-400 text-sm">
                  Already have an account?{" "}
                  <NavLink 
                    to="/login" 
                    className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors relative inline-block group"
                  >
                    Log In
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
                  </NavLink>
                </p>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="mt-8 text-center animate-fade-in-up delay-300">
            <p className="text-gray-600 text-[10px] tracking-[0.2em] uppercase font-bold opacity-60 hover:opacity-100 transition-opacity">
              Weather your goal • We'll get you there
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles for the shimmer effect
const shimmerStyle = `
  @keyframes shimmer {
    100% { transform: translateX(100%); }
  }
`;

// Helper icons specifically for this file to keep it self-contained
const XCircleIcon = ({className}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
)

const AlertCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
)

export default Signup;