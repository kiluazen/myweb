export default function Header() {
    return (
        <header className="relative"> 
  <div className="absolute top-0 left-4 md:left-[10rem] md:lg:left-[15rem] xl:left-[21rem] pt-5"><img src='/logo.webp' className="w-[80px]"/></div>
  <div className="flex justify-end pr-6 md:pr-0 md:justify-center md:items-center">
  <div className="flex flex-row md:pl-0 pt-6">
    <div className="flex flex-row gap-6 lg:gap-[3rem] text-[1.2rem]">
      <a className="hover:text-[#DA95DE] font-medium"  href='/'>Home</a>
      <a className="hover:text-[#DA95DE] font-medium" href='/about'>About</a>
      <a className="hover:text-[#DA95DE] font-medium" href='/blog'>Blog</a>
      <a className="hover:text-[#DA95DE] font-medium" href='/resume.pdf' id = 'resume-clickeed'>Resume</a>
    </div>
  </div>
  </div>
  {/* <GoogleAnalytics /> */}

</header>
    )
}