import { useState } from "react";
import { motion } from "motion/react";
import Head from "next/head";

function sendEvent(name) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, { event_category: "tteg" });
  }
}

export default function Tteg() {
  const [copied, setCopied] = useState(false);
  const installCmd = "uv tool install tteg";

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    sendEvent("copy_install_cmd");
    setTimeout(() => setCopied(false), 2000);
  };

  const CopyIcon = ({ copied }) =>
    copied ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
    );

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Head>
        <title>tteg – Free stock image search for AI agents</title>
        <meta name="description" content="Free stock image search CLI for AI coding agents. No API keys, no rate limits. Just search and get URLs." />
      </Head>

      <div className="flex flex-col px-6 py-8 md:px-[4rem] lg:px-[16rem]">
        {/* Hero */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-[#525051] font-[Sora] text-[2.5rem] md:text-[3.5rem] font-bold mb-2"
          >
            tteg
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-[1.1rem] md:text-[1.3rem] mb-8 max-w-[600px] leading-relaxed"
          >
            Free stock image search for AI coding agents. No API keys, no rate-limit BS. Just search and get URLs.
          </motion.p>
        </motion.div>

        {/* Demo image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-10"
        >
          <img
            src="/tteg.png"
            alt="tteg CLI in action"
            className="rounded-lg max-w-full md:max-w-[550px]"
          />
        </motion.div>

        {/* Install */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
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
        </motion.div>

        {/* How it works */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="mb-10"
        >
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="text-[#525051] font-[Sora] text-[1.4rem] md:text-[1.6rem] font-semibold mb-4"
          >
            How it works
          </motion.h2>

          <div className="grid gap-4 max-w-[550px]">
            {[
              { step: "1", text: "Your agent runs tteg \"hero banner\"" },
              { step: "2", text: "We search Unsplash, Pexels, and others behind the scenes" },
              { step: "3", text: "JSON with image URLs comes back — ready to drop into code" },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-4 bg-[#C4BBB3]/40 rounded-lg px-4 py-3"
              >
                <span className="text-[#DA95DE] font-[Sora] font-bold text-[1.2rem] shrink-0">
                  {item.step}
                </span>
                <span className="text-[1rem] md:text-[1.05rem]">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="mb-10"
        >
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="text-[#525051] font-[Sora] text-[1.4rem] md:text-[1.6rem] font-semibold mb-4"
          >
            Why tteg
          </motion.h2>

          <div className="grid gap-3 max-w-[550px]">
            {[
              "Zero config — no API keys, no .env files",
              "Works with any AI agent — Claude, Cursor, Copilot, whatever",
              "Real professional photos from Unsplash & Pexels",
              "Free forever — we handle rate limits for you",
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <span className="text-[#DA95DE] mt-1 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                <span className="text-[1rem] md:text-[1.05rem]">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex gap-4 text-[0.95rem]"
        >
          <a
            href="https://pypi.org/project/tteg/"
            className="underline text-[#9B9692] hover:text-[#DA95DE]"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sendEvent("click_pypi")}
          >
            PyPI
          </a>
          <a
            href="https://github.com/kiluazen/tteg"
            className="underline text-[#9B9692] hover:text-[#DA95DE]"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sendEvent("click_github")}
          >
            GitHub
          </a>
        </motion.div>
      </div>
    </>
  );
}
