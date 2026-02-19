import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router';

import { FaInstagram, FaTiktok } from 'react-icons/fa';

const Footer = () => {
    const dropdownRef = useRef(null);





    return (
        <footer className="bg-[#4A041D] text-white pt-16 pb-24 lg:pb-8 font-sans">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-start">
                    {/* Brand Column - Left Aligned */}
                    <div className="flex flex-col items-start">
                        <Link to='/'>
                            <h2 className="font-sans text-2xl text-[#C5A059] tracking-widest font-bold uppercase mb-6">
                                Gunay Beauty
                            </h2>
                        </Link>
                        <p className="text-[#FDFBF8]/80 text-sm leading-relaxed mb-6 max-w-xs">
                            Zərifliyin və gözəlliyin ünvanı olan Gunay Beauty Store-da sizə ən özəl ətirləri və gözəllik məhsullarını təqdim edirik.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.tiktok.com/@gunaybeautystore?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity text-white hover:text-[#C5A059]">
                                <FaTiktok className="w-6 h-6" />
                            </a>
                            <a href="https://www.instagram.com/gunaybeautystore?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity text-white hover:text-[#C5A059]">
                                <FaInstagram className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    {/* Links Column - Centered */}
                    <div className="flex flex-col items-center md:items-center">
                        <h4 className="font-sans text-lg text-[#C5A059] mb-6">Əsas Səhifələr</h4>
                        <div className="flex flex-col gap-3 items-center">
                            <Link to='/' className="text-[#FDFBF8]/70 hover:text-[#C5A059] text-sm transition-colors">Ana Səhifə</Link>
                            <Link to='/about' className="text-[#FDFBF8]/70 hover:text-[#C5A059] text-sm transition-colors">Haqqımızda</Link>
                            <Link to='/brands' className="text-[#FDFBF8]/70 hover:text-[#C5A059] text-sm transition-colors">Brendlər</Link>
                            <Link to='/login' className="text-[#FDFBF8]/70 hover:text-[#C5A059] text-sm transition-colors">Daxil ol</Link>
                            <Link to='/privacy-policy' className="text-[#FDFBF8]/70 hover:text-[#C5A059] text-sm transition-colors">Məxfilik Siyasəti</Link>
                            <Link to='/return-policy' className="text-[#FDFBF8]/70 hover:text-[#C5A059] text-sm transition-colors">Geri Qaytarma Siyasəti</Link>
                        </div>
                    </div>

                    {/* Contact Column - Right Aligned (on Desktop) */}
                    <div className="flex flex-col items-start md:items-end">
                        <h4 className="font-sans text-lg text-[#C5A059] mb-6">Bizimlə Əlaqə</h4>
                        <div className="flex flex-col gap-4 md:items-end">
                            <div className="flex items-center gap-3 text-[#FDFBF8]/80 text-sm md:flex-row-reverse">
                                <img className="w-5 h-5 invert mt-0.5" src="./Icons/footer-phone.svg" alt="" />
                                <a href="tel:0702027519" className="hover:text-[#C5A059] transition-colors">070 202 75 19</a>
                            </div>
                            <div className="flex items-start gap-3 text-[#FDFBF8]/80 text-sm md:flex-row-reverse text-right">
                                <img className="w-5 h-5 invert mt-0.5" src="./Icons/footer-location.svg" alt="" />
                                <p>28 May, Rəşid Behbudov 66</p>
                            </div>
                            <div className="flex items-center gap-3 text-[#FDFBF8]/80 text-sm md:flex-row-reverse">
                                <img className="w-5 h-5 invert mt-0.5" src="./Icons/contact-clock.svg" alt="" />
                                <span>11:00 – 20:00</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[#FDFBF8]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[#FDFBF8]/40 text-xs">© {new Date().getFullYear()} Gunay Beauty. Bütün hüquqlar qorunur.</p>


                </div>
            </div>
        </footer>
    );
};

export default Footer