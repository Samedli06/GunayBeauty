// resetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useResetPasswordMutation } from '../../store/API';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: ''
  });
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false
  });
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!token) {
      toast.error('Yanlış və ya çatışmayan sıfırlama tokeni. Zəhmət olmasa yeni şifrə sıfırlama tələbi göndərin.');
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const togglePassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error('Şifrələr uyğun gəlmir.');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('Şifrə ən azı 8 simvoldan ibarət olmalıdır.');
      return;
    }

    try {
      await resetPassword({
        token,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword
      }).unwrap();

      toast.success('Şifrə uğurla sıfırlandı! İndi yeni şifrənizlə daxil ola bilərsiniz.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error("Reset password failed:", error);
      if (error?.status === 400) {
        toast.error(error?.data?.message || "Yanlış token və ya şifrə tələbləri ödənilmir.");
      } else {
        toast.error("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
      }
    }
  };

  if (!token) {
    return null;
  }

  if (!isDesktop) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="text-center mb-8 mt-4">
          <img
            className='mx-auto w-50'
            src="./Icons/logo.jpeg"
            alt=""
            style={{
              imageRendering: '-webkit-optimize-contrast',
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <button
            className="flex items-center text-gray-600 text-sm mb-6"
            onClick={() => navigate('/forgot-password')}
          >
            ← Geri
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Şifrəni sıfırla</h2>
          <p className="text-gray-600 text-sm mb-6">Zəhmət olmasa yadda saxlayacağınız bir şey yazın</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type={showPassword.newPassword ? "text" : "password"}
                required
                minLength={8}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Yeni şifrə"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform cursor-pointer -translate-y-1/2 text-gray-400"
                onClick={() => togglePassword('newPassword')}
              >
                {showPassword.newPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                required
                minLength={8}
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                placeholder="Yeni şifrəni təsdiqləyin"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform cursor-pointer -translate-y-1/2 text-gray-400"
                onClick={() => togglePassword('confirmPassword')}
              >
                {showPassword.confirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto text-white" size={28} /> : 'Şifrəni Sıfırla'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Artıq hesabınız var? <button type="button" className="text-blue-600" onClick={() => navigate('/login')}>Daxil olun</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 bg-white flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img
              className='mx-auto w-50'
              src="./Icons/logo.jpeg"
              alt=""
              style={{
                imageRendering: '-webkit-optimize-contrast',
                WebkitTransform: 'translateZ(0)',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            />
          </div>

          <div>
            <button
              className="flex items-center text-gray-600 text-sm mb-6"
              onClick={() => navigate('/forgot-password')}
            >
              ← Geri
            </button>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Şifrəni sıfırla</h2>
            <p className="text-gray-600 text-sm mb-8">Zəhmət olmasa yadda saxlayacağınız bir şey yazın</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  required
                  minLength={8}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Yeni şifrə"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-12"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 cursor-pointer transform -translate-y-1/2 text-gray-400"
                  onClick={() => togglePassword('newPassword')}
                >
                  {showPassword.newPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="Yeni şifrəni təsdiqləyin"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-12"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 cursor-pointer transform -translate-y-1/2 text-gray-400"
                  onClick={() => togglePassword('confirmPassword')}
                >
                  {showPassword.confirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition duration-200 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin mx-auto text-white" size={28} /> : 'Şifrəni Sıfırla'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Artıq hesabınız var? <button type="button" className="text-red-600 hover:underline cursor-pointer" onClick={() => navigate('/login')}>Daxil olun</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

