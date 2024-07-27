function about() {

    return (
        <div>
            <div class="flex flex-col py-[3rem] md:gap-[2rem] md:px-[4rem] md:pt-[4rem] md:lg:px-[4rem] lg:px-[6rem] xl:px-[10rem] 2xl:px-[18rem] lg:pt-[6rem]">
        <div class="flex flex-col md:lg:flex-row-reverse justify-center items-center gap-4 md:gap-[4rem]">
        <div class="flex flex-row justify-center items-center">
            <img class="rounded-[18px] max-w-[400px] min-w-[300px]" src="/about/color-2.jpg" alt="My Picture"/>
         </div>
        <div class="flex flex-col gap-[1rem] text-[1.2rem] pl-4 pr-8 md:pl-0 md:pr-0">
        <p>Aerospace Grad from IIT Bombay 24. Currently In Banglore
        </p>
        <h1 class="text-[#525051] font-[Sora] text-[1.5rem] not-italic font-bold leading-[120%]" >Interests</h1>
        <p>How far a group of driven people can go. The wealth creation that startups enable. Putting myself in a place that leads to compound effects.</p>
        <p>I love reading Biographies, Instances where a small group of great people do incredible things.(Bell Labs, Xerox, Ycomb)</p>
        <p>I am a deep learning practitioner along with my Aerospace Course work. If you wanna know why I decided to work on software AI instead of moving forward in Aerospace <a href="/blog/swtich-to-software">read..</a></p>
        <div class="flex flex-col xl:flex-row gap-2">
          <p>Some curated lists, I revist every year: </p> 
          <div class="flex flex-row gap-6 md:gap-2">
            <a href="/books" class="underline text-[#9B9692] hover:font-bold hover:text-[#DA95DE]">Books</a>
            <a href="/podcasts" class="underline text-[#9B9692] hover:font-bold hover:text-[#DA95DE]">Podcasts</a> 
            <a href="/essays" class="underline text-[#9B9692] hover:font-bold hover:text-[#DA95DE]">Essays/Articles</a>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-center gap-4 md:flex-row md:gap-[2rem] md:justify-between text-[1.2rem]">
      <div class="flex flex-col justify-start items-start gap-[1rem] pl-4 pr-8 md:pl-0 md:pr-0">
        <p>I made this website to serve as a gateway to meet awesome people <br/> to remove the strange from the stranger (As Brian Chesky says it.)</p>
        <p>I'd be very happy to hear from you, Let's get some <span class="font-bold">Coffee</span></p>
        <div class="flex flex-row gap-6">
          <a href="mailto:kushalsokke@gmail.com?subject=Coffee!" class="underline text-[#9B9692] font-bold hover:italic hover:text-[#DA95DE]">Email</a>
          <a href="https://twitter.com/KushalSM5" class="underline text-[#9B9692] font-bold hover:italic hover:text-[#DA95DE]">Twitter</a>
        </div>
      </div>
      <div class="flex flex-row justify-center items-center">
        <img class="max-w-[400px] min-w-[300px] rounded-[18px]" src="/about/coffee.jpg" alt="My Picture" />
      </div>
     
    </div>
  </div>
</div>
    )
}

export default about;