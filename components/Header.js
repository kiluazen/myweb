import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Header() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag("config", "G-D3SC1WNS4Q", {
        page_path: url,
      });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const handleResumeClick = () => {
    window.gtag("event", "resume_click", {
      event_category: "engagement",
      event_label: "Resume Download",
    });
  };

  return (
    <header className="relative">
      <div className="absolute top-0 left-1 pt-7 md:pt-5 md:left-[9rem] md:lg:left-[13rem] xl:left-[21rem] ">
        <Link href="/">
          <img src="/logo.webp" className="w-[60px] md:w-[80px]" />
        </Link>
      </div>
      <div className="flex flex-row justify-end pr-3 pt-8 pb-12 md:pr-0 md:justify-center md:items-center">
        {/* <div className="flex flex-row md:pl-0 pt-8 pb-12"> */}
        <div className="flex flex-row px-2 gap-4 lg:gap-[3rem] text-[1.2rem]">
          <a
            className="hidden md:flex hover:text-[#DA95DE] font-medium"
            href="/"
          >
            Home
          </a>
          <a
            className="hover:text-flex hover:text-[#DA95DE] font-medium"
            href="/about"
          >
            About
          </a>
          <a className="hover:text-[#DA95DE] font-medium" href="/writing">
            Writing
          </a>
          <a className="hover:text-[#DA95DE] font-medium" href="/products">
            Products
          </a>
          <a
            className="hover:text-[#DA95DE] font-medium"
            href="/kushal_iitb.pdf"
            id="resume-clicked"
            onClick={handleResumeClick}
          >
            Resume
          </a>
        </div>
        {/* </div> */}
      </div>
      {/* <GoogleAnalytics /> */}
    </header>
  );
}
