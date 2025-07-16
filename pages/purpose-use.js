import { useEffect, useRef } from 'react';
import Head from 'next/head';

export default function PurposeUseLanding() {
  const videoRef = useRef(null);

  useEffect(() => {
    // Add controls after component mounts to avoid hydration mismatch
    if (videoRef.current) {
      videoRef.current.controls = true;
    }
  }, []);

  const handleInstallClick = () => {
    window.open('https://chromewebstore.google.com/detail/purpose-use/bgappmaifghlncgmighdpnkadcabchjd', '_blank');
  };

  return (
    <>
      <Head>
        <title>Purpose Use - Stay Focused</title>
        <meta name="description" content="Data-driven approach to analyze context switches during work sessions. Chrome extension to help you focus." />
      </Head>

      <div className="px-4 md:px-8 lg:px-16 xl:px-24 py-2">
        <div className="max-w-4xl mx-auto">
          {/* Title and Description */}
          <div className="text-center mb-8">
            <h1 className="font-[Sora] text-[2rem] md:text-[2.5rem] font-bold text-[#525051] mb-4">
              Purpose Use
            </h1>
            <p className="text-[1.1rem] md:text-[1.2rem] text-[#525051] mb-8">
              Deep Focus for me is loading a probem into my head and staying inside that context for hours. <br /> <br />
              The internet is full of distractions <br /> Some obvious twitter, youtube. But some are benign which makes them dangerous<br />
              For me reading blogs or looking at product launches while I work are huge distractions <br /> <br />
              To track context switches and reflect on my behaviour I built this chrome extension.
            </p>
          </div>
        {/* CTA */}
        <div className="text-center pb-6">
            <button
              onClick={handleInstallClick}
              className="bg-[#DA95DE] hover:bg-[#845EC2] text-[#525051] hover:text-white font-bold py-3 px-6 rounded-lg text-[1.1rem] transition-all duration-300 hover:shadow-lg"
            >
              Install Purpose Use
            </button>
          </div>
          {/* Video */}
          <div className="pb-6">
            <div className="bg-[#DFD7CF] rounded-xl p-4 border border-[#DA95DE]">
              <video
                ref={videoRef}
                src="/purpose_use.mp4"
                className="w-full h-auto rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          
        </div>
      </div>
    </>
  );
} 