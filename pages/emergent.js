import Head from "next/head";

export default function Emergent() {
  const work = [
    {
      title: "Team collaboration",
      body: "Emergent started as one person talking to an agent. I made it multiplayer — share an app with your team, give them access to tweak it, and build together in one chat.",
    },
    {
      title: "Mobile app deployment",
      body: "We were building mobile apps with Expo but only ever showing them as a preview. I built the pipeline that actually ships them — making the TestFlight and Play Store path painless.",
    },
    {
      title: "Integrations & Universal Key",
      body: "Integrations were our 2025 take on \"skills\" before skills existed — we called them playbooks internally. The Universal Key gave every app one key to all the AI models, powered by the user's Emergent credits, so people could build storytelling apps and every other AI use case without ever bringing their own API keys.",
    },
    {
      title: "Making the OpenAI models work (gpt-5.2 Responses API)",
      body: "We started and grew on Anthropic's Claude models. Around November the OpenAI models got genuinely competitive, so we rewrote our harness to run Codex models too: the Responses API on our infra, new tools like apply_patch, and a full prompt rewrite. People underestimate that last part — rewriting the prompts is the actually-hard, counterintuitive work.",
    },
    {
      title: "The self-driving agent",
      body: "Two things made Emergent's agent different. One: a roster of specialized subagents — a design subagent, a testing subagent, even an \"I can't crack this bug, maybe you can\" subagent. Two: where Claude Code or Codex expect a human driving them, Emergent's agent is self-driven — and since we don't own the model, that behavior is squeezed entirely out of the prompts. Understand the requirements, call design first, build the MVP, then must call testing, act on what it returns, and when you hand back to the user, offer three things you could build next. That choreography changes a ton from model to model.",
    },
    {
      title: "Customer support agent",
      body: "There was a big push to point our coding agent at other parts of the org. I took on customer support, which kept us from having to 2x the support team as we grew. Most of that work was building the MCP surfaces the agent needed: credit and ledger history, agent traces, users' production app logs, our own codebases (to tell whether a failure was actually a platform issue), and access to the sandboxes we give users. Stitched together, it handles the two things support is actually made of — credit issues and app-building frustration — surprisingly well.",
    },
  ];

  return (
    <>
      <Head>
        <title>Kushal — Emergent</title>
        <meta
          name="description"
          content="What I worked on at Emergent — an AI agent that ships production-ready apps."
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
          Emergent
        </h1>

        <p className="text-[1.05rem] md:text-[1.15rem] leading-relaxed text-[#525051] mb-10">
          I was an engineer at{" "}
          <a
            href="https://app.emergent.sh/landing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#DA95DE] hover:underline"
          >
            Emergent
          </a>{" "}
          — an AI agent that turns a prompt into a production-ready, full-stack
          app. By June 2026 it was nearing $200M ARR. Here's a timeline of the
          bigger chunks I shipped.
        </p>

        <div className="flex flex-col gap-8 mb-10">
          {work.map((item, i) => (
            <div key={i}>
              <h2 className="text-[#525051] font-[Sora] text-[1.2rem] md:text-[1.35rem] font-semibold mb-2">
                {item.title}
              </h2>
              <p className="text-[1.05rem] md:text-[1.1rem] leading-relaxed text-[#525051]">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <p className="text-[1.05rem] leading-relaxed text-[#525051] mb-10">
          <span className="font-semibold">Honorable mentions:</span> a pile of
          A/B experimentation frameworks, and bugs, bugs, bugs, bugs.
        </p>

        <p className="text-[1.05rem] md:text-[1.15rem] leading-relaxed text-[#525051] mb-6">
          If you read this far — go check out Emergent. It's a magical platform,
          and a labor of love.
        </p>

        <a
          href="https://app.emergent.sh/landing"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-[#9B9692] hover:text-[#DA95DE] text-[0.95rem]"
        >
          emergent.sh →
        </a>
      </div>
    </>
  );
}
