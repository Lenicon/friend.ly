import {useRef, useCallback} from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../assets/css/imageSlider.css";


export default function ImageSlider({images, onClose}) {
    const sliderRef = useRef(null);

    const handlePrev = useCallback(()=>{
        if (!sliderRef.current) return;
        sliderRef.current.swiper.slidePrev();
    }, []);

    const handleNext = useCallback(() => {
        if (!sliderRef.current) return;
        sliderRef.current.swiper.slideNext();
    }, []);
  
    return (
    <div className='images-slider'>
        <div className='images-slider-close' onClick={onClose}>
            <i className='fa-solid fa-xmark'></i>
        </div>
        <div className='slider-container'>
            <Swiper
                ref={sliderRef}
                modules={[Pagination]}
                loop={true}
                navigation={false}
                pagination={true}
                spaceBetween={0}
                slidesPerView={1}
            >
                <div className='arrow prev' onClick={handlePrev}/>
                <div className='arrow next' onClick={handleNext}/>

                
                {images.map((image, index)=>(
                    <SwiperSlide key={index}>
                        <img src={image?.url} alt="" className="image-slide"/>
                    </SwiperSlide>
                    )
                )}
            </Swiper>
        </div>
    </div>
  )
}
