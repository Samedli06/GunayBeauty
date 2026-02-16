import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../../products/Breadcrumb';
import { RotateCcw, AlertCircle, RefreshCw, FileText, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import SEO from '../../components/SEO/SEO';

const ReturnPolicy = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            icon: <RotateCcw className="w-6 h-6 text-[#C5A059]" />,
            title: "Ümumi Qaydalar",
            description: "İstehlakçı aldığı malı 14 təqvim günü ərzində geri qaytara və ya dəyişdirə bilər. Bunun üçün aşağıdakı şərtlər yerinə yetirilməlidir:",
            items: [
                "Məhsul istifadə olunmamalıdır;",
                "Məhsulun əmtəə görünüşü, istehlak xassələri, plombları və yarlıqları saxlanılmalıdır;",
                "Kassa çeki və ya alış-verişi sübut edən digər sənəd təqdim edilməlidir."
            ]
        },
        {
            icon: <AlertCircle className="w-6 h-6 text-[#C5A059]" />,
            title: "Geri Qaytarılmayan Mallar",
            subtitle: "(Nazirlər Kabinetinin 114 saylı qərarı)",
            description: "Qanunvericiliyə əsasən, aşağıdakı kateqoriyalara aid olan mallar (istehsal qüsuru olmadığı halda) geri qaytarılmır və dəyişdirilmir:",
            items: [
                "Parfümeriya və kosmetika məhsulları;",
                "Şəxsi gigiyena əşyaları (daraqlar, fırçalar və s.);",
                "Məişət-kimyası malları."
            ]
        },
        {
            icon: <RefreshCw className="w-6 h-6 text-[#C5A059]" />,
            title: "Geri Qaytarma Prosesi",
            description: "Geri qaytarma və ya dəyişdirmə tələbi ilə bağlı bizimlə aşağıdakı kanallar vasitəsilə əlaqə saxlaya bilərsiniz:",
            contactInfo: true
        }
    ];

    return (
        <>
            <SEO
                title="Geri Qaytarma Siyasəti - Gunay Beauty"
                description="Gunay Beauty geri qaytarma və dəyişdirilmə qaydaları ilə tanış olun."
            />
            <section className="bg-[#FDFBF8] min-h-screen pb-20 pt-8 font-sans">
                <div className={`max-w-4xl mx-auto px-4 lg:px-8 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

                    <div className="mb-12">
                        <Breadcrumb />
                        <h1 className="text-4xl md:text-5xl font-bold text-[#4A041D] mt-6 mb-4">Geri Qaytarma Siyasəti</h1>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base max-w-2xl">
                            gunaybeauty.com olaraq müştəri məmnuniyyəti bizim üçün prioritetdir. Alış-verişinizdən tam razı qalmağınız üçün geri qaytarma və dəyişdirilmə qaydalarımızı Azərbaycan Respublikasının "İstehlakçıların hüquqlarının müdafiəsi haqqında" Qanununa və Nazirlər Kabinetinin 114 nömrəli qərarına uyğun tənzimləyirik.
                        </p>
                        <div className="w-20 h-1.5 bg-[#C5A059] mt-6 rounded-full"></div>
                    </div>

                    <div className="space-y-8">
                        {sections.map((section, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#F3E7E1] hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-[#4A041D]/5 rounded-xl">
                                        {section.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold text-[#4A041D]">{section.title}</h2>
                                        {section.subtitle && <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{section.subtitle}</p>}
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4 text-sm md:text-base">{section.description}</p>

                                {section.items && (
                                    <ul className="space-y-3">
                                        {section.items.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-600 text-sm md:text-base">
                                                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {section.contactInfo && (
                                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-[#C5A059] shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Email</p>
                                                <a href="mailto:info@gunaybeauty.az" className="text-sm text-[#4A041D] hover:text-[#C5A059] transition-colors break-all">info@gunaybeauty.az</a>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Phone className="w-5 h-5 text-[#C5A059] shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Telefon</p>
                                                <a href="tel:+994702027519" className="text-sm text-[#4A041D] hover:text-[#C5A059] transition-colors">+994 70 202 75 19</a>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-[#C5A059] shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Ünvan</p>
                                                <p className="text-sm text-[#4A041D]">28 May, Rəşid Behbudov 66, Baku, Azerbaijan</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="bg-[#4A041D] rounded-2xl p-8 shadow-xl text-white mt-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <h3 className="text-xl font-bold mb-3 relative z-10">Geri Ödəniş Müddəti</h3>
                            <p className="text-white/80 text-sm md:text-base relative z-10">
                                Məhsul geri qaytarılarkən ödənilmiş məbləğ, ödəniş üsulundan asılı olaraq <span className="text-[#C5A059] font-bold">3-7 iş günü</span> ərzində geri qaytarılır.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ReturnPolicy;
