import Head from "next/head";

export default function Autark() {
  const different = [
    "Built to work best with your agents — it lives in your Claude Code / Codex, not a separate dashboard.",
    "Your agent gets its own email inbox.",
    "Your LinkedIn is operated locally. Most SDR tools get you banned; running it on your own machine doesn't.",
    "The agent does a lot, but the message and the quality control are always yours.",
    "Hypothesis-based lead gen — the new idea. Leads are collected against a hypothesis about who the product is for. Run it a while and you start seeing which hypotheses actually get replies, then lean into those.",
  ];

  return (
    <>
      <Head>
        <title>Kushal — Autark</title>
        <meta
          name="description"
          content="Autark — the AI SDR I built to run locally with my own coding agent and surface high-intent leads."
        />
      </Head>

      <div className="px-6 py-10 md:py-14 max-w-[720px] mx-auto">
        <a
          href="/products"
          className="text-[#9B9692] hover:text-[#DA95DE] text-[0.9rem]"
        >
          ← all products
        </a>

        <h1 className="text-[#525051] font-[Sora] text-[2.4rem] md:text-[3rem] font-bold mt-6 mb-3">
          Autark
        </h1>

        <p className="text-[1.15rem] md:text-[1.25rem] leading-relaxed text-[#525051] mb-8">
          I know the world doesn't need another AI SDR. Let me tell you why this
          one might still interest you.
        </p>

        <div className="flex flex-col gap-5 text-[1.05rem] md:text-[1.15rem] leading-relaxed text-[#525051] mb-10">
          <p>
            I built Autark for me. I've shipped a lot of dev tools and plugins,
            and the hard part was never the building — it was finding the handful
            of people who actually have the problem. That takes patience and a
            real feel for the product. Autark does that part for me.
          </p>
          <p>
            It's an AI SDR, but the whole point is that it runs{" "}
            <span className="font-semibold">
              locally, driven by my own coding agent
            </span>{" "}
            — bringing the structure and harness an agent needs, while my data
            stays mine.
          </p>
        </div>

        <h2 className="text-[#525051] font-[Sora] text-[1.3rem] md:text-[1.5rem] font-semibold mb-4">
          What's different
        </h2>
        <ul className="flex flex-col gap-3 mb-10">
          {different.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-[1.05rem] md:text-[1.1rem] leading-relaxed text-[#525051]"
            >
              <span className="text-[#DA95DE] mt-1 shrink-0">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-[1.05rem] md:text-[1.15rem] leading-relaxed text-[#525051] mb-10">
          It's your Claude Code and Codex with the Autark system on top. You're
          never locked in — and all the memory and feedback makes your own agent
          better over time, not just at outreach. It's been genuinely useful for
          finding high-intent leads for the things I actually work on.
        </p>

        <a
          href="https://autark.sh"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-[#9B9692] hover:text-[#DA95DE] text-[0.95rem]"
        >
          autark.sh →
        </a>
      </div>
    </>
  );
}
