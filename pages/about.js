function about() {
  return (
    <div>
      <div className="flex flex-col py-[1rem] md:gap-[2rem] md:px-[4rem] md:pt-[4rem] md:lg:px-[4rem] lg:px-[6rem] xl:px-[10rem] 2xl:px-[18rem] lg:pt-[6rem]">
        <div className="flex flex-col md:lg:flex-row-reverse justify-center items-center gap-4 md:gap-[4rem]">
          <div className="flex flex-row justify-center items-center">
            <img
              className="rounded-[18px] max-w-[400px] min-w-[300px]"
              src="/about/color-2.jpg"
              alt="My Picture"
            />
          </div>
          <div className="flex flex-col gap-[1rem] text-[1.2rem] pl-4 pr-8 md:pl-0 md:pr-0">
            <p>Graduated Aerospace Engineer from IIT Bombay 24. Currently In Banglore</p>
            <h1 className="text-[#525051] font-[Sora] text-[1.5rem] not-italic font-bold leading-[120%]">
              Interests
            </h1>
            <p>
              The wealth creation that startups enable. Putting myself in a place that leads to compound
              growth.
            </p>
            <p>
              I love reading Biographies, Instances where a small group of people do incredible things.(Bell Labs, Xerox, Ycomb)
            </p>
            <div className="flex flex-col xl:flex-row gap-2">
              <p>Some curated lists, I revist every year: </p>
              <div className="flex flex-row gap-6 md:gap-2">
                <a
                  href="/books"
                  className="underline text-[#9B9692] hover:font-bold hover:text-[#DA95DE]"
                >
                  Books
                </a>
                <a
                  href="/podcasts"
                  className="underline text-[#9B9692] hover:font-bold hover:text-[#DA95DE]"
                >
                  Podcasts
                </a>
                <a
                  href="/essays"
                  className="underline text-[#9B9692] hover:font-bold hover:text-[#DA95DE]"
                >
                  Essays/Articles
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-4 md:flex-row md:gap-[2rem] md:justify-between text-[1.2rem]">
          <div className="flex flex-col justify-start items-start gap-[1rem] pl-4 pr-8 md:pl-0 md:pr-0">
            <p>
            If you’re reading this, feel free to send me a message</p>
            <p>
            Are you in Banglore? let's get {" "}
              <span className="font-bold">Coffee</span>
              :)
            </p>
            <div className="flex flex-row gap-6">
              <a
                href="mailto:kushalsokke@gmail.com?subject=Coffee!"
                className="underline text-[#9B9692] font-bold hover:italic hover:text-[#DA95DE]"
              >
                Email
              </a>
              <a
                href="https://twitter.com/KushalSM5"
                className="underline text-[#9B9692] font-bold hover:italic hover:text-[#DA95DE]"
              >
                Twitter
              </a>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center">
            <img
              className="max-w-[400px] min-w-[300px] rounded-[18px]"
              src="/about/coffee.jpg"
              alt="My Picture"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default about;
