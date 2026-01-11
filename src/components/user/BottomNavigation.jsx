import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Home, Store, User, Percent, Grid } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AuthUtils from '../UI/AuthUtils';

const BottomNavigation = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(AuthUtils.isAuthenticated());
    }, [location]); // Re-check on navigation

    const navItems = [
        {
            label: t('Home') || 'Home',
            icon: Home,
            path: '/',
        },
        {
            label: t('Shop') || 'Shop',
            icon: Store,
            path: '/products',
        },
        {
            label: t('Offers') || 'Offers',
            icon: Percent,
            path: '/products/hot-deals',
        },
        {
            label: t('Brands') || 'Brands',
            icon: Grid,
            path: '/brands',
        },
        {
            label: t('Profile') || 'Profile',
            icon: User,
            path: isAuthenticated ? '/profile' : '/login',
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#4A041D]/10 px-6 py-2 z-50 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {navItems.map((item) => {
                    let isActive = false;

                    if (item.path === '/') {
                        isActive = location.pathname === '/';
                    } else if (item.path === '/products') {
                        // Shop should be active for products but NOT for hot-deals which has its own tab
                        isActive = location.pathname.startsWith('/products') && !location.pathname.includes('/products/hot-deals');
                    } else {
                        // Standard prefix match for others (including hot-deals, profile, brands)
                        isActive = location.pathname.startsWith(item.path);
                    }

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex flex-col items-center gap-1 min-w-[3.5rem]"
                        >
                            <div
                                className={`p-1.5 rounded-full transition-all duration-300 ${isActive
                                    ? 'text-[#4A041D] bg-[#4A041D]/10 translate-y-[-2px]'
                                    : 'text-gray-400 hover:text-[#4A041D]'
                                    }`}
                            >
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span
                                className={`text-[10px] font-sans uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-[#4A041D] font-bold' : 'text-gray-400'
                                    }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNavigation;
