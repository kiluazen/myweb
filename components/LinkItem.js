export default function LinkItem({ title, url, linkText }) {
    return (
      <div className="flex flex-row">
        <p className="w-[18rem]">{title}</p>
        <a className="text-[#DA95DE] hover:font-bold" href={url}>
          {linkText}
        </a>
      </div>
    );
  }