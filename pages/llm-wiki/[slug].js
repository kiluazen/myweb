import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import Link from "next/link";
import Head from "next/head";

export default function WikiPost({ frontmatter, content }) {
  return (
    <>
      <Head>
        <title>{frontmatter.title} — llm-wiki</title>
        <meta name="description" content={frontmatter.description || ""} />
        <meta property="og:title" content={`${frontmatter.title} — llm-wiki`} />
        <meta property="og:description" content={frontmatter.description || ""} />
        <meta property="og:image" content="https://kushalsm.com/llm-wiki/hero.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="flex flex-col md:pt-[3rem] px-6 py-[2rem] md:px-[6rem] lg:px-[14rem] gap-4 pb-16">
        <Link
          href="/llm-wiki"
          className="text-[#9b7bbf] hover:text-[#845EC2] font-[Sora] text-[0.95rem] font-bold"
        >
          ← llm-wiki
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="text-[#845EC2] font-[Sora] text-[1.7rem] md:text-[2.2rem] not-italic font-bold leading-[120%]">
            {frontmatter.title}
          </h1>
          {frontmatter.publishDate && (
            <p className="text-[#9b7bbf] font-[Sora] text-[0.95rem] font-bold">
              {frontmatter.publishDate}
            </p>
          )}
        </div>
        <hr className="border-[#DA95DE] py-1" />
        <article
          className="blog-content min-w-0 w-full break-words text-[1.05rem] md:text-[1.15rem] leading-[1.75] text-[#3a3340] max-w-none
            [&>h2]:font-[Sora] [&>h2]:text-[#845EC2] [&>h2]:text-[1.35rem] [&>h2]:md:text-[1.6rem] [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-3 [&>h2]:leading-[125%]
            [&>h3]:font-[Sora] [&>h3]:text-[#525051] [&>h3]:text-[1.15rem] [&>h3]:font-bold [&>h3]:mt-7 [&>h3]:mb-2
            [&>p]:mb-4
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>ul>li]:mb-1
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-5 [&>ol>li]:mb-1
            [&_a]:underline [&_a]:text-[#DA95DE] hover:[&_a]:text-[#845EC2]
            [&_strong]:font-bold [&_strong]:text-[#525051]
            [&_code]:bg-[#f3ecfa] [&_code]:px-1 [&_code]:rounded [&_code]:text-[0.9em]
            [&_pre]:bg-[#f3ecfa] [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:text-[0.8rem] [&_pre]:md:text-[0.95rem] [&_pre]:leading-[1.6] [&_pre]:whitespace-pre-wrap [&_pre]:break-words
            [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[1em]
            [&_blockquote]:border-l-4 [&_blockquote]:border-[#DA95DE] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#525051] [&_blockquote]:my-5
            [&_table]:w-full [&_table]:my-6 [&_table]:text-[0.85rem] [&_table]:md:text-[0.95rem] [&_table]:border-collapse [&_table]:block [&_table]:overflow-x-auto
            [&_th]:text-left [&_th]:font-bold [&_th]:text-[#525051] [&_th]:border-b-2 [&_th]:border-[#DA95DE] [&_th]:p-2 [&_th]:align-top
            [&_td]:border-b [&_td]:border-[#EADBF3] [&_td]:p-2 [&_td]:align-top"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <hr className="border-[#DA95DE] py-1 mt-4" />
        <Link
          href="/llm-wiki"
          className="text-[#9b7bbf] hover:text-[#845EC2] font-[Sora] text-[0.95rem] font-bold"
        >
          ← back to llm-wiki
        </Link>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const dir = path.join(process.cwd(), "data/llm-wiki");
  const filenames = await fs.readdir(dir);
  const paths = filenames
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ params: { slug: f.replace(".md", "") } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const dir = path.join(process.cwd(), "data/llm-wiki");
  const fileContents = await fs.readFile(
    path.join(dir, `${params.slug}.md`),
    "utf8",
  );
  const { data, content } = matter(fileContents);
  const htmlContent = marked(content, { breaks: true, gfm: true });
  return { props: { frontmatter: data, content: htmlContent } };
}
