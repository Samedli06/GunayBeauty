// Register.jsx
import React, { useState } from 'react';
import { useSignupMutation } from '../../store/API';
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [signup, { isLoading: isSignLoading }] = useSignupMutation();

  const togglePassword = () => setShowPassword(prev => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword(prev => !prev);

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const result = await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password.trim(),
        confirmPassword: formData.confirmPassword.trim()
      }).unwrap();

      toast.success("Qeydiyyat uğurla tamamlandı!");
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);

      const errorMessage = error?.data?.message ||
        (typeof error?.data === 'string' ? error.data : null) ||
        "Qeydiyyat zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.";

      toast.error(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="min-h-screen flex items-stretch font-sans bg-white selection:bg-[#4A041D] selection:text-white">
      {/* Left Side - Visual Branding (Desktop) */}
      <div className="hidden lg:flex w-1/2 bg-[#4A041D] flex-col justify-between p-16 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059] rounded-full blur-[150px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#970e42] rounded-full blur-[150px] opacity-30 -translate-x-1/3 translate-y-1/3"></div>

        {/* Content */}
        <div className="relative z-10 animate-fade-in-up">
          <Link to="/" className="inline-block">
            <h1 className="text-white text-3xl font-bold tracking-widest uppercase">Gunay Beauty</h1>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg text-white/90 animate-fade-in-up delay-100">
          <h2 className="text-5xl font-light mb-6 leading-tight">Gözəllik dünyasına<br /><span className="font-bold text-[#C5A059]">qoşulun.</span></h2>
          <p className="text-lg opacity-80 leading-relaxed font-light">
            Eksklüziv mükafatlar, daha sürətli alış-veriş və fərdi gözəllik tövsiyələri üçün bu gün hesabınızı yaradın.
          </p>
        </div>

        <div className="relative z-10 text-white/50 text-sm font-light flex items-center gap-4 animate-fade-in-up delay-200">
          <span>© {new Date().getFullYear()} Gunay Beauty</span>
          <div className="h-px w-8 bg-white/20"></div>
          <span>Şərtlər və Qaydalar</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 px-15 lg:p-16 relative bg-white overflow-y-auto">
        <Link to="/" className="absolute top-6 left-6 lg:hidden p-2 text-gray-500 hover:text-[#4A041D] transition-colors">
          <ArrowLeft size={24} />
        </Link>

        <div className="w-full max-w-[480px] space-y-8 animate-fade-in my-auto">
          {/* Logo for Mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/">
              <span className="text-[#4A041D] text-2xl font-bold tracking-widest uppercase">Gunay Beauty</span>
            </Link>
          </div>

          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold text-[#4A041D]">Hesab Yaradın</h2>
            <p className="text-gray-500">Qeydiyyatdan keçmək üçün məlumatlarınızı daxil edin</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="group space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 ml-1">Ad</label>
                <input
                  type="text"
                  required
                  name='firstName'
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all placeholder:text-gray-400 text-gray-900 focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] hover:bg-white hover:border-gray-300"
                  placeholder="Jane"
                />
              </div>
              <div className="group space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 ml-1">Soyad</label>
                <input
                  type="text"
                  required
                  name='lastName'
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all placeholder:text-gray-400 text-gray-900 focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] hover:bg-white hover:border-gray-300"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="group space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 ml-1">E-poçt ünvanı</label>
              <input
                type="email"
                required
                name='email'
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all placeholder:text-gray-400 text-gray-900 focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] hover:bg-white hover:border-gray-300"
                placeholder="name@example.com"
              />
            </div>

            <div className="group space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 ml-1">Telefon nömrəsi</label>
              <div className="flex relative transition-all duration-300 focus-within:ring-1 focus-within:ring-[#C5A059] focus-within:border-[#C5A059] rounded-xl overflow-hidden">
                <div className="flex items-center px-4 min-w-[80px] py-2.5 bg-gray-100 border border-r-0 border-gray-200 text-gray-600 text-xs font-medium whitespace-nowrap">
                  🇦🇿 +994
                </div>
                <input
                  type="tel"
                  required
                  name='phoneNumber'
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 outline-none transition-all placeholder:text-gray-400 text-gray-900 hover:bg-white hover:border-gray-300"
                  placeholder="XX XXX XX XX"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="group space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 ml-1">Şifrə</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    name='password'
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all placeholder:text-gray-400 text-gray-900 focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] hover:bg-white hover:border-gray-300 pr-12"
                    placeholder="Şifrə yaradın"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4A041D] transition-colors cursor-pointer p-1"
                    onClick={togglePassword}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <div className="group space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 ml-1">Şifrəni təsdiqləyin</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={8}
                    name='confirmPassword'
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all placeholder:text-gray-400 text-gray-900 focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] hover:bg-white hover:border-gray-300 pr-12"
                    placeholder="Şifrəni təsdiqləyin"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4A041D] transition-colors cursor-pointer p-1"
                    onClick={toggleConfirmPassword}
                  >
                    {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSignLoading}
                className="w-full bg-[#4A041D] hover:bg-[#600626] text-white text-sm py-3  rounded-xl font-bold tracking-wide transition-all duration-300 shadow-lg shadow-[#4A041D]/20 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isSignLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Hesab yaradılır...</span>
                  </div>
                ) : 'Qeydiyyat'}
              </button>
            </div>
          </form>

          <div className="pt-2 text-center text-sm text-gray-500">
            Artıq hesabınız var?{' '}
            <Link to="/login" className="font-bold text-[#4A041D] hover:text-[#C5A059] transition-colors">
              Daxil Ol
            </Link>
          </div>

          <div className="text-center">
            <Link to="/" className="text-xs font-medium text-gray-400 hover:text-[#4A041D] transition-colors decoration-slice">
              Qonaq olaraq davam et
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;