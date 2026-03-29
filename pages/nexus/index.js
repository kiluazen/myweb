import { useState } from "react";

export default function Nexus() {
  const [copiedMcp, setCopiedMcp] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const mcpUrl = "https://nexus-tad5z6m6za-el.a.run.app/mcp/";

  const handleCopyMcp = () => {
    navigator.clipboard.writeText(mcpUrl);
    setCopiedMcp(true);
    setTimeout(() => setCopiedMcp(false), 2000);
  };

  const handleCopyCli = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
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
        Nexus
      </h1>
      <p className="text-[1.1rem] md:text-[1.3rem] mb-8">
        Track workouts and meals by just talking to ChatGPT, Claude, or any AI agent.
      </p>

      <div className="mb-8">
        <h2 className="text-[#525051] font-[Sora] text-[1.4rem] md:text-[1.6rem] font-semibold mb-3">
          CLI
        </h2>
        <div className="flex items-center bg-[#C4BBB3] rounded-lg px-4 py-3 max-w-[550px] overflow-hidden">
          <code className="flex-1 text-[0.9rem] md:text-[1rem] select-all truncate min-w-0">
            uv tool install nexus-fitness
          </code>
          <button
            onClick={() => handleCopyCli("uv tool install nexus-fitness")}
            className="shrink-0 text-[#9B9692] hover:text-[#DA95DE] transition-colors duration-200 cursor-pointer ml-3"
            aria-label={copiedCli ? "Copied" : "Copy command"}
          >
            <CopyIcon copied={copiedCli} />
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-[#525051] font-[Sora] text-[1.4rem] md:text-[1.6rem] font-semibold mb-3">
          MCP
        </h2>
        <div className="flex items-center bg-[#C4BBB3] rounded-lg px-4 py-3 max-w-[550px] overflow-hidden">
          <code className="flex-1 text-[0.9rem] md:text-[1rem] select-all truncate min-w-0">
            {mcpUrl}
          </code>
          <button
            onClick={handleCopyMcp}
            className="shrink-0 text-[#9B9692] hover:text-[#DA95DE] transition-colors duration-200 cursor-pointer ml-3"
            aria-label={copiedMcp ? "Copied" : "Copy URL"}
          >
            <CopyIcon copied={copiedMcp} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 text-[0.95rem]">
        <a href="/nexus/privacy-policy" className="underline text-[#9B9692] hover:text-[#DA95DE]">
          Privacy Policy
        </a>
        <a href="/nexus/terms-of-service" className="underline text-[#9B9692] hover:text-[#DA95DE]">
          Terms of Service
        </a>
      </div>
    </div>
  );
}
