import LinkItem from '../components/LinkItem';
import { podcasts } from '../data/podcasts';

export default function Home() {
  return (
    <div className="bg-[#DFD7CF] min-h-[90vh]">
      <div className="lg:px-[21rem] pl-6 pr-10 py-[3rem] lg:pt-[4rem] md:text-[1.2rem]">
        <h2 className="text-[#525051] font-[Sora] text-[1.8rem] md:text-[2.5rem] not-italic font-bold leading-[120%]">
          Podcasts
        </h2>
        <p>I listen to them once a quarter or so</p>
        <div className="flex flex-col gap-4 pt-4">
          {podcasts.map((podcast, index) => (
            <LinkItem
              key={index}
              title={podcast.title}
              url={podcast.url}
              linkText="spotify"
            />
          ))}
        </div>
      </div>
    </div>
  );
}