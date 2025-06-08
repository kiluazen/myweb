import { useState } from "react";

const Portfolio = () => {
  const projects = [
    {
        name: "PurposefulUse",
        description: "Chrome extension that tracks context switches on my work sessions",
        year: "2025",
        link: "https://chromewebstore.google.com/detail/purpose-use/bgappmaifghlncgmighdpnkadcabchjd"
      },

      {
        name: "Hyphenbox",
        description: "AI-powered platform for seamless text hyphenation and layout optimization.",
        year: "2024",
        link: "https://hyphenbox.com"
      },

      {
        name: "GtC",
        description: "3D printed Contemplative Toys",
        year: "2024",
        link: "/products" // This could link to your existing products page
      },

      {
        name: "ChatSync",
        description: "Chrome Extension that exports conversation from claude.ai and chatgpt.com",
        year: "2024",
        link: "https://chromewebstore.google.com/search/ChatSync%20Extension" // This could link to your existing products page
      },

      {
        name: "Facemax",
        description: "Android app for hyper-realistic avatar generation & skin analysis + product recommendation",
        year: "2024",
        link: "https://facemax.pro/"
      },
    {
      name: "Elzo AI",
      description: "AI User researcher that turns user feedback into product insights",
      year: "2024",
      link: "https://elzo.ai/" // You can define where each project should link to
    },
    
    {
      name: "Recite",
      description: "Speechify + make your own voices",
      year: "2024",
      link: "https://chromewebstore.google.com/detail/recite/phfjcdmiejoobfkokhfemoflmaepfdna"
    },
    
    {
      name: "CompareMacros",
      description: "Compare macro by macro of any 2 foods",
      year: "2023",
      link: "https://comparemacros.netlify.app/" 
    },
    
    {
      name: "Computer Vision Course",
      description: "Chapters on Model Optimization and Model Optimization for a course by Hugging Face",
      year: "2023",
      link: "https://github.com/johko/computer-vision-course/pull/123" 
    },
  ];

  return (
    <div className="px-4 md:px-[1rem] lg:px-[18rem] py-8">
      <div className="flex flex-col ">  {/* reduced gap between rows */}
        {projects.map((project, index) => (
          <a 
            key={index} 
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid grid-cols-[1.2fr,1.8fr,0.4fr] items-center p-3 hover:bg-[#DFD7FE] rounded-lg transition-colors"
          >
            <div className="font-[Sora] text-[1.1rem] font-bold text-[#525051]">
              {project.name}
            </div>
            <div className="text-[#525051] text-[1rem]">
              {project.description}
            </div>
            <div className="text-[#525051] font-[Sora] font-bold justify-self-end">
              {project.year}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;