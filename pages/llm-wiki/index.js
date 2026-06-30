import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Head from "next/head";

export default function LlmWikiIndex({ posts }) {
  return (
    <>
      <Head>
        <title>llm-wiki — Kushal</title>
        <meta
          name="description"
          content="A student of history. Research notes, market histories, and product thinking I keep coming back to."
        />
        <meta property="og:title" content="llm-wiki — Kushal" />
        <meta
          property="og:description"
          content="A student of history. Research notes, market histories, and product thinking I keep coming back to."
        />
        <meta property="og:image" content="https://kushalsm.com/llm-wiki/hero.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="flex flex-col px-6 md:px-[8rem] lg:px-[16rem] md:pt-[2.5rem] gap-6 pb-16">
        <div className="flex flex-col gap-3">
          <h1 className="font-[Sora] text-[1.8rem] md:text-[2.5rem] text-[#845EC2] font-bold leading-[120%]">
            llm-wiki
          </h1>
          <p className="text-[#525051] text-[1.1rem] md:text-[1.3rem] max-w-[42rem]">
            A student of history. Research notes, market histories, and the
            product thinking I keep coming back to.
          </p>
        </div>

        <img
          src="/llm-wiki/hero.png"
          alt="llm-wiki"
          className="w-full rounded-2xl border border-[#EADBF3]"
        />

        <div className="flex flex-col gap-[1rem]">
          {posts.map((post, index) => (
            <div key={post.slug}>
              {index !== 0 && <hr className="border-[#DA95DE] py-2" />}
              <Link
                href={`/llm-wiki/${post.slug}`}
                className="group flex flex-col gap-2 pr-6 md:pr-0"
              >
                <h2 className="text-[#525051] group-hover:text-[#845EC2] font-[Sora] text-[1.4rem] md:text-[1.6rem] font-bold leading-[125%]">
                  {post.title}
                </h2>
                <p className="text-[#525051] text-[1.05rem] lg:text-[1.15rem]">
                  {post.description}
                </p>
                <span className="text-[#9b7bbf] font-[Sora] text-[0.95rem] font-bold">
                  {post.publishDate}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const dir = path.join(process.cwd(), "data/llm-wiki");
  const filenames = await fs.readdir(dir);

  const posts = await Promise.all(
    filenames
      .filter((f) => f.endsWith(".md"))
      .map(async (filename) => {
        const fileContents = await fs.readFile(path.join(dir, filename), "utf8");
        const { data } = matter(fileContents);
        return {
          slug: filename.replace(".md", ""),
          title: data.title || filename.replace(".md", ""),
          description: data.description || "",
          publishDate: data.publishDate || "",
          order: typeof data.order === "number" ? data.order : 99,
        };
      }),
  );

  posts.sort(
    (a, b) =>
      a.order - b.order ||
      new Date(b.publishDate) - new Date(a.publishDate),
  );

  return { props: { posts } };
}
