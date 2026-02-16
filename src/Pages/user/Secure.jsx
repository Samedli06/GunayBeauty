import React from 'react'
import { Breadcrumb } from '../../products/Breadcrumb'
const Secure = () => {
    const contactWp = () => {
        const url = `https://hemsoft.az`;

        window.open(url, "_blank");
    };
    return (
        <section className='bg-[#f7fafc]  inter pt-4'>
            <div className='hidden md:block md:max-w-[80vw] mx-auto'>
                <Breadcrumb />
            </div>

            <div className='bg-white p-5 border-1 border-[#dee2e6] flex flex-col md:flex-row md:gap-4 md:max-w-[85vw] lg:max-w-[75vw] mx-auto md:mt-8 md:rounded-lg md:shadow-md lg:p-8 lg:gap-5'>
                <div className='md:hidden'>
                    <Breadcrumb />
                </div>


                <div className='max-w-[80vw] lg:max-h-[30vh] mt-9 md:mt-0  mx-auto rounded-xl md:flex-3 lg:flex-5'>
                    <img className='rounded-xl aspect-[7/6] md:aspect-[5/4]  object-cover md:h-full lg:max-h-[280px] lg:w-full ' src="./Banners/aboutExtra.svg" alt="" />
                </div>

                <div className='text-center my-7 md:my-0 flex flex-col gap-3 md:flex-8 md:text-start   [@media(min-width:1100px)]:p-7'>
                    <h1 className='font-semibold text-xl lg:text-2xl'>Hemsoft ilə Ağıllı POS və İdarəetmə</h1>
                    <p className='max-w-[83vw] mx-auto text-[#505050] md:text-sm md:mb-4  lg:text-lg'>Smartteam tərəfindən təqdim edilən Hemsoft proqramı biznesiniz üçün xüsusi olaraq hazırlanmış müasir POS və idarəetmə sistemidir. Biznesinizi növbəti səviyyəyə çatdırmaq üçün Hemsoft-dan istifadə edin.</p>
                    <button onClick={() => { contactWp() }} className=' py-4 my-4 cursor-pointer bg-gradient-to-b from-[#FF1206] to-[#D91205] rounded-lg mx-3 text-white md:w-fit md:py-3 md:text-sm md:px-7 md:mx-0'>Hemsoft.az-ı yoxla</button>
                </div>
            </div>

            <div className='max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] md:mt-10 mx-auto pb-25'>
                <div className='py-6 pt-8 text-center '>
                    <h1 className='text-xl font-semibold'>Xidmətlərimiz</h1>
                    <p className='text-[#505050]  max-w-[50vw] mx-auto mt-3'>Xidmətlərimiz maksimum təhlükəsizlik və hamar fəaliyyət təmin etmək üçün nəzərdə tutulmuşdur. Peşəkar komandam tərəfindən quraşdırılan bu sistemlər mülkünüzün ən yüksək səviyyədə təhlükəsizliyini təmin edir.</p>
                </div>
                <div className='flex flex-col gap-5 max-w-[90vw] mx-auto md:grid md:grid-cols-2 [@media(min-width:1100px)]:flex lg:flex-row'>
                    <div className='relative bg-white border-1 border-[#dee2e6] p-7 pt-19 rounded-lg'>
                        <img className='absolute top-4 right-4 bg-[#ff4b43] p-3 rounded-full' src="./Icons/service-1-1.svg" alt="" />
                        <h1 className='font-semibold text-lg'>Sürətli və Təhlükəsiz Quraşdırma</h1>
                        <p className='text-md text-[#7D7D7D] font-medium max-w-[84%]'>Proqramın təhlükəsiz və gecikmələr olmadan quraşdırılmasını təmin edirik, beləliklə dərhal istifadə etməyə başlaya bilərsiniz.</p>
                    </div>

                    <div className='relative bg-white border-1 border-[#dee2e6] p-7 pt-19 rounded-lg'>
                        <img className='absolute top-4 right-4 bg-[#ff4b43] p-3 rounded-full' src="./Icons/service-1-2.svg" alt="" />
                        <h1 className='font-semibold text-lg'>Xüsusi İlkin Quraşdırma</h1>
                        <p className='text-md text-[#7D7D7D] font-medium max-w-[84%]'>Bütün konfiqurasiyalar sizin spesifik biznes ehtiyaclarınızı və tələblərini karşılamaq üçün öz xüsusiyyətlərinə uyğun olaraq hazırlanır.</p>
                    </div>

                    <div className='relative bg-white border-1 border-[#dee2e6] p-7 pt-19 rounded-lg'>
                        <img className='absolute top-4 right-4 bg-[#ff4b43] p-3 rounded-full' src="./Icons/service-1-3.svg" alt="" />
                        <h1 className='font-semibold text-lg'>Personala Təlim & Dəstək</h1>
                        <p className='text-md text-[#7D7D7D] font-medium max-w-[84%]'>Komandanız sistemi effektiv şəkildə istifadə etmək üçün praktiki təlim və əlavə təlimatlar alır.</p>
                    </div>

                    <div className='relative bg-white border-1 border-[#dee2e6] p-7 pt-19 rounded-lg'>
                        <img className='absolute top-4 right-4 bg-[#ff4b43] p-3 rounded-full' src="./Icons/service-1-4.svg" alt="" />
                        <h1 className='font-semibold text-lg'>Davamlı Dəstək & Yeniləmələr</h1>
                        <p className='text-md text-[#7D7D7D] font-medium max-w-[84%]'>Sistem ən yaxşı vəziyyətdə işləməsi üçün etibarlı texniki dəstək və müntəzəm yeniləmələrdən istifadə edin.</p>
                    </div>
                </div>

            </div>


        </section>
    )
}

export default Secure