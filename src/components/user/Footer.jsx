import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router';
import icons from '../../../public/Icons/icons.jpg';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { FaInstagram, FaTiktok } from 'react-icons/fa';

const Footer = () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(i18next.language || 'en');
    const dropdownRef = useRef(null);
    const { t } = useTranslation();

    const languages = [
        {
            name: "English",
            value: "en",
            flag: "./Icons/usa-flag.svg"
        },
        {
            name: "Azerbaijan",
            value: "az",
            flag: "./Icons/az-flag.svg"
        }
    ];

    // Sync with i18next language changes
    useEffect(() => {
        const handleLanguageChange = (lng) => {
            setSelected(lng);
            // Store in cookie for persistence
            document.cookie = `language=${lng}; path=/; max-age=31536000`; // 1 year
        };

        i18next.on('languageChanged', handleLanguageChange);

        return () => {
            i18next.off('languageChanged', handleLanguageChange);
        };
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    const handleLanguageChange = (langValue) => {
        setSelected(langValue);
        i18next.changeLanguage(langValue);
        document.cookie = `language=${langValue}; path=/; max-age=31536000`; // Store for 1 year
        setOpen(false);
    };

    const currentLanguage = languages.find(lang => lang.value === selected) || languages[0];
    const otherLanguage = languages.find(lang => lang.value !== selected) || languages[1];

    return (
        <footer className="bg-[#4A041D] text-white pt-16 pb-24 lg:pb-8 font-sans">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-start">
                    {/* Brand Column - Left Aligned */}
                    <div className="flex flex-col items-start">
                        <Link to='/'>
                            <h2 className="font-sans text-2xl text-[#C5A059] tracking-widest font-bold uppercase mb-6">
                                Gunay Beauty Store
                            </h2>
                        </Link>
                        <p className="text-[#FDFBF8]/80 text-sm leading-relaxed mb-6 max-w-xs">
                            Discover your signature scent and embrace your beauty with our luxury collection.
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
                        <h4 className="font-sans text-lg text-[#C5A059] mb-6">{t("footer.mainPages")}</h4>
                        <div className="flex flex-col gap-3 items-center">
                            <Link to='/' className="text-[#FDFBF8]/70 hover:text-[#C5A059] text-sm transition-colors">{t("footer.home")}</Link>
                            <Link to='/about' className="text-[#FDFBF8]/70 hover:text-[#C5A059] text-sm transition-colors">{t("footer.about")}</Link>
                            <Link to='/contact' className="text-[#FDFBF8]/70 hover:text-[#C5A059] text-sm transition-colors">{t("footer.contact")}</Link>
                            <Link to='/brands' className="text-[#FDFBF8]/70 hover:text-[#C5A059] text-sm transition-colors">{t("admin.brands")}</Link>
                            <Link to='/login' className="text-[#FDFBF8]/70 hover:text-[#C5A059] text-sm transition-colors">{t("footer.login")}</Link>
                            <Link to='/privacy-policy' className="text-[#FDFBF8]/70 hover:text-[#C5A059] text-sm transition-colors">{t("footer.privacyPolicy")}</Link>
                        </div>
                    </div>

                    {/* Contact Column - Right Aligned (on Desktop) */}
                    <div className="flex flex-col items-start md:items-end">
                        <h4 className="font-sans text-lg text-[#C5A059] mb-6">{t("footer.contactUs")}</h4>
                        <div className="flex flex-col gap-4 md:items-end">
                            <div className="flex items-center gap-3 text-[#FDFBF8]/80 text-sm md:flex-row-reverse">
                                <img className="w-5 h-5 invert mt-0.5" src="./Icons/footer-phone.svg" alt="" />
                                <a href="tel:0702027519" className="hover:text-[#C5A059] transition-colors">{t("footer.phone")}</a>
                            </div>
                            <div className="flex items-start gap-3 text-[#FDFBF8]/80 text-sm md:flex-row-reverse text-right">
                                <img className="w-5 h-5 invert mt-0.5" src="./Icons/footer-location.svg" alt="" />
                                <p>{t("footer.address1")}</p>
                            </div>
                            <div className="flex items-center gap-3 text-[#FDFBF8]/80 text-sm md:flex-row-reverse">
                                <img className="w-5 h-5 invert mt-0.5" src="./Icons/contact-clock.svg" alt="" />
                                <span>{t("footer.workingHours")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[#FDFBF8]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[#FDFBF8]/40 text-xs">© {new Date().getFullYear()} Gunay Beauty Store. All rights reserved.</p>

                    {/* Language Switcher */}
                    <div className="relative cursor-pointer" ref={dropdownRef}>
                        <div
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-2 text-[#FDFBF8]/70 hover:text-[#C5A059] text-sm transition-colors"
                        >
                            <img src={currentLanguage.flag} alt="" className="w-4 h-3 rounded-[2px]" />
                            <span className="uppercase">{currentLanguage.value}</span>
                        </div>

                        {open && (
                            <div className="absolute bottom-full right-0 mb-2 bg-white text-[#4A041D] rounded shadow-lg overflow-hidden min-w-[120px]">
                                {languages.map(lang => (
                                    <div
                                        key={lang.value}
                                        onClick={() => handleLanguageChange(lang.value)}
                                        className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer text-sm"
                                    >
                                        <img src={lang.flag} alt="" className="w-4 h-3 rounded-[2px]" />
                                        <span>{lang.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer