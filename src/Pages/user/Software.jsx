
import React from 'react'
import { Breadcrumb } from '../../products/Breadcrumb'
const Software = () => {
  const contactWp = () => {
    const phoneNumber = "994123456789"
    const message = "Hello, I want to know more about your service."; // optional predefined message
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

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


        <div className=' w-full lg:max-h-[30vh]  mt-9 md:mt-0  mx-auto rounded-xl md:flex-3 lg:flex-5'>
          <img className='rounded-xl  object-cover h-full  w-full ' src="./Banners/cameraService.svg" alt="" />
        </div>

        <div className='text-center my-7 md:my-0 flex flex-col gap-3 md:flex-8 md:text-start   [@media(min-width:1100px)]:p-7'>
          <h1 className='font-semibold text-xl lg:text-2xl'>Məkanınızı Əliyyat Texnologiyası ilə Qoruyun</h1>
          <p className='max-w-[83vw] mx-auto text-[#505050] md:text-sm md:mb-4  lg:text-lg'>Müasir texnologiyalara əsaslanan təhlükəsizlik sistemləri vasitəsilə iş yerləriniz və yaşayış məkanlarınız üçün etibarlı qoruma təmin edirik.</p>
          <button onClick={() => { contactWp() }} className=' py-4 my-4 cursor-pointer bg-gradient-to-b from-[#FF1206] to-[#D91205] rounded-lg mx-3 text-white md:w-fit md:py-3 md:text-sm md:px-7 md:mx-0'>WhatsApp vasitəsilə əlaqə</button>
        </div>
      </div>



      <div className='max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] md:mt-10 mx-auto pb-25'>
        <div className='py-6 pt-8 text-center '>
          <h1 className='text-xl font-semibold'>Xidmətlərimiz</h1>
          <p className='text-[#505050]  max-w-[50vw] mx-auto mt-3'>Xidmətlərimiz maksimum təhlükəsizlik və hamar fəaliyyət təmin etmək üçün nəzərdə tutulmuşdur. Peşəkar komandam tərəfindən quraşdırılan bu sistemlər mülkünüzün ən yüksək səviyyədə təhlükəsizliyini təmin edir.</p>
        </div>

        <div className='flex flex-col gap-5 max-w-[90vw] mx-auto md:grid md:grid-cols-2 [@media(min-width:1100px)]:grid lg:grid-cols-2 [@media(min-width:1270px)]:grid-cols-4'>
          <div className='relative bg-white border-1 border-[#dee2e6] p-7 pt-19 rounded-lg'>
            <img className='absolute top-4 right-4 bg-[#ff4b43] p-3 rounded-full' src="./Icons/service-2-1.svg" alt="" />
            <h1 className='font-semibold text-lg'>Video Nəzarət Kamerasının Quraşdırılması</h1>
            <p className='text-md text-[#7D7D7D] font-medium max-w-[84%]'>Yüksək keyfiyyətli CCTV kameraları ilə nəzarətdə qalın.</p>
          </div>

          <div className='relative bg-white border-1 border-[#dee2e6] p-7 pt-19 rounded-lg'>
            <img className='absolute top-4 right-4 bg-[#ff4b43] p-3 rounded-full' src="./Icons/service-2-2.svg" alt="" />
            <h1 className='font-semibold text-lg'>IP & Analoq Sistem İntegrasyonu</h1>
            <p className='text-md text-[#7D7D7D] font-medium max-w-[84%]'>Müxtəlif sistem növlərini hamar şəkildə bağlayın və idarə edin.</p>
          </div>

          <div className='relative bg-white border-1 border-[#dee2e6] p-7 pt-19 rounded-lg'>
            <img className='absolute top-4 right-4 bg-[#ff4b43] p-3 rounded-full' src="./Icons/service-2-3.svg" alt="" />
            <h1 className='font-semibold text-lg'>Personala Təlim & Dəstək</h1>
            <p className='text-md text-[#7D7D7D] font-medium max-w-[84%]'>Komandanız sistemi effektiv şəkildə istifadə etmək üçün praktiki təlim və əlavə təlimatlar alır.</p>
          </div>

          <div className='relative bg-white border-1 border-[#dee2e6] p-7 pt-19 rounded-lg'>
            <img className='absolute top-4 right-4 bg-[#ff4b43] p-3 rounded-full' src="./Icons/service-2-4.svg" alt="" />
            <h1 className='font-semibold text-lg'>Yanğın Siqnalizasyon Sistemləri</h1>
            <p className='text-md text-[#7D7D7D] font-medium max-w-[84%]'>Fəlakətə tez reaksiya göstərin.</p>
          </div>
        </div>
      </div>



    </section>
  )
}

export default Software