import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Home, Store, User, Percent, Grid, Tag } from 'lucide-react';

import AuthUtils from '../UI/AuthUtils';

const BottomNavigation = () => {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(AuthUtils.isAuthenticated());
    }, [location]); // Re-check on navigation

    const navItems = [
        {
            label: 'Ana Səhifə',
            icon: Home,
            path: '/',
        },
        {
            label: 'Kampaniyalar',
            icon: Percent,
            path: '/products/hot-deals',
        },
        {
            label: 'Kateqoriyalar',
            icon: Grid,
            path: '/categories',
        },
        {
            label: 'Profil',
            icon: User,
            path: isAuthenticated ? '/profile' : '/login',
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 lg:hidden shadow-[0_-8px_20px_rgba(0,0,0,0.05)] px-2 pb-[safe-area-inset-bottom]">
            <div className="flex justify-around items-center h-[72px]">
                {navItems.map((item) => {
                    const isActive = item.path === '/'
                        ? location.pathname === '/'
                        : location.pathname.startsWith(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex flex-col items-center justify-center gap-1 flex-1 relative group"
                        >
                            <div className={`
                                p-1.5 rounded-lg transition-all duration-300
                                ${isActive ? 'text-[#4A041D]' : 'text-gray-400 group-hover:text-[#4A041D]'}
                            `}>
                                <item.icon
                                    size={22}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                            </div>
                            <span className={`
                                text-[9px] font-custom  font-bold uppercase tracking-wider  transition-colors text-center
                                ${isActive ? 'text-[#4A041D]' : 'text-gray-400'}
                            `}>
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="absolute -top-px w-10 h-1 bg-[#4A041D] rounded-b-full shadow-[0_2px_10px_rgba(74,4,29,0.2)]" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNavigation;
