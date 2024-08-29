import { useState, useRef } from 'react';

const Products = () => {
  const products = [
    { 
      name: "Interlocking Cone", 
      images: ["cone/cone_hand.jpeg", "cone/cone_rain.jpeg"],
      video: "cone/cone_demo_540p.mp4",
      thumbnail: "cone/cone_kushal.jpeg" // Add this line
    },
    { name: "Interlocking Heart", images: ["heart/heart_open.jpeg", "heart/heart_closed.jpeg", "heart/heart_open.jpeg"] },
    { name: "Calabi-Yau Manifold", images: ["calabi/calabi-yau.webp", "calabi/yellow.jpeg", "calabi/yellow_hole.jpeg"] },
  ];

  const [activeIndices, setActiveIndices] = useState(products.map(() => 0));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playingVideos, setPlayingVideos] = useState({});
  const videoRefs = useRef({});

  const handleScroll = (event, productIndex) => {
    const scrollPosition = event.target.scrollLeft;
    const imageWidth = event.target.children[0].offsetWidth;
    const newIndex = Math.round(scrollPosition / imageWidth);
    setActiveIndices(prev => prev.map((index, i) => i === productIndex ? newIndex : index));
  };

  const toggleVideo = (productIndex) => {
    const video = videoRefs.current[productIndex];
    if (video) {
      if (video.paused) {
        video.play();
        setPlayingVideos(prev => ({ ...prev, [productIndex]: true }));
      } else {
        video.pause();
        setPlayingVideos(prev => ({ ...prev, [productIndex]: false }));
      }
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="px-4 md:px-[1rem] md:lg:px-[2rem] lg:px-[6rem] xl:px-[12rem]">
      <div className='pb-4'>
        <h2 className='text-2xl font-bold'>Products</h2>
        <p className="pb-2">
          These products you see are ready to ship. I want to keep my entire focus on the product quality, So I will setup a store after I make my first sale.
        </p>
        <p>
          <button 
            onClick={openModal}
            className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
          >
            Interested? 
          </button>
          Drop your contact info. I'll reach out instantly, and you'll make my day!
        </p>
      </div>

      {products.map((product, productIndex) => (
        <div key={productIndex} className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-center md:text-left">{product.name}</h2>
          <div 
            className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-3 gap-4 pb-4 lg:pb-0 scrollbar-hide"
            onScroll={(e) => handleScroll(e, productIndex)}
          >
            {product.video && (
              <div className="w-full min-w-[300px] h-[250px] flex-shrink-0 overflow-hidden rounded-lg snap-center relative">
                <video 
                  ref={el => videoRefs.current[productIndex] = el}
                  src={`/products/${product.video}`}
                  className="w-full h-full object-cover"
                  controls={playingVideos[productIndex]}
                  poster={`/products/${product.thumbnail}`}
                >
                  Your browser does not support the video tag.
                </video>
                {!playingVideos[productIndex] && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer"
                    onClick={() => toggleVideo(productIndex)}
                  >
            
                    <img src='play.png' className="w-15 h-12"/>
                  </div>
                )}
              </div>
            )}
            {product.images.map((img, imgIndex) => (
              <div key={imgIndex} className="w-full min-w-[300px] h-[250px] flex-shrink-0 overflow-hidden rounded-lg snap-center">
                <img
                  src={`/products/${img}`}
                  alt={`${product.name} ${imgIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 lg:hidden">
            {product.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  index === activeIndices[productIndex] ? 'bg-[#845EC2]' : 'bg-[#DA95DE]'
                }`}
              />
            ))}
          </div>
        </div>
      ))}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Gateway to Contemplation</h3>
              <div className="mt-4 px-7 py-3">
                <form id="interestForm" action="https://formspree.io/f/xvgpgqdo" method="POST">
                  <input type="email" id="email" name="email" placeholder="Your Email" required className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                  <input type="tel" id="no" name="phone_no" placeholder="Phone Number" required className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                  <button type="submit" className="mt-4 bg-[#845EC2] hover:bg-[#DA95DE] text-[#DFD7CF] hover:text-[black] hover:font-bold rounded px-4 py-2">Submit</button>
                </form>
                <button onClick={closeModal} className="mt-4 bg-gray-300 hover:bg-gray-400 text-black rounded px-4 py-2">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;