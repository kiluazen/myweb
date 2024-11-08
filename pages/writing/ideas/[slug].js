import { useState, useEffect } from "react";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export default function IdeaPost({ frontmatter, content }) {
  return (
    <div>
      <div className="flex flex-col md:pt-[4rem] px-6 py-[2rem] md:px-[4rem] md:lg:px-[12rem] lg:px-[16rem] gap-4">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-[#525051] font-[Sora] text-[1.8rem] md:text-[2rem] not-italic font-bold leading-[120%]">
            {frontmatter.title}
          </h1>
          <p className="text-[#525051] font-[Sora] md:text-[1.2rem] non-italic font-bold">
            {frontmatter.publishDate}
          </p>
        </div>
        <hr className="border-[#DA95DE] py-2" />
        <div className="">
          <article
            className="text-[1rem] md:text-[1.2rem] blog-content [&>p]:mb-4 [&>p:empty]:mb-8 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&_a]:underline [&_a]:text-[#DA95DE] hover:[&_a]:text-[#845EC2] "
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        <hr className="border-[#DA95DE] py-2" />
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const ideasDirectory = path.join(process.cwd(), "data/idea-posts");
  const filenames = await fs.readdir(ideasDirectory);

  const paths = filenames
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => ({
      params: {
        slug: filename.replace(".md", ""),
      },
    }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const ideasDirectory = path.join(process.cwd(), "data/idea-posts");
  const filePath = path.join(ideasDirectory, `${params.slug}.md`);
  const fileContents = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const renderedContent = marked(content);

  return {
    props: {
      frontmatter: data,
      content: renderedContent,
    },
  };
}