import Head from "next/head";

export default function Emergent() {
  const work = [
    {
      title: "Team Collaboration",
      points: [
        "emergent was a one person talking to agent product. I made it multi people in chat.",
        "Share the app internally with your team, give them access to tweak it and so on.",
      ],
    },
    {
      title: "Mobile App Deployment",
      points: [
        "We were using expo and just showing it as a preview.",
        "Built the pipeline to deploy it, and made the testflight and play store process easy.",
      ],
    },
    {
      title: "Integrations, Universal Key",
      points: [
        "Integrations: the 2025 version of skills before skills. We called it playbooks internally.",
        "Universal Key: one api key for all the ai models, powered by the users' emergent credits.",
        "This allowed people to build story telling apps and many ai app usecases without having to bring their api keys.",
      ],
    },
    {
      title: "gpt-5.2 Responses api",
      points: [
        "Our platform started and grew through anthropic claude models. Around November I saw the openai models being competitive.",
        {
          text: "So we had to rewrite our harness to make codex models work. Which meant:",
          sub: [
            "responses api on our infra i.e harness",
            "new tools like apply patch",
            "rewrite our prompts",
          ],
        },
        "People underestimate the rewrite our prompts part, that is the one thats actually hard and counterintuitive at times.",
      ],
    },
    {
      title: "Two things unique to emergent",
      points: [
        "Many specialised subagents: design subagent, testing subagent, \"I cant figure out the bug maybe you can\" subagent, and so on.",
        "The unique agent behaviour difference with claude-code or codex: claude-code expects to be driven by someone. For emergent its all self driven, and since we don't own the model that is done through the prompts.",
        "Example: understand the requirements, call the design subagent first, and then after the MVP, must call the testing agent. Work on the comments returned by the testing agent. And as you leave the user message give them 3 options that you could build next.",
        "And so on. this kind of self driving approach. And these prompts change a ton from model to model.",
      ],
    },
    {
      title: "Customer Support Agent",
      points: [
        "Finally, there was a large effort to use our coding agent in other dimensions in the org. And I took on the customer support agent role. This helped us from not 2xing the customer support team for the rate of growth we had.",
        {
          text: "Mainly the work here is building the mcp surfaces to be able to plugin to the agent:",
          sub: [
            "mcp for the credit history and all that ledger for the agent",
            "mcp for agent trace",
            "mcp for users' app production logs",
            "our codebases (so that it can figure out if its a platform issue)",
            "mcp to access sandboxes provided to the users",
          ],
        },
        {
          text: "All of this combined makes for a very impressive customer support. Cause our customer support consists of:",
          sub: ["credit issues", "app building frustrations etc."],
        },
      ],
    },
  ];

  const honorable = ["tons of A/B experimenting frameworks", "bugs bugs bugs bugs"];

  const SubList = ({ items, level = 1 }) => (
    <ul className={`flex flex-col gap-2 ${level === 1 ? "mt-2 pl-5" : "mt-1.5 pl-6"}`}>
      {items.map((p, i) => {
        const text = typeof p === "string" ? p : p.text;
        return (
          <li
            key={i}
            className={`${
              level === 1
                ? "text-[1rem] md:text-[1.05rem] text-[#525051]"
                : "text-[0.95rem] md:text-[1rem] text-[#6b6869]"
            } leading-relaxed`}
          >
            <span
              className="mr-2"
              style={{ color: level === 1 ? "#9B9692" : "#C4A0C9" }}
            >
              •
            </span>
            <span>{text}</span>
            {typeof p !== "string" && p.sub && (
              <SubList items={p.sub} level={2} />
            )}
          </li>
        );
      })}
    </ul>
  );

  const Section = ({ title, points }) => (
    <li>
      <div className="flex items-baseline gap-2">
        <span className="text-[#DA95DE] text-[1.1rem]">•</span>
        <span className="font-[Sora] font-semibold text-[1.2rem] md:text-[1.35rem] text-[#525051]">
          {title}
        </span>
      </div>
      <div className="pl-5">
        <SubList items={points} />
      </div>
    </li>
  );

  return (
    <>
      <Head>
        <title>Kushal — Emergent</title>
        <meta
          name="description"
          content="What I worked on at Emergent, an AI agent that ships production ready apps."
        />
      </Head>

      <div className="px-6 py-10 md:py-14 max-w-[760px] mx-auto">
        <h1 className="text-[#525051] font-[Sora] text-[2.4rem] md:text-[3rem] font-bold mb-3">
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
          </a>
          , an AI agent that turns a prompt into a production ready, full stack
          app. As of June it is at near $200M ARR. I am gonna list down some of
          the big chunk work I have done, in a timeline.
        </p>

        <ul className="flex flex-col gap-7 mb-10">
          {work.map((w, i) => (
            <Section key={i} title={w.title} points={w.points} />
          ))}
          <Section title="honorable mentions" points={honorable} />
        </ul>

        <p className="text-[1.05rem] md:text-[1.15rem] leading-relaxed text-[#525051] mb-6">
          If you are reading this far, please checkout{" "}
          <a
            href="https://app.emergent.sh/landing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#DA95DE] hover:underline"
          >
            Emergent
          </a>
          . It's a magical platform, labor of love.
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
