// pages/blog/[slug].js
import { useState, useEffect } from 'react';
// import BaseLayout from '../../components/BaseLayout';
// import Bio from '../../components/Bio';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export default function BlogPost({ frontmatter, content }) {
  return (
    // <BaseLayout title={frontmatter.title} description={frontmatter.description} current="blog">
    <div>
      <div className="flex flex-col md:pt-[4rem] px-6 py-[2rem] md:px-[4rem] lg:px-[18rem] gap-4">  
        <div className="flex flex-col justify-center items-center">  
          <h1 className="text-[#525051] font-[Sora] text-[1.8rem] md:text-[2rem] not-italic font-bold leading-[120%]">{frontmatter.title}</h1>
          <p className="text-[#525051] font-[Sora] md:text-[1.2rem] non-italic font-bold">{frontmatter.publishDate}</p>
        </div>
        <hr className="border-[#DA95DE] py-2"/>
        <div className="">
          <article className="text-[1rem] md:text-[1.2rem]" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        <hr className="border-[#DA95DE] py-2"/>
        {/* <Bio /> */}
      </div>
    {/* </BaseLayout> */}
    </div>
  );
}

export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), 'data/blog-posts');
  const filenames = await fs.readdir(postsDirectory);

  const paths = filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => ({
      params: { slug: filename.replace('.md', '') },
    }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const postsDirectory = path.join(process.cwd(), 'data/blog-posts');
  const filePath = path.join(postsDirectory, `${params.slug}.md`);
  const fileContents = await fs.readFile(filePath, 'utf8');
  
  const { data, content } = matter(fileContents);
  const htmlContent = marked(content);

  return {
    props: {
      frontmatter: data,
      content: htmlContent,
    },
  };
}