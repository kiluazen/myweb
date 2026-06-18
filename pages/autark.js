import Head from "next/head";

export default function Autark() {
  const groups = [
    {
      title: "Built to work best with your agents",
      points: [
        "agent gets its own email box.",
        "your linkedin is operated locally. Lot of sdrs struggle with linkedin bans.",
        "there is a lot that the agent does, but ultimately the message and quality control is done by you!!",
      ],
    },
    {
      title: "A new idea baked in: Hypothesis based Lead gen",
      points: [
        "Leads are collected based on hypothesis of the product. And after a while of running autark, you will see which hypothesis is responding better and so on.",
      ],
    },
    {
      title: "Finally, I built this for me",
      points: [
        "I built many dev tools and plugins, etc. there is patience and understanding of the product involved in finding these people who have a high chance of having the problem etc. And autark does that for you.",
      ],
    },
  ];

  const SubList = ({ items }) => (
    <ul className="flex flex-col gap-2 mt-2">
      {items.map((p, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-[#9B9692] shrink-0 leading-relaxed">•</span>
          <div className="text-[1rem] md:text-[1.1rem] leading-relaxed text-[#525051]">
            {p}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <Head>
        <title>Kushal — Autark</title>
        <meta
          name="description"
          content="Autark, the AI SDR I built to run locally with my own coding agent and surface high intent leads."
        />
      </Head>

      <div className="px-4 sm:px-6 py-8 sm:py-12 md:py-14 max-w-[800px] mx-auto">
        <div className="bg-[#DFD7CF] rounded-xl border border-[#DA95DE] p-5 sm:p-7 md:p-10">
          <h1 className="text-[#525051] font-[Sora] text-[2.1rem] sm:text-[2.5rem] md:text-[3rem] font-bold mb-3">
            Autark
          </h1>

          <p className="text-[1.05rem] sm:text-[1.15rem] md:text-[1.25rem] leading-relaxed text-[#525051] mb-6 sm:mb-8">
            I know the world doesn't need another AI SDR. I will tell you why
            this might interest you.
          </p>

          <img
            src="/autark-demo.png"
            alt="The Autark dashboard, incoming replies with 561 leads and 29 hypotheses in flight"
            className="rounded-lg sm:rounded-xl border border-[#C4BBB3] shadow-sm w-full mb-8 md:mb-10"
          />

          <ul className="flex flex-col gap-6 sm:gap-7 mb-8">
            {groups.map((g, i) => (
              <li key={i}>
                <div className="flex items-baseline gap-2">
                  <span className="text-[#DA95DE] shrink-0">•</span>
                  <span className="font-[Sora] font-semibold text-[1.1rem] sm:text-[1.25rem] md:text-[1.35rem] text-[#525051]">
                    {g.title}
                  </span>
                </div>
                <div className="pl-4 sm:pl-5">
                  <SubList items={g.points} />
                </div>
              </li>
            ))}
          </ul>

          <p className="text-[0.9rem] sm:text-[0.95rem] italic leading-relaxed text-[#9B9692] mb-8">
            ps: I love the word so much I will probably name it for some other
            product I build.
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
      </div>
    </>
  );
}
