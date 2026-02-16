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
            label: 'Məhsullar',
            icon: Store,
            path: '/products',
        },
        {
            label: 'Kateqoriyalar',
            icon: Grid,
            path: '/categories',
        },
        {
            label: 'Brendlər',
            icon: Tag,
            path: '/brands',
        },
        {
            label: 'Profil',
            icon: User,
            path: isAuthenticated ? '/profile' : '/login',
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#4A041D]/10 px-4 py-3 z-50 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex justify-around items-center max-w-md mx-auto gap-2">
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
                            className={`
                                flex items-center gap-2 
                                transition-all duration-300 ease-in-out
                                ${isActive
                                    ? 'bg-[#2D1B2E] text-white px-4 py-2.5 rounded-full shadow-lg'
                                    : 'p-2.5 text-gray-400 hover:text-[#4A041D]'
                                }
                            `}
                        >
                            <item.icon
                                size={15}
                                strokeWidth={isActive ? 2.5 : 2}
                                className="flex-shrink-0"
                            />

                            {/* Label - only visible when active */}
                            <span
                                className={`
                                    font-sans font-semibold text-[8px] capitalize
                                    transition-all duration-300 ease-in-out
                                    ${isActive
                                        ? 'max-w-[100px] opacity-100'
                                        : 'max-w-0 opacity-0 overflow-hidden'
                                    }
                                `}
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
