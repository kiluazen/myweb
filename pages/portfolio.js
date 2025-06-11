import { useState } from "react";

const Portfolio = () => {
  const projects = [
    {
      name: "Hyphenbox",
      description: "An SDK for building interactive user onboarding and in-app guidance flows with browser agents that keep tutorials up-to-date with UI changes",
      link: "https://hyphenbox.com"
    },
    {
        name: "PurposefulUse",
        description: "Data Driven Approach to analyse context switches during work sessions, Helping you focus and use Computers with Purpose",
        link: "https://chromewebstore.google.com/detail/purpose-use/bgappmaifghlncgmighdpnkadcabchjd"
      },

      {
        name: "Gateway to Contemplation",
        description: "Gtc are fascinating geometric shapes 3D printed!, that make you contemplate and see the beauty around you",
        link: "/products"
      },

      {
        name: "ChatSync",
        description: "Move chats from Claude to ChatGPT and vice versa seemlessly",
        link: "https://chromewebstore.google.com/search/ChatSync%20Extension"
      },

      {
        name: "Facemax",
        description: "Clone yourself with hyper-realistic image generation and AI-powered skin analysis",
        link: "https://facemax.pro/"
      },
    {
      name: "Elzo AI",
      description: "User research Chatbot that has conversations with users wherever they are via call or whatsapp, and mines product insights through AI analysis",
      link: "https://elzo.ai/"
    },
    
    {
      name: "Recite",
      description: "text-to-speech Chrome extension that combines Speechify functionality with custom AI voice creation capabilities",
      link: "https://chromewebstore.google.com/detail/recite/phfjcdmiejoobfkokhfemoflmaepfdna"
    },
    
    {
      name: "CompareMacros",
      description: "Compare any two foods macro-by-macro analysis for meal planning",
      link: "https://comparemacros.netlify.app"
    },
    
    {
      name: "Computer Vision Course",
      description: "Contributed chapters on Model Optimization and deployment for 🤗 Hugging Face's computer vision Course",
      link: "https://github.com/huggingface/computer-vision-course/pull/123" 
    },
  ];

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-24 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project, index) => (
          <a 
            key={index} 
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#DFD7CF] rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1 border border-[#DA95DE] flex flex-col"
          >
            <div className="font-[Sora] text-lg font-bold text-[#525051] mb-3 flex-shrink-0">
              {project.name}
            </div>
            <div className="text-[#525051] text-sm leading-relaxed">
              {project.description}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;