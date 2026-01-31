import React, { useState, useEffect } from 'react'

import { Breadcrumb } from '../../products/Breadcrumb'
import { useChangePasswordMutation, useGetMeQuery, useLogoutMutation, useGetMyOrdersQuery } from '../../store/API'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { CloudCog, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Gift, Package, Clock, CheckCircle, ChevronRight, CreditCard, Award, User as UserIcon } from 'lucide-react';

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: me, isLoading: isUserLoading, error: userError } = useGetMeQuery();
  const [changePass, { isLoading: isPasswordLoading, error: passwordError }] = useChangePasswordMutation();
  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const { data: orders = [], isLoading: isOrdersLoading } = useGetMyOrdersQuery();
  console.log(orders)

  const [newPass, setNewPass] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Logout confirmation modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Animation state
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animations on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const roleNames = {
    0: 'Admin Role',
    1: t('profile.normalUser'),
    2: t('profile.retail'),
    3: t('profile.wholesale'),
    4: t('profile.vip')
  };

  const getRoleName = (roleId) => {
    return roleNames[roleId] || t('profile.unknownRole');
  };

  const toggleCurrentPasswordVisibility = () => setShowCurrentPassword(!showCurrentPassword);
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);

  const getApiErrorMessage = (error) => {
    if (error?.status === 401) return t('profile.unauthorizedMessage');
    if (error?.data?.message) return error.data.message;
    if (error?.message) return error.message;
    return t('profile.errorOccurred');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (currentPassword === newPass && currentPassword !== '') {
      // Simple validation
      return;
    }
    try {
      const passwordData = {
        currentPass: currentPassword,
        newPass: newPass,
        confirmNewPassword: newPass
      };

      await changePass(passwordData).unwrap();
      setCurrentPassword('');
      setNewPass('');
      setSuccessMessage(t('profile.passwordChangedSuccess'));
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to change password:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      toast.success(t('profile.loggedOutSuccess'));
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
      toast.error(t('profile.logoutFailed'));
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-[#FDFBF8]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A041D]"></div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-[#FDFBF8]">
        <div className="text-[#4A041D] font-sans">{getApiErrorMessage(userError)}</div>
      </div>
    )
  }
  // Loyalty points (Static for now as API doesn't provide them yet)
  const loyaltyPoints = 1250;
  const nextTierPoints = 2000;
  const progress = (loyaltyPoints / nextTierPoints) * 100;


  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'Shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <section className='bg-[#FDFBF8] min-h-screen pb-20 pt-8 font-sans'>
      {/* Styles for animations */}
      <style>{`
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.4s ease-out forwards; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-[#4A041D]/40 backdrop-blur-sm flex items-center justify-center z-[5000] px-4 animate-fade-in-up">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#4A041D]/5 rounded-full flex items-center justify-center mb-4">
                <LogIn className="w-8 h-8 text-[#4A041D] ml-1" />
              </div>
              <h3 className="text-xl font-bold text-[#4A041D] mb-2 font-sans">{t('profile.confirmLogout')}</h3>
              <p className="text-gray-500 mb-6 text-sm font-sans">{t('profile.logoutMessage')}</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-sans font-medium hover:bg-gray-50 transition-colors">
                  {t('profile.cancel')}
                </button>
                <button onClick={handleLogout} className="flex-1 py-3 bg-[#4A041D] text-white rounded-xl font-sans font-medium hover:bg-[#7d1733] transition-colors shadow-lg shadow-[#4A041D]/20">
                  {isLogoutLoading ? t('profile.loggingOut') : t('profile.logout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`max-w-[1200px] mx-auto px-4 lg:px-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Breadcrumb />
            <h1 className="text-3xl lg:text-4xl font-sans font-bold text-[#4A041D] mt-4 mb-2">
              {t('Hello')}, {me?.firstName}!
            </h1>
            <p className="text-[#9E2A2B] font-sans text-sm tracking-wide">
              {t('profile.welcomeBack')} | <span className="font-semibold">{getRoleName(me?.role)}</span>
            </p>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 border border-[#4A041D] text-[#4A041D] rounded-full hover:bg-[#4A041D] hover:text-white transition-all duration-300 font-sans font-medium text-sm button-hover shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            {t('profile.logout')}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Loyalty & Stats */}
          <div className="lg:col-span-1 space-y-8">

            {/* Loyalty Card */}
            <div className="bg-gradient-to-br from-[#4A041D] to-[#7d1733] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#C5A059]/30 rounded-full -ml-12 -mb-12 blur-lg group-hover:scale-125 transition-transform duration-700"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-sans font-medium opacity-90 !text-white">{t('Brand Loyalty')}</h3>
                    <div className="text-3xl font-sans font-bold mt-1 tracking-tight">{loyaltyPoints} <span className="text-sm font-normal opacity-70">pts</span></div>
                  </div>
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                    <Award className="w-6 h-6 text-[#C5A059]" />
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs font-sans tracking-wider uppercase opacity-80">
                    <span>{t('Member')}</span>
                    <span>{t('Gold')}</span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#C5A059] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="text-xs opacity-70 text-right font-sans">
                    {nextTierPoints - loyaltyPoints} {t('points to Gold Tier')}
                  </div>
                </div>

                <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl font-sans text-sm font-medium transition-colors border border-white/10 flex items-center justify-center gap-2 backdrop-blur-md">
                  <Gift className="w-4 h-4" />
                  {t('Redeem Rewards')}
                </button>
              </div>
            </div>

            {/* Quick Stats or Info */}
            <div className="bg-white rounded-2xl border border-[#F3E7E1] p-6 shadow-sm">
              <h3 className="text-[#4A041D] font-sans font-bold mb-4 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-[#C5A059]" />
                {t('Account Overview')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#FDFBF8] rounded-xl border border-[#F3E7E1]/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-gray-600 font-sans">{t('Total Orders')}</span>
                  </div>
                  <span className="font-bold text-[#4A041D]">{orders.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#FDFBF8] rounded-xl border border-[#F3E7E1]/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-gray-600 font-sans">{t('Credits')}</span>
                  </div>
                  <span className="font-bold text-[#4A041D]">₼ 0.00</span>
                </div>
              </div>
            </div>

            {/* Update Password */}
            <div className="bg-white rounded-2xl border border-[#F3E7E1] p-6 shadow-sm">
              <h3 className="text-[#4A041D] font-sans font-bold mb-4">{t('Security')}</h3>
              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200 font-sans flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {successMessage}
                </div>
              )}
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder={t('Current Password')}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F9F9F9] border border-[#DEE2E6] rounded-xl text-sm focus:outline-none focus:border-[#4A041D]/50 focus:ring-1 focus:ring-[#4A041D]/20 transition-all font-sans"
                  />
                </div>
                <div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder={t('New Password')}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F9F9F9] border border-[#DEE2E6] rounded-xl text-sm focus:outline-none focus:border-[#4A041D]/50 focus:ring-1 focus:ring-[#4A041D]/20 transition-all font-sans"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPasswordLoading || !currentPassword || !newPass}
                  className="w-full py-2.5 bg-[#4A041D] text-white rounded-xl font-sans font-medium text-sm hover:bg-[#7d1733] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#4A041D]/20"
                >
                  {isPasswordLoading ? t('Updating...') : t('Update Password')}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Order History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#F3E7E1] p-6 lg:p-8 shadow-sm h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-sans font-bold text-[#4A041D]">{t('Order History')}</h2>
                <button className="text-[#C5A059] text-sm font-sans font-medium hover:text-[#9E2A2B] transition-colors">
                  {t('View All Orders')}
                </button>
              </div>

              <div className="space-y-4">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div key={order.id} className="group border border-[#F3E7E1] rounded-xl p-4 lg:p-5 hover:border-[#C5A059]/50 hover:shadow-md transition-all duration-300 bg-[#FDFBF8]/50">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-[#4A041D]/5 rounded-lg group-hover:bg-[#4A041D]/10 transition-colors">
                            <Package className="w-6 h-6 text-[#4A041D]" />
                          </div>
                          <div>
                            <h4 className="font-sans font-bold text-[#4A041D] text-sm md:text-base mb-1">#{order.id.slice(0, 8)}</h4>
                            <div className="flex items-center gap-3 text-xs text-gray-500 font-sans">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                              <span>•</span>
                              <span>{order.items?.length || 0} {t('Items')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 lg:gap-8">
                          <div className="text-right">
                            <div className="font-sans font-bold text-[#4A041D]">₼ {order.totalAmount?.toFixed(2)}</div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-sans font-medium border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <button className="p-2 text-gray-400 hover:text-[#4A041D] hover:bg-[#4A041D]/5 rounded-lg transition-all hidden sm:block">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end md:hidden">
                        <button className="text-xs font-sans font-bold text-[#C5A059] uppercase tracking-wider">
                          {t('View Details')}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-gray-900 font-medium font-sans mb-1">{t('No orders yet')}</h3>
                    <p className="text-gray-500 text-sm font-sans">{t('Start shopping to earn loyalty points!')}</p>
                    <button onClick={() => navigate('/products')} className="mt-4 px-6 py-2 bg-[#4A041D] text-white rounded-lg text-sm font-sans hover:bg-[#7d1733] transition-colors">
                      {t('Browse Products')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile