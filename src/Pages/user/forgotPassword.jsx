// forgotPassword.jsx
import React, { useState } from 'react';
import { useForgotPasswordMutation } from '../../store/API';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      toast.success('Password reset email sent! Please check your inbox.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error("Forgot password failed:", error);
      if (error?.status === 404) {
        toast.error("Email not found. Please check your email address.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-stretch font-sans bg-white selection:bg-[#4A041D] selection:text-white">
      {/* Left Side - Visual Branding (Desktop) */}
      <div className="hidden lg:flex w-1/2 bg-[#4A041D] flex-col justify-between p-16 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#C5A059] rounded-full blur-[150px] opacity-10 -translate-x-1/2 -translate-y-1/2"></div>

        {/* Content */}
        <div className="relative z-10 animate-fade-in-up">
          <Link to="/" className="inline-block">
            <h1 className="text-white text-3xl font-bold tracking-widest uppercase">Gunay Beauty</h1>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg text-white/90 animate-fade-in-up delay-100">
          <h2 className="text-5xl !text-[#FFFF98] font-light mb-6 leading-tight">Password<br /><span className="font-bold text-[#C5A059]">Recovery.</span></h2>
          <p className="text-lg opacity-80 leading-relaxed font-light">
            Don't worry, we'll help you get back to your account in no time.
          </p>
        </div>

        <div className="relative z-10 text-white/50 text-sm font-light flex items-center gap-4 animate-fade-in-up delay-200">
          <span>© {new Date().getFullYear()} Gunay Beauty Store</span>
          <div className="h-px w-8 bg-white/20"></div>
          <span>Support</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16 relative bg-white">
        <Link to="/login" className="absolute top-6 left-6 p-2 text-gray-500 hover:text-[#4A041D] transition-colors flex items-center gap-2 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Login</span>
        </Link>

        <div className="w-full max-w-[420px] space-y-8 animate-fade-in">
          {/* Logo for Mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/">
              <span className="text-[#4A041D] text-2xl font-bold tracking-widest uppercase">Gunay Beauty</span>
            </Link>
          </div>

          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold text-[#4A041D]">Forgot Password?</h2>
            <p className="text-gray-500">Enter your email and we'll send you instructions</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email Address</label>
              <div className="relative transition-all duration-300 focus-within:ring-1 focus-within:ring-[#C5A059] focus-within:border-[#C5A059] rounded-xl">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all placeholder:text-gray-400 text-gray-900 group-hover:bg-white group-hover:border-gray-300"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4A041D] hover:bg-[#600626] text-white py-4 rounded-xl font-bold tracking-wide transition-all duration-300 shadow-lg shadow-[#4A041D]/20 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Sending code...</span>
                </div>
              ) : 'Send Reset Code'}
            </button>
          </form>

          <div className="pt-2 text-center text-sm text-gray-500">
            Remember your password?{' '}
            <Link to="/login" className="font-bold text-[#4A041D] hover:text-[#C5A059] transition-colors">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

