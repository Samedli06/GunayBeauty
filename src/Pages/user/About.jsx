import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Users, CreditCard, Sparkles, Star, Heart, Gift, Crown, Diamond, Gem } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import SEO from '../../components/SEO/SEO';
import { useGetLoyaltySettingsQuery } from '../../store/API';

const About = () => {
  const { t } = useTranslation();
  const { data: loyaltySettings } = useGetLoyaltySettingsQuery();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <>
      <SEO
        title="Haqqımızda - Günay Beauty Store"
        description="Günay Beauty Store - Lüks və orijinal gözəllik məhsullarının ünvanı."
        keywords="about gunay beauty, cosmetics baku, luxury beauty store, original makeup"
        image="/Icons/logo.svg"
        type="website"
      />

      <div className="min-h-screen bg-gray-50 overflow-hidden" style={{ fontFamily: 'Montserrat, sans-serif' }}>

        {/* Hero Section */}
        <div className="relative h-[40vh] bg-[#4A041D] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10 pattern-dots" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#C5A059] opacity-20 blur-[120px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#C5A059] opacity-20 blur-[120px] rounded-full" />

          <div
            className="text-center z-10 px-4 max-w-4xl mx-auto"
            data-aos="fade-up"
          >
            <h1 className="text-4xl lg:text-5xl font-bold !text-white mb-6 tracking-widest uppercase">
              Haqqımızda
            </h1>
            <div className="w-24 h-1 bg-[#C5A059] mx-auto rounded-full mb-6" />
            <p className="text-white/90 text-lg lg:text-xl font-light leading-relaxed max-w-2xl mx-auto">
              Lüks, Zəriflik və Orijinallığın Simvolu
            </p>
          </div>
        </div>

        {/* Main Content using Text Containers */}
        <section className="py-20 lg:py-24 max-w-[1440px] mx-auto px-4 lg:px-12 relative z-10 -mt-20">
          {/* Intro Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {/* Who We Are */}
            <div
              className="bg-white p-8 lg:p-10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 border-t-4 border-[#4A041D]"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              <div className="w-14 h-14 bg-[#4A041D]/5 rounded-xl flex items-center justify-center mb-6">
                <Crown className="w-7 h-7 text-[#4A041D]" />
              </div>
              <h2 className="text-2xl font-bold text-[#4A041D] mb-4">Biz Kimik?</h2>
              <p className="text-gray-600 leading-relaxed">
                Günay Beauty Store, Bakıda lüks və orijinal gözəllik məhsullarının satışını həyata keçirən qabaqcıl bir mağazadır. Biz, dünya şöhrətli brendlərin ən seçkin kolleksiyalarını müştərilərimizə təqdim edirik.
              </p>
            </div>

            {/* Our Standard */}
            <div
              className="bg-[#4A041D] p-8 lg:p-10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(74,4,29,0.3)] hover:shadow-[0_20px_60px_-15px_rgba(74,4,29,0.4)] transition-all duration-500 scale-105 transform z-10"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="w-14 h-14 bg-[#C5A059]/20 rounded-xl flex items-center justify-center mb-6">
                <Diamond className="w-7 h-7 text-[#C5A059]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Standartımız</h2>
              <p className="text-white/80 leading-relaxed">
                Müştərilərimizə yalnız 100% orijinal və keyfiyyəti təsdiqlənmiş məhsullar təklif edirik. Bizim üçün keyfiyyət sadəcə bir söz deyil, fəaliyyətimizin təməl prinsipidir.
              </p>
            </div>

            {/* Our Goal */}
            <div
              className="bg-white p-8 lg:p-10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 border-t-4 border-[#C5A059]"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="w-14 h-14 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6">
                <Gem className="w-7 h-7 text-[#C5A059]" />
              </div>
              <h2 className="text-2xl font-bold text-[#4A041D] mb-4">Məqsədimiz</h2>
              <p className="text-gray-600 leading-relaxed">
                Hər bir qadının özünə inamını artırmaq, ona özünü xüsusi hiss etdirmək və gözəllik dünyasındakı yenilikləri əlçatan etməkdir.
              </p>
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="mb-20">
            <div className="bg-white rounded-3xl p-8 lg:p-16 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059] opacity-5 blur-[80px] rounded-full" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4A041D] opacity-5 blur-[80px] rounded-full" />

              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <Sparkles className="w-12 h-12 text-[#C5A059] mx-auto mb-6" />
                <h2 className="text-3xl lg:text-4xl font-bold text-[#4A041D] mb-6">Fəlsəfəmiz</h2>
                <p className="text-gray-600 text-lg lg:text-xl leading-relaxed font-light italic">
                  "Gözəllik sadəcə xarici görünüş deyil, bu bir həyat tərzidir. Biz sizin üçün sadəcə bir mağaza deyil, həm də gözəllik bələdçisiyik."
                </p>
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                  {['Dior', 'Estée Lauder', 'Chanel', 'NARS'].map((brand, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-[#4A041D] font-semibold tracking-wider hover:bg-[#4A041D] hover:text-white transition-all duration-300 cursor-default">
                      {brand}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
              <ShieldCheck className="w-10 h-10 text-[#4A041D] mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-[#4A041D] mb-3">100% Orijinal</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Bütün məhsullarımız rəsmi distribyutorlardan təmin edilir və orijinallığa tam zəmanət veririk.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
              <Users className="w-10 h-10 text-[#C5A059] mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-[#4A041D] mb-3">Peşəkar Komanda</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Kosmetoloq və vizajistlərdən ibarət komandamız sizə ən doğru seçimi etməkdə yardımçı olur.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
              <Gift className="w-10 h-10 text-[#C5A059] mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-[#4A041D] mb-3">{t('Earn Rewards')}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t('Join our loyalty program and earn')} <span className="font-bold text-[#4A041D]">{loyaltySettings?.bonusPercentage}%</span> {t('bonus on every purchase.')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
              <CreditCard className="w-10 h-10 text-[#4A041D] mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-[#4A041D] mb-3">Rahat Ödəniş</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Nağd, kart və ya taksitlə ödəmə imkanları ilə alış-verişiniz daha rahat və əlçatandır.
              </p>
            </div>
          </div>

          {/* Mission & Vision - Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#4A041D] text-white p-10 lg:p-14 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059] opacity-10 blur-[60px] rounded-full group-hover:opacity-20 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <Heart className="w-8 h-8 text-[#C5A059]" />
                  <h3 className="text-3xl font-bold">Missiyamız</h3>
                </div>
                <p className="text-white/80 text-lg leading-relaxed">
                  İnsanlara öz təbii gözəlliklərini kəşf etmək üçün ilham vermək. Hər bir müştərinin ehtiyaclarına fərdi yanaşaraq, onlara ən keyfiyyətli və trend məhsulları təqdim etmək bizim əsas missiyamızdır.
                </p>
              </div>
            </div>

            <div className="bg-white p-10 lg:p-14 rounded-3xl border border-gray-100 shadow-lg relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4A041D] opacity-5 blur-[60px] rounded-full group-hover:opacity-10 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <Star className="w-8 h-8 text-[#4A041D]" />
                  <h3 className="text-3xl font-bold text-[#4A041D]">Vizyonumuz</h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Regionun ən etibarlı və sevilən gözəllik mərkəzi olmaq. Lüks kosmetika sektorunda standartları təyin edən və müştəri məmnuniyyətini hər şeydən üstün tutan lider brend olmaq.
                </p>
              </div>
            </div>
          </div>

        </section>
      </div>
    </>
  );
};

export default About;