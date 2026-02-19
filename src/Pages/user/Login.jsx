// Login.jsx
import React, { useState, useEffect } from 'react';
import { useLoginMutation, useAddCartItemMutation } from '../../store/API';
import { jwtDecode } from "jwt-decode";
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [addCartItem] = useAddCartItemMutation();

  const syncCart = async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem('ecommerce_cart')) || { items: [] };
      if (localCart.items && localCart.items.length > 0) {
        console.log("🔄 Syncing local cart to server...", localCart.items);

        // Sync each item to the server
        const syncPromises = localCart.items.map(item =>
          addCartItem({
            productId: item.productId,
            quantity: item.quantity
          }).unwrap()
        );

        await Promise.all(syncPromises);
        console.log("✅ Cart synced successfully");

        // Clear local cart after successful sync
        localStorage.removeItem('ecommerce_cart');
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { items: [], totalAmount: 0 } }));
      }
    } catch (error) {
      console.error("❌ Cart sync failed:", error);
      // We don't block the login process if sync fails, but we log it
    }
  };

  const togglePassword = () => setShowPassword(prev => !prev);

  const setCookie = (name, value, expiresAt) => {
    const expires = "expires=" + new Date(expiresAt).toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax; Secure`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      }).unwrap();

      setCookie("token", result.token, result.expiresAt);
      const token = jwtDecode(result.token);

      if (token.role != "Admin") {
        // Sync cart before redirecting
        await syncCart();

        if (from && from !== '/') {
          navigate(from, { replace: true });
        } else {
          window.location.href = '/'
        }
      } else {
        navigate("/admin");
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error?.status === 401) {
        toast.error("E-poçt və ya şifrə yanlışdır");
      } else {
        toast.error("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
      }
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
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#C5A059] rounded-full blur-[150px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#970e42] rounded-full blur-[150px] opacity-30 translate-x-1/3 translate-y-1/3"></div>

        {/* Content */}
        <div className="relative z-10 animate-fade-in-up">
          <Link to="/" className="inline-block">
            <h1 className="!text-[#C5A059] text-3xl font-bold tracking-widest uppercase">Gunay Beauty</h1>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg text-white/90 animate-fade-in-up delay-100">
          <h2 className="text-5xl font-light mb-6 leading-tight">Yenidən xoş gəldiniz,<br /><span className="font-bold text-[#C5A059]">Hörmətli müştəri.</span></h2>
          <p className="text-lg opacity-80 leading-relaxed font-light">
            Fərdi gözəllik profilinizə daxil olmaq, sifarişlərinizi izləmək və sizə özəl təklifləri kəşf etmək üçün daxil olun.
          </p>
        </div>

        <div className="relative z-10 text-white/50 text-sm font-light flex items-center gap-4 animate-fade-in-up delay-200">
          <span>© {new Date().getFullYear()} Gunay Beauty</span>
          <div className="h-px w-8 bg-white/20"></div>
          <span>Məxfilik Siyasəti</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 px-15 lg:p-16 relative bg-white">
        <Link to="/" className="absolute top-6 left-6 lg:hidden p-2 text-gray-500 hover:text-[#4A041D] transition-colors">
          <ArrowLeft size={24} />
        </Link>

        <div className="w-full max-w-[420px] space-y-8 animate-fade-in">
          {/* Logo for Mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/">
              <span className="text-[#4A041D] text-2xl font-bold tracking-widest uppercase">Gunay Beauty</span>
            </Link>
          </div>

          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold text-[#4A041D]">Daxil Ol</h2>
            <p className="text-gray-500">Davam etmək üçün məlumatlarınızı daxil edin</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">E-poçt ünvanı</label>
                <div className="relative transition-all duration-300 focus-within:ring-1 focus-within:ring-[#C5A059] focus-within:border-[#C5A059] rounded-xl">
                  <input
                    type="email"
                    required
                    name='email'
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all placeholder:text-gray-400 text-gray-900 group-hover:bg-white group-hover:border-gray-300"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="text-sm font-medium text-gray-700">Şifrə</label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-[#4A041D] hover:text-[#C5A059] transition-colors">
                    Şifrəni unutmusunuz?
                  </Link>
                </div>
                <div className="relative transition-all duration-300 focus-within:ring-1 focus-within:ring-[#C5A059] focus-within:border-[#C5A059] rounded-xl">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    name='password'
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all placeholder:text-gray-400 text-gray-900 pr-12 group-hover:bg-white group-hover:border-gray-300"
                    placeholder="Şifrənizi daxil edin"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4A041D] transition-colors cursor-pointer p-1"
                    onClick={togglePassword}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoginLoading}
              className="w-full bg-[#4A041D] hover:bg-[#600626] text-white text-sm py-3  rounded-xl font-bold tracking-wide transition-all duration-300 shadow-lg shadow-[#4A041D]/20 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoginLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Daxil olunur...</span>
                </div>
              ) : 'Daxil Ol'}
            </button>
          </form>

          <div className="pt-2 text-center text-sm text-gray-500">
            Hesabınız yoxdur?{' '}
            <Link to="/register" className="font-bold text-[#4A041D] hover:text-[#C5A059] transition-colors">
              Hesab yaradın
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

export default Login;


