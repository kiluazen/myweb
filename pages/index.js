import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-[70vh] lg:min-[90vh]">
      <div>
        <div className="flex flex-col pt-[1rem] md:pt-[4rem] md:lg:flex-row md:px-[6rem] md:pb-[2rem] gap-[2rem] xl:px-[10rem] xl:py-[8rem] items-center">
          <div className="flex-1 flex flex-row justify-around items-center md:w-auto md:min-w-[300px]">
            <img
              src="/playground_pic.png"
              alt="Contemplation"
              className="rounded-[18px] min-w-[300] max-w-[500]"
            />
          </div>
          <div className="flex-1 items-start flex flex-col gap-2 md:gap-4 pl-4 md:pl-0 py-2 md:pt-0">
            <div className="flex flex-col gap-1 md:gap-4 text-[1rem] md:text-[1.2rem]">
              <h1 className="text-[#525051] font-[Sora] text-[1.8rem] md:text-[2.5rem] not-italic font-bold leading-[120%]">
               Hello! I'm Kushal
              </h1>
              <h3 className="text-[#525051] font-[Sora] text-[1.5rem] not-italic font-bold leading-[120%]">
              Currently
              </h3>
              <ul></ul>
                <li>Building <a href="https://hyphenbox.com" className="text-[#9B9692] hover:text-[#DA95DE]">hyphenbox</a> : a “second cursor” that guides users inside SaaS apps</li>
                <li>Independent consultant : browser agents, memory layers, AI engineering </li>
                <li>Always up for conversations about what you’re building</li>
              
              <p>
              What I've built: <a href="/portfolio" className="text-[#9B9692] hover:text-[#DA95DE]">[portfolio]</a>
              </p>
              <p>
                I'd love to hear from you: <a
                href="mailto:kushalsokke@gmail.com?subject=Coffee!"
                className="text-[#9B9692] hover:text-[#DA95DE]"
              >
                [email]
              </a>
              </p>
            </div>
  
            <div className="flex flex-col gap-2 md:flex-row md:gap-4">
              <div>
                <span>Curated Media :</span>
              </div>
              <div className="flex flex-row gap-4">
                <a
                  href="/books"
                  className="underline text-[#9B9692] hover:text-[#DA95DE]"
                >
                  Books
                </a>
                <a
                  href="/podcasts"
                  className="underline text-[#9B9692] hover:text-[#DA95DE]"
                >
                  Podcasts
                </a>
                <a
                  href="/essays"
                  className="underline text-[#9B9692] hover:text-[#DA95DE]"
                >
                  Essays
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
