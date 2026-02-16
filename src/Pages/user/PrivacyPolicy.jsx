import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../../products/Breadcrumb';
import { Shield, Lock, Eye, FileText, UserCheck, Share2, Database, Clock, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import SEO from '../../components/SEO/SEO';

const PrivacyPolicy = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            icon: <FileText className="w-6 h-6 text-[#C5A059]" />,
            title: "Giriş",
            content: "Gunay Beauty Store-a xoş gəlmisiniz. Biz sizin şəxsi məlumatlarınızı və məxfilik hüququnuzu qorumağa sadiqik. Bu Məxfilik Siyasəti veb saytımızı (gunaybeauty.az) ziyarət etdiyiniz və xidmətlərimizdən istifadə etdiyiniz zaman məlumatlarınızı necə topladığımızı, istifadə etdiyimizi və qoruduğumuzu izah edir."
        },
        {
            icon: <Database className="w-6 h-6 text-[#C5A059]" />,
            title: "Topladığımız Məlumatlar",
            content: "Bizə birbaşa təqdim etdiyiniz məlumatları toplayırıq. Bura daxildir: \n• Şəxsi identifikatorlar: Ad, e-poçt ünvanı və telefon nömrəsi.\n• Hesab məlumatları: Şifrələnmiş şifrə və autentifikasiya tokenləri.\n• Sifariş detalları: Alınan məhsullar, miqdarlar, ümumi məbləğlər və valyuta (AZN).\n• Texniki məlumatlar: Bir çox hostinq xidmətləri tərəfindən avtomatik toplansa da, biz əsasən sizin sessiyanız üçün lazım olan məlumatlara, məsələn, autentifikasiya kukilərinə diqqət yetiririk."
        },
        {
            icon: <UserCheck className="w-6 h-6 text-[#C5A059]" />,
            title: "Məlumatları Necə Toplayırıq",
            content: "Məlumatlar bir neçə üsulla toplanır:\n• Qeydiyyat: Platformamızda hesab yaratdıqda.\n• Sifarişi Tamamlama və Sürətli Sifariş: Satınalmanı asanlaşdırmaq üçün detalları təqdim etdikdə.\n• Birbaşa Qarşılıqlı Əlaqə: Əlaqə formalarımız və ya müştəri xidmətləri vasitəsilə bizimlə əlaqə saxladıqda.\n• Avtomatlaşdırılmış Texnologiyalar: Alış-veriş səbətinizi idarə etmək və daxil olduğunuz sessiyanı saxlamaq üçün kuki və yerli yaddaşdan (local storage) istifadə edirik."
        },
        {
            icon: <Eye className="w-6 h-6 text-[#C5A059]" />,
            title: "Məlumatlardan Necə İstifadə Edirik",
            content: "Məlumatlarınız yalnız xidmətlərimizi təqdim etmək və təkmilləşdirmək üçün istifadə olunur, bura daxildir:\n• Sifarişlərin İşlənməsi: Satınalmalarınızı idarə etmək üçün.\n• Hesabın İdarə Edilməsi: Profilinizi, sifariş tarixinizi və loyallıq xallarınızı saxlamaq üçün.\n• Ünsiyyət: Sifarişlərinizlə bağlı və ya sorğularınıza cavab olaraq sizinlə əlaqə saxlamaq üçün.\n• Təhlükəsizlik: Veb saytımızı və hesabınızı icazəsiz girişdən qorumaq üçün."
        },
        {
            icon: <Lock className="w-6 h-6 text-[#C5A059]" />,
            title: "Kukilər və İzləmə Texnologiyaları",
            content: "Biz vacib kuki və yaddaş texnologiyalarından istifadə edirik:\n• Autentifikasiya Kukiləri: Hesabınıza təhlükəsiz şəkildə daxil olmağınız üçün.\n• Yerli Yaddaş (Local Storage): Brauzerinizin yerli yaddaşında 'ecommerce_cart' istifadə edirik ki, səbətinizdəki məhsullar sessiyalar arası saxlanılsın."
        },
        {
            icon: <Share2 className="w-6 h-6 text-[#C5A059]" />,
            title: "Üçüncü Tərəf Xidmətləri",
            content: "Xidmətlərimizi təkmilləşdirmək üçün üçüncü tərəf provayderləri ilə inteqrasiya edirik:\n•  Google Fonts: Peşəkar veb sayt tipoqrafiyası üçün istifadə olunur."
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-[#C5A059]" />,
            title: "Məlumat Paylaşımı və Təhlükəsizlik",
            content: "Biz sizin şəxsi məlumatlarınızı üçüncü tərəflərə satmırıq və ya icarəyə vermirik. Məlumatları yalnız sifarişlərinizi yerinə yetirmək üçün zəruri olduqda və ya qanunla tələb olunduqda paylaşırıq. Məlumatlarınızı qorumaq üçün şifrəli şifrələmə və JWT (JSON Web Tokens) daxil olmaqla sənaye standartlı təhlükəsizlik tədbirlərindən istifadə edirik."
        },
        {
            icon: <Clock className="w-6 h-6 text-[#C5A059]" />,
            title: "İstifadəçi Hüquqları və Saxlanma",
            content: "Profil səhifəniz vasitəsilə şəxsi məlumatlarınıza daxil olmaq, yeniləmək və ya silinməsini tələb etmək hüququnuz var. Məlumatlarınızı hesabınız aktiv olduğu müddətdə və ya sizə xidmət göstərmək və hüquqi öhdəliklərə əməl etmək üçün lazım olduğu müddətdə saxlayırıq."
        }
    ];

    return (
        <>
            <SEO
                title="Məxfilik Siyasəti - Gunay Beauty Store"
                description="Gunay Beauty Store-un məxfilik siyasəti və məlumat qorunması qaydaları ilə tanış olun."
            />
            <section className="bg-[#FDFBF8] min-h-screen pb-20 pt-8 font-sans">
                <div className={`max-w-4xl mx-auto px-4 lg:px-8 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

                    <div className="mb-12">
                        <Breadcrumb />
                        <h1 className="text-4xl md:text-5xl font-bold text-[#4A041D] mt-6 mb-4">Məxfilik Siyasəti</h1>
                        <p className="text-gray-500 font-medium">Son yenilənmə: {new Date().toLocaleDateString('az-AZ', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
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
                                <h2 className="text-xl md:text-2xl font-bold text-[#4A041D]">Uşaqların Məxfiliyi</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                Xidmətlərimiz 13 yaşından kiçik uşaqlara yönəlməyib. Biz bilərəkdən uşaqlardan şəxsi məlumat toplamırıq. Əgər bir uşağın bizə şəxsi məlumat təqdim etdiyindən xəbərdar olsaq, həmin məlumatların silinməsi üçün tədbirlər görəcəyik.
                            </p>
                        </div>

                        {/* Contact Section */}
                        <div className="bg-[#4A041D] rounded-2xl p-8 md:p-10 shadow-xl text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                            <div className="relative z-10">
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">Bizimlə Əlaqə</h2>
                                <p className="text-white/80 mb-8 max-w-lg">
                                    Bu Məxfilik Siyasəti və ya məlumat təcrübələrimizlə bağlı hər hansı sualınız və ya narahatlığınız varsa, aşağıdakı kanallardan hər hansı biri vasitəsilə bizimlə əlaqə saxlaya bilərsiniz:
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                            <Mail className="w-5 h-5 text-[#C5A059]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">E-poçt</p>
                                            <a href="mailto:info@gunaybeauty.az" className="text-sm hover:text-[#C5A059] transition-colors">info@gunaybeauty.az</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                            <Phone className="w-5 h-5 text-[#C5A059]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Telefon</p>
                                            <a href="tel:+994702027519" className="text-sm hover:text-[#C5A059] transition-colors">+994 70 202 75 19</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                            <MapPin className="w-5 h-5 text-[#C5A059]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Ünvan</p>
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
