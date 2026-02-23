import { useState } from 'react';
import { Menu, X, Package, CreditCard, ShoppingBag, Grid3X3, Users, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight, Home, User, Filter, Tags, File, Navigation, Icon, Store, Ticket, ChevronDown, Gift, Sparkles } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useLogoutMutation } from '../../store/API';
import { PiFlagBanner } from 'react-icons/pi';


const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  const [logout, { isLoading: isLoading }] = useLogoutMutation();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSubMenu = (label) => {
    if (isCollapsed) setIsCollapsed(false);
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const menuItems = [
    { icon: User, label: 'İstifadəçilər', to: '/admin' },
    { icon: Package, label: 'Məhsullar', to: 'products' },
    { icon: Grid3X3, label: 'Kateqoriyalar', to: 'category' },
    { icon: PiFlagBanner, label: 'Bannerlər', to: 'banners' },
    { icon: Filter, label: 'Filterlər', to: 'filters' },
    { icon: Tags, label: 'Filter Təyinatı', to: 'product-filters' },
    { icon: Store, label: 'Brendlər', to: 'brands' },
    {
      icon: Ticket,
      label: 'Marketinq',
      children: [
        { label: 'Promokodlar', to: 'promo-codes', icon: Ticket },
        { label: 'Loyallıq', to: 'loyalty', icon: Gift },
        { label: 'Gözəllik Testi', to: 'quiz', icon: Sparkles }
      ]
    },
    { icon: ShoppingBag, label: 'Sifarişlər', to: 'orders' },
    { icon: CreditCard, label: 'Hissəli Ödəniş', to: 'payment' },
  ];


  const navHome = () => {
    navigate('/')
  }
  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleClick = async () => {
    try {
      const result = await logout().unwrap()
    } catch (error) {
      console.log(error)
    }
    document.cookie.split(";").forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
    navigate('/login')

  }

  const isActive = (to) => {
    if (!to) return false;
    if (to === '/admin' && location.pathname === '/admin') return true;
    return location.pathname.includes(to) && to !== '/admin';
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`
        fixed top-0 left-0 bg-black text-white shadow-lg z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${isCollapsed ? 'w-16' : 'w-64'}
        lg:translate-x-0 lg:relative lg:h-screen overflow-y-auto scrollbar-hide
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700 sticky top-0 bg-black z-10">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8  rounded-lg flex items-center justify-center">
                <img className=' w-6 h-6 rounded-xl' src="/Icons/logo2.jpeg" alt="" />
              </div>
              <h1 className="text-xl font-bold !text-white">Admin Paneli</h1>
            </div>
          )}

          <button
            onClick={toggleCollapse}
            className="hidden lg:block p-1 hover:bg-gray-700 rounded"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.children ? (
                  // Dropdown Menu Item
                  <div>
                    <button
                      onClick={() => toggleSubMenu(item.label)}
                      className={`
                        w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-gray-700 hover:text-white
                        ${isCollapsed ? 'justify-center' : ''}
                        ${item.children.some(child => isActive(child.to)) ? 'bg-gray-800 text-white' : ''}
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon size={20} className="flex-shrink-0" />
                        {!isCollapsed && <span className="font-medium">{item.label}</span>}
                      </div>
                      {!isCollapsed && (
                        expandedMenus[item.label] ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                      )}
                    </button>

                    {/* Submenu */}
                    {!isCollapsed && expandedMenus[item.label] && (
                      <ul className="pl-4 mt-2 space-y-2 animate-fade-in-down">
                        {item.children.map((child, childIndex) => (
                          <li key={childIndex}>
                            <Link
                              to={child.to}
                              className={`
                                flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 text-sm
                                ${isActive(child.to) ? 'bg-[#C5A059] text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}
                              `}
                            >
                              <child.icon size={16} />
                              <span>{child.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  // Standard Menu Item
                  <Link
                    to={item.to}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200
                      ${isCollapsed ? 'justify-center' : ''}
                      ${isActive(item.to) ? 'bg-[#C5A059] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                    `}
                  >
                    <item.icon size={20} className="flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-gray-700 p-4">
          {!isCollapsed && (
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <Users size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Günay</p>
              </div>
            </div>
          )}

          <button onClick={handleClick} className={`
            w-full flex items-center space-x-3 px-3 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors duration-200
            ${isCollapsed ? 'justify-center' : ''}
          `}>
            <LogOut size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Çıxış et</span>}
          </button>

          <button onClick={navHome} className={`
            w-full flex items-center space-x-3 px-3 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors duration-200
            ${isCollapsed ? 'justify-center' : ''}
          `}>
            <Navigation size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Əsas səhifə</span>}
          </button>
        </div>
      </aside>

    </>
  );
};

export default SideBar;