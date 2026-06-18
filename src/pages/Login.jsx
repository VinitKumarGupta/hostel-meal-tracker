import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiMail, FiLock, FiUser, FiArrowRight, FiInfo } from 'react-icons/fi';

export const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'error' }
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Helper to trigger custom toast notifications
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Convert Firebase error codes into friendly user messages
  const getFriendlyErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please try again.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Try logging in.';
      case 'auth/weak-password':
        return 'Password is too weak. Make it at least 6 characters.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Input Validation
    if (!email.trim() || !password.trim()) {
      triggerToast('Please fill out all fields.', 'error');
      return;
    }

    if (isRegistering) {
      if (!name.trim()) {
        triggerToast('Please enter your name.', 'error');
        return;
      }
      if (password !== confirmPassword) {
        triggerToast('Passwords do not match.', 'error');
        return;
      }
      if (password.length < 6) {
        triggerToast('Password must be at least 6 characters.', 'error');
        return;
      }
    }

    setLoading(true);
    try {
      if (isRegistering) {
        await register(name, email, password);
        triggerToast('Account created successfully!', 'success');
      } else {
        await login(email, password);
        triggerToast('Successfully logged in!', 'success');
      }
      
      // Small delay for toast visibility before navigating
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      console.error("Authentication error: ", err);
      triggerToast(getFriendlyErrorMessage(err), 'error');
      setLoading(false);
    }
  };

  // Toggle Forms and Clear inputs
  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-indigo-100/50 p-4 sm:p-6 md:p-8 relative overflow-hidden">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center space-x-2 px-5 py-3.5 rounded-2xl shadow-xl border animate-in fade-in slide-in-from-top-4 duration-300 ${
          toast.type === 'error' 
            ? 'bg-red-50 text-red-800 border-red-100' 
            : 'bg-emerald-50 text-emerald-800 border-emerald-100'
        }`}>
          <FiInfo className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/20 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/20 blur-3xl" />

      {/* Centered Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl shadow-slate-100/80 border border-gray-100/80 relative z-10 transform transition-all">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-indigo-600 text-white font-extrabold text-2xl h-14 w-14 rounded-2xl shadow-lg shadow-indigo-200 mb-4">
            HM
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Hostel Meal Tracker</h1>
          <p className="text-gray-400 text-sm mt-1.5">
            {isRegistering ? 'Join your roommates and track meals' : 'Sign in to access your meal tracker'}
          </p>
        </div>

        {/* Action Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name Field (Sign Up Mode Only) */}
          {isRegistering && (
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FiUser className="h-5 w-5" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Vinit Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50/60 border border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-gray-800 font-medium transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <FiMail className="h-5 w-5" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="roommate@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50/60 border border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-gray-800 font-medium transition-all duration-200 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <FiLock className="h-5 w-5" />
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50/60 border border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-gray-800 font-medium transition-all duration-200 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Confirm Password (Sign Up Mode Only) */}
          {isRegistering && (
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FiLock className="h-5 w-5" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50/60 border border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-gray-800 font-medium transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-2xl transition-all duration-150 shadow-lg shadow-indigo-100 hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base mt-2"
          >
            <span>{loading ? (isRegistering ? 'Creating Account...' : 'Signing In...') : (isRegistering ? 'Create Account' : 'Sign In')}</span>
            {!loading && <FiArrowRight className="h-5 w-5" />}
          </button>
        </form>

        {/* Toggle Anchor */}
        <div className="text-center mt-6 pt-6 border-t border-gray-50">
          <button
            type="button"
            onClick={toggleMode}
            className="text-indigo-600 hover:text-indigo-700 font-bold text-sm transition-colors duration-150 focus:outline-none focus:underline"
          >
            {isRegistering ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
