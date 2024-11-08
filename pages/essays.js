import LinkItem from '../components/LinkItem';
import {essays} from '../data/essays';

export default function Home() {
  return (
    <div className="bg-[#DFD7CF] min-h-[90vh]">
      <div className="lg:px-[21rem] pl-6 pr-10 py-[3rem] lg:pt-[4rem] md:text-[1.2rem]">
        <h2 className="text-[#525051] font-[Sora] text-[1.8rem] md:text-[2.5rem] not-italic font-bold leading-[120%]">
          Essays
        </h2>
        <div className="flex flex-col gap-4 pt-4">
          {essays.map((book, index) => (
            <LinkItem
              key={index}
              title={book.title}
              url={book.url}
              linkText={book.linkText}
            />
          ))}
        </div>
      </div>
    </div>
  );
}