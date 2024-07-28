import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-[90vh]">
      <Head>
        <title>Contemplation</title>
        <link rel="icon" href="/contemplation.ico" />
      </Head>

      <div>
        <div className="flex flex-col pt-[3rem] md:lg:flex-row md:px-[6rem] md:pb-[2rem] gap-[2rem] xl:px-[10rem] xl:py-[8rem] items-center">
          <div className="flex-1 flex flex-row justify-around items-center w-[400px] md:w-auto md:min-w-[300px]">
            <Image src="/playground_pic.png" alt="Contemplation" width={400} height={400} className="rounded-[18px]"/>
          </div>
          <div className="flex-1 items-start flex flex-col gap-2 md:gap-4 pl-4 md:pl-0 py-2 md:pt-0">
            <div className="flex flex-col gap-1 md:gap-4 text-[1rem] md:text-[1.2rem]">
              <h1 className="text-[#525051] font-[Sora] text-[1.8rem] md:text-[2.5rem] not-italic font-bold leading-[120%]">I'm Kushal</h1>
              <p>Here I showcase my Work, thoughts, interests to the world.</p>
              <p>Please Reach out. I wanna connect with awesome humans across the internet</p>
              <p>Also, I am making myself cold email people I admire, This web would be a nice intro for that. As Brian Chesky said it, <br/>"To build Trust, you have to remove strange from the stranger"</p>
            </div>
            <div className="flex flex-row gap-4">
              <a href="mailto:kushalsokke@gmail.com?subject=Coffee!" className="underline text-[#9B9692] font-bold hover:italic hover:text-[#DA95DE]">Email</a>
              <a href="https://twitter.com/KushalSM5" className="underline text-[#9B9692] font-bold hover:italic hover:text-[#DA95DE]">Twitter</a>
              <a href="https://github.com/kiluazen" className="underline text-[#9B9692] font-bold hover:italic hover:text-[#DA95DE]">Github</a>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-4">
              <div>
                <span>Curated Lists :</span>
              </div>
              <div className="flex flex-row gap-4">
                <a href="/books" className="underline text-[#9B9692] hover:font-bold hover:text-[#DA95DE]">Reading List</a>
                <a href="/podcasts" className="underline text-[#9B9692] hover:font-bold hover:text-[#DA95DE]">Podcasts</a>
                <a href="essays" className="underline text-[#9B9692] hover:font-bold hover:text-[#DA95DE]">Essays</a>
              </div>
            </div>
            <a href="/products" className="underline text-[#9B9692] font-bold hover:italic hover:text-[#DA95DE]">
              My Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}