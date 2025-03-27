import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/mousewheel';

// import required modules
import { FreeMode, Pagination, Thumbs, Mousewheel } from 'swiper/modules';

const ImageGallery = ({ product }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const baseUrl = import.meta.env.VITE_SERVER_URL;

  // Set main image source
  const mainImgSrc = product?.mainImage?.url 
    ? encodeURI(`${baseUrl}/${product.mainImage.url.replace(/\\/g, '/')}`)
    : '';

  useEffect(() => {
    setIsMounted(true);
    if (mainImgSrc) {
      setSelectedImage(mainImgSrc);
    }
    return () => setIsMounted(false);
  }, [mainImgSrc]);

  if (!isMounted || !product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex flex-col-reverse md:flex-row w-full gap-4">
      <div className="relative w-full md:w-20">
        <Swiper
          style={{
            height: '100%'
          }}
          onSwiper={setThumbsSwiper}
          direction={window.innerWidth >= 768 ? 'vertical' : 'horizontal'}
          spaceBetween={10}
          freeMode={true}
          watchSlidesProgress={true}
          mousewheel={true}
          modules={[FreeMode, Thumbs, Mousewheel]}
          autoHeight={true}
          className="mySwiper md:!absolute w-full h-full md:w-20 overflow-x-auto md:overflow-y-auto"
          breakpoints={{
            768: {
              slidesPerView: "auto",
            },
            0: {
              slidesPerView: 3,
            }
          }}
        >
          <SwiperSlide>
            <img
              src={mainImgSrc}
              alt={product.mainImage?.alt || ''}
              loading="eager"
              className={`w-20 object-cover cursor-pointer rounded-lg border-3 ${selectedImage === mainImgSrc ? 'border-indigo-300' : 'border-gray-100'}`}
              onClick={() => setSelectedImage(mainImgSrc)}
            />
          </SwiperSlide>
          {product.images?.map((image) => {
            const imgSrc = encodeURI(`${baseUrl}/${image.url.replace(/\\/g, '/')}`);
            return (
              <SwiperSlide key={image._id} className="w-24">
                <img
                  src={imgSrc}
                  alt={image.alt}
                  loading="lazy"
                  className={`w-20 object-cover cursor-pointer rounded-lg border-3 ${selectedImage === imgSrc ? 'border-indigo-300' : 'border-gray-100'}`}
                  onClick={() => setSelectedImage(imgSrc)}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination, Thumbs]}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        className="mySwiper2 flex-1 w-full max-h-max rounded-xl"
      >
        <SwiperSlide>
          <img
            src={mainImgSrc}
            alt={product.mainImage?.alt || ''}
            loading="eager"
            className="w-full object-cover rounded-xl duration-500 hover:scale-130"
          />
        </SwiperSlide>
        {product.images?.map((image) => {
          const imgSrc = encodeURI(`${baseUrl}/${image.url.replace(/\\/g, '/')}`);
          return (
            <SwiperSlide key={image._id}>
              <img
                src={imgSrc}
                alt={image.alt}
                loading="lazy"
                className="w-full object-cover rounded-xl duration-500 hover:scale-130"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ImageGallery;