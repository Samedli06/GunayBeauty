import { useState } from 'react';
import { Menu, X, Package, ShoppingBag, Grid3X3, Users, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight, Home, User, Filter, Tags, File, Navigation, Icon, Store, Ticket } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useLogoutMutation } from '../../store/API';
import { PiFlagBanner } from 'react-icons/pi';


const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [logout, { isLoading: isLoading }] = useLogoutMutation();


  const menuItems = [
    { icon: User, label: 'İstifadəçilər', active: false, to: '/admin' },
    { icon: Package, label: 'Məhsullar', active: true, to: 'products' },
    { icon: Grid3X3, label: 'Kateqoriyalar', active: false, to: 'category' },
    { icon: PiFlagBanner, label: 'Bannerlər', active: false, to: 'banners' },
    { icon: Filter, label: 'Filterlər', active: false, to: 'filters' },
    { icon: Tags, label: 'Filter Təyinatı', active: false, to: 'product-filters' },
    { icon: File, label: 'Fayl Təyinatı', active: false, to: 'file-management' },
    { icon: Store, label: 'Brendlər', active: false, to: 'brands' },
    { icon: Ticket, label: 'Promokodlar', active: false, to: 'promo-codes' },
    { icon: ShoppingBag, label: 'Sifarişlər', active: false, to: 'orders' },
  ];


  const navHome = () => {
    navigate('/')
  }
  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const navigate = useNavigate()
  const handleClick = async () => {
    try {
      const result = await logout().unwrap()
    } catch {
      toast.error(error?.data?.slice(1, 100) || "Kateqoriyanın redaktəsi uğursuz oldu");

    }
    document.cookie.split(";").forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
    navigate('/login')

  }
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
        lg:translate-x-0 lg:relative lg:h-screen
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <img className=' w-6 h-6 ' src="/Icons/logo2.png" alt="" />
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
                <Link to={item.to} className={`
                  w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  ${isCollapsed ? 'justify-center' : ''}
                `}>
                  <item.icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
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
                <p className="text-sm font-medium text-white truncate">Bextiyar</p>
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