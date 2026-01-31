import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../../products/Breadcrumb';
import { Shield, Lock, Eye, FileText, UserCheck, Share2, Database, Clock, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO/SEO';

const PrivacyPolicy = () => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            icon: <FileText className="w-6 h-6 text-[#C5A059]" />,
            title: t('privacyPolicy.sections.introduction.title'),
            content: t('privacyPolicy.sections.introduction.content')
        },
        {
            icon: <Database className="w-6 h-6 text-[#C5A059]" />,
            title: t('privacyPolicy.sections.informationWeCollect.title'),
            content: t('privacyPolicy.sections.informationWeCollect.content')
        },
        {
            icon: <UserCheck className="w-6 h-6 text-[#C5A059]" />,
            title: t('privacyPolicy.sections.howWeCollect.title'),
            content: t('privacyPolicy.sections.howWeCollect.content')
        },
        {
            icon: <Eye className="w-6 h-6 text-[#C5A059]" />,
            title: t('privacyPolicy.sections.howWeUse.title'),
            content: t('privacyPolicy.sections.howWeUse.content')
        },
        {
            icon: <Lock className="w-6 h-6 text-[#C5A059]" />,
            title: t('privacyPolicy.sections.cookies.title'),
            content: t('privacyPolicy.sections.cookies.content')
        },
        {
            icon: <Share2 className="w-6 h-6 text-[#C5A059]" />,
            title: t('privacyPolicy.sections.thirdParty.title'),
            content: t('privacyPolicy.sections.thirdParty.content')
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-[#C5A059]" />,
            title: t('privacyPolicy.sections.sharingSec.title'),
            content: t('privacyPolicy.sections.sharingSec.content')
        },
        {
            icon: <Clock className="w-6 h-6 text-[#C5A059]" />,
            title: t('privacyPolicy.sections.rightsRetention.title'),
            content: t('privacyPolicy.sections.rightsRetention.content')
        }
    ];

    return (
        <>
            <SEO
                title={`${t('privacyPolicy.title')} - Gunay Beauty Store`}
                description={t('privacyPolicy.sections.introduction.content')}
            />
            <section className="bg-[#FDFBF8] min-h-screen pb-20 pt-8 font-sans">
                <div className={`max-w-4xl mx-auto px-4 lg:px-8 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

                    <div className="mb-12">
                        <Breadcrumb />
                        <h1 className="text-4xl md:text-5xl font-bold text-[#4A041D] mt-6 mb-4">{t('privacyPolicy.title')}</h1>
                        <p className="text-gray-500 font-medium">{t('privacyPolicy.lastUpdated')}: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        <div className="w-20 h-1.5 bg-[#C5A059] mt-6 rounded-full"></div>
                    </div>

                    <div className="space-y-10">
                        {sections.map((section, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#F3E7E1] hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-[#4A041D]/5 rounded-xl">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-[#4A041D]">{section.title}</h2>
                                </div>
                                <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                                    {section.content}
                                </div>
                            </div>
                        ))}

                        {/* Additional Sections */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#F3E7E1]">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-[#4A041D]/5 rounded-xl">
                                    <Shield className="w-6 h-6 text-[#C5A059]" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-[#4A041D]">{t('privacyPolicy.sections.children.title')}</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                {t('privacyPolicy.sections.children.content')}
                            </p>
                        </div>

                        {/* Contact Section */}
                        <div className="bg-[#4A041D] rounded-2xl p-8 md:p-10 shadow-xl text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                            <div className="relative z-10">
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('privacyPolicy.sections.contact.title')}</h2>
                                <p className="text-white/80 mb-8 max-w-lg">
                                    {t('privacyPolicy.sections.contact.desc')}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                            <Mail className="w-5 h-5 text-[#C5A059]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">{t('privacyPolicy.sections.contact.email')}</p>
                                            <a href="mailto:info@gunaybeauty.az" className="text-sm hover:text-[#C5A059] transition-colors">info@gunaybeauty.az</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                            <Phone className="w-5 h-5 text-[#C5A059]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">{t('privacyPolicy.sections.contact.phone')}</p>
                                            <a href="tel:+994702027519" className="text-sm hover:text-[#C5A059] transition-colors">+994 70 202 75 19</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                            <MapPin className="w-5 h-5 text-[#C5A059]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">{t('privacyPolicy.sections.contact.address')}</p>
                                            <p className="text-sm">28 May, Rəşid Behbudov 66, Baku, Azerbaijan</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default PrivacyPolicy;
