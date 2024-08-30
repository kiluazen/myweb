// pages/blog/index.js
import { useState, useEffect } from 'react';
// import BaseLayout from '../../components/BaseLayout';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export default function BlogIndex({ posts }) {
  return (
    // <BaseLayout title="Blog" description="Latest articles." current="blog">
    <div>
      <div className="flex flex-col pt-[4rem] pl-4 gap-4 lg:px-[21rem]">
        <h1 className="text-[#525051] font-[Sora] text-[1.8rem] pb-4 md:text-[2.5rem] not-italic font-bold leading-[120%]">Blog</h1>
        <div className="flex flex-col gap-[1rem]">
          {posts.map((post, index) => (
            <div key={post.slug}>
              {index !== 0 && <hr className="border-[#DA95DE] py-2"/>}
              <div className="flex flex-col gap-2 pr-10 md:pr-0">
                <h2 className="text-[#525051] font-[Sora] text-[1.5rem] not-italic font-bold leading-[120%]">
                  <a href={`/writing/${post.slug}`}>{post.title}</a>
                </h2>
                <p className="text-[#525051] text-[1.2rem] font-bold]">{post.description}</p>
                <div className="text-[#525051] font-[Sora] non-italic font-bold">
                  <span>{post.publishDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    {/* </BaseLayout> */}
    </div>
  );
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'data/blog-posts');
  const filenames = await fs.readdir(postsDirectory);

  const posts = await Promise.all(filenames
    .filter(filename => filename.endsWith('.md'))
    .map(async (filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = await fs.readFile(filePath, 'utf8');
      const { data } = matter(fileContents);
      return {
        slug: filename.replace('.md', ''),
        title: data.title,
        description: data.description,
        publishDate: data.publishDate,
      };
    }));

  posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

  return {
    props: {
      posts,
    },
  };
}