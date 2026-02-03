import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Users, CreditCard, Sparkles, Star, Heart, Gift } from 'lucide-react';
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

      <div className="min-h-screen bg-white overflow-hidden" style={{ fontFamily: 'Montserrat, sans-serif' }}>

        {/* Hero Section */}
        <div className="relative h-[40vh] lg:h-[50vh] bg-[#4A041D] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10 pattern-dots" />
          <div
            className="text-center z-10 px-4"
            data-aos="fade-up"
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 tracking-widest uppercase">
              Haqqımızda
            </h1>
            <div className="w-24 h-1 bg-[#C5A059] mx-auto rounded-full" />
            <p className="text-white/80 mt-4 text-sm lg:text-lg tracking-wider font-light">
              Günay Beauty Store
            </p>
          </div>
        </div>

        {/* Intro Section */}
        <section className="py-16 lg:py-24 max-w-[1440px] mx-auto px-4 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div
              className="lg:w-1/2 relative"
              data-aos="fade-right"
            >
              <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                <img
                  src="./deals/deal-1.jpg"
                  alt="Gunay Beauty Store Interior"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2670&auto=format&fit=crop'; }}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 lg:-bottom-10 lg:-right-10 bg-white p-6 lg:p-8 rounded-xl shadow-xl max-w-[200px] lg:max-w-[280px]">
                <p className="text-[#4A041D] font-bold text-lg lg:text-2xl mb-1">100%</p>
                <p className="text-gray-500 text-xs lg:text-sm">Orijinal və Keyfiyyətli Məhsullar</p>
              </div>
            </div>

            <div
              className="lg:w-1/2"
              data-aos="fade-left"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-[#4A041D] mb-6 leading-tight">
                Lüks və Müasir <br />
                <span className="text-[#C5A059]">Gözəllik Mağazası</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                Günay Beauty Store Bakıda fəaliyyət göstərən, orijinal və keyfiyyətli gözəllik məhsullarını təqdim edən lüks və müasir beauty mağazasıdır.
              </p>
              <p className="text-gray-600 leading-relaxed text-base border-l-4 border-[#C5A059] pl-6 italic">
                "Məqsədimiz hər bir müştərinin öz gözəlliyini doğru, təhlükəsiz və etibarlı məhsullarla kəşf etməsinə kömək etməkdir."
              </p>
            </div>
          </div>
        </section>

        {/* Philosophy & Brands Section */}
        <section className="bg-[#4A041D] py-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059] opacity-5 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 blur-[100px] rounded-full" />

          <div className="max-w-[1440px] mx-auto px-4 lg:px-12 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
              <Sparkles className="w-10 h-10 text-[#C5A059] mx-auto mb-6" />
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Fəlsəfəmiz</h2>
              <p className="text-white/80 text-lg leading-relaxed">
                Bizim üçün gözəllik sadəcə xarici görünüş deyil — bu, özünə qulluq, özünə inam və düzgün seçimdir.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {['Estée Lauder', 'Dior', 'NARS', 'Sephora'].map((brand, index) => (
                <div
                  key={brand}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl text-center hover:bg-white/10 transition-colors duration-300 group"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <Star className="w-6 h-6 text-[#C5A059] mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold tracking-wider">{brand}</h3>
                </div>
              ))}
            </div>
            <p className="text-center text-white/60 mt-12 italic" data-aos="fade-in" data-aos-delay="400">
              ...və digər premium markaların seçilmiş məhsullarını mağazamızda tapa bilərsiniz.
            </p>
          </div>
        </section>

        {/* Features / Why Choose Us */}
        <section className="py-20 lg:py-28 bg-gray-50">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-[#4A041D]"
                data-aos="fade-up"
                data-aos-delay="0"
              >
                <div className="w-14 h-14 bg-[#4A041D]/5 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-8 h-8 text-[#4A041D]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">100% Orijinal</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Bütün məhsullarımız 100% orijinaldır və etibarlı mənbələrdən təmin edilir. Keyfiyyətə tam zəmanət veririk.
                </p>
              </div>

              <div
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-[#C5A059]"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="w-14 h-14 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-[#C5A059]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Peşəkar Komanda</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Təcrübəli komandamız seçim zamanı sizə fərdi yanaşma ilə kömək edir və ehtiyaclarınıza ən uyğun məhsulları tövsiyə edir.
                </p>
              </div>

              {/* Loyalty Bonus Feature */}
              <div
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-[#C5A059]"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="w-14 h-14 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6">
                  <Gift className="w-8 h-8 text-[#C5A059]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('Earn Rewards')}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {t('Join our loyalty program and earn')} <span className="font-bold text-[#4A041D]">{loyaltySettings?.bonusPercentage}%</span> {t('bonus on every purchase. Redeem points for exclusive discounts.')}
                </p>
              </div>

              <div
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-[#4A041D]"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="w-14 h-14 bg-[#4A041D]/5 rounded-xl flex items-center justify-center mb-6">
                  <CreditCard className="w-8 h-8 text-[#4A041D]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Rahat Ödəniş</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Müştərilərimiz üçün rahat alış təcrübəsi yaratmaq məqsədilə nağd və daxili kreditlə ödəniş imkanları təqdim edirik.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 max-w-[1440px] mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div
              className="bg-[#FFF8F8] rounded-3xl p-10 lg:p-16 relative overflow-hidden group"
              data-aos="fade-right"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFE4E4] rounded-full blur-[80px] -mr-32 -mt-32 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    <Heart className="w-6 h-6 text-[#E60C03]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#4A041D]">Missiyamız</h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Missiyamız hər kəs üçün gözəllik baxımını daha əlçatan, zövqlü və etibarlı etməkdir. İstər gündəlik dəriyə qulluq, istər peşəkar makiyaj, istərsə də xüsusi günlər üçün məhsul axtarışında olun — Günay Beauty Store olaraq hər zaman yanınızdayıq.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div
              className="bg-[#FDFBF6] rounded-3xl p-10 lg:p-16 relative overflow-hidden group"
              data-aos="fade-left"
            >
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F5E6CC] rounded-full blur-[80px] -ml-32 -mb-32 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    <Star className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#C5A059]">Vizyonumuz</h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Vizyonumuz Azərbaycanda lüks gözəllik pərakəndəçiliyində etibarlı, sevilən və ilham verən bir marka olmaq, müştərilərimiz üçün sadəcə mağaza deyil, gözəllik təcrübəsi yaratmaqdır.
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