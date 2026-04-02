import { useState } from "react";

export default function Tteg() {
  const [copied, setCopied] = useState(false);
  const installCmd = "uv tool install tteg";

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CopyIcon = ({ copied }) =>
    copied ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
    );

  return (
    <div className="flex flex-col px-6 py-8 md:px-[4rem] lg:px-[16rem]">
      <h1 className="text-[#525051] font-[Sora] text-[2.5rem] md:text-[3rem] font-bold mb-4">
        tteg
      </h1>
      <p className="text-[1.1rem] md:text-[1.3rem] mb-8">
        Free stock image search for AI coding agents. No API keys, no rate-limit BS. Just search and get URLs.
      </p>

      <div className="mb-8">
        <img
          src="/tteg.png"
          alt="tteg CLI in action"
          className="rounded-lg max-w-full md:max-w-[550px] mb-8"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-[#525051] font-[Sora] text-[1.4rem] md:text-[1.6rem] font-semibold mb-3">
          Install
        </h2>
        <div className="flex items-center bg-[#C4BBB3] rounded-lg px-4 py-3 max-w-[550px] overflow-hidden">
          <code className="flex-1 text-[0.9rem] md:text-[1rem] select-all truncate min-w-0">
            {installCmd}
          </code>
          <button
            onClick={handleCopy}
            className="shrink-0 text-[#9B9692] hover:text-[#DA95DE] transition-colors duration-200 cursor-pointer ml-3"
            aria-label={copied ? "Copied" : "Copy command"}
          >
            <CopyIcon copied={copied} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 text-[0.95rem]">
        <a href="https://pypi.org/project/tteg/" className="underline text-[#9B9692] hover:text-[#DA95DE]" target="_blank" rel="noopener noreferrer">
          PyPI
        </a>
      </div>
    </div>
  );
}
