import { ArrowRight } from 'lucide-react'
import React, { useState } from 'react'
import SEO from '../../components/SEO/SEO';

const Contact = () => {

    const [isSwapped, setIsSwapped] = useState(false);

    const handleBranchClick = () => {
        setIsSwapped(!isSwapped);
    };
    return (
        <>
            <SEO
                title="Bizimlə Əlaqə - Gunay Beauty"
                description="Gunay Beauty ilə əlaqə saxlayın. Azərbaycandakı filiallarımıza baş çəkin və ya telefon, e-poçt və sosial media vasitəsilə bizimlə əlaqə saxlayın."
                keywords="əlaqə gunay beauty, gözəllik mağazası əlaqə, Azərbaycan gözəllik, gunay beauty telefon, gunay beauty e-poçt"
                image="/Icons/logo.jpeg"
                type="website"
            />
            <section className='bg-[#f7fafc] pt-10 inter min-h-screen'>
                <div className='bg-white md:max-w-[80vw] mx-auto md:rounded-lg border-1 border-[#dee2e6]'>

                    <div className='border-1 border-[#dee2e6] text-2xl font-bold text-center py-5 md:rounded-t-lg md:border-0 md:text-start md:p-9'>
                        <h1>Bizimlə Əlaqə</h1>
                    </div>
                    <div className='border-b-1 md:border-0 border-[#dee2e6] md:flex justify-between'>
                        <div className='flex p-9 md:pt-0 gap-3 flex-col text-md whitespace-nowrap font-semibold'>
                            <div className='flex items-center gap-4'>
                                <img className='w-8 shrink-0' src="./Icons/phone.svg" alt="" />
                                <p className='text-sm'>Telefon: +994 055 674 06 49</p>
                            </div>

                            <div className='flex items-center gap-4'>
                                <img className='w-8' src="./Icons/email-icon.svg" alt="" />
                                <p className='text-sm'>E-poçt: İnfo@gunaybeauty.az</p>
                            </div>

                        </div>

                        <div>
                            <p className='p-9 md:pb-3 pt-0 text-sm font-semibold text-[#808080]'>Sosial Media</p>

                            <div className='flex gap-3 p-9 pt-0'>
                                <a href="https://www.tiktok.com/@gunaybeautystore?_r=1&_t=ZS-93eHGF9EpIg" target="_blank" rel="noopener noreferrer">
                                    <img className='w-8 h-8' src="./Icons/tiktok.svg" alt="" />


                                </a>
                                <a href="https://www.instagram.com/gunaybeautystore?igsh=MW9sMHh6cWVxZnQ0Yw==" target="_blank" rel="noopener noreferrer">
                                    <img className='w-8' src="./Icons/instagram.svg" alt="" />
                                </a>
                            </div>
                        </div>


                    </div>

                </div>

                <BranchesSection />



            </section>
        </>
    )
}

export default Contact