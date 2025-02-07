import { useState } from "react";

const Portfolio = () => {
  const projects = [
    {
        name: "PurposefulUse",
        description: "Chrome extension tracking daily context switches",
        year: "2025",
        link: "https://chromewebstore.google.com/detail/purpose-use/bgappmaifghlncgmighdpnkadcabchjd"
      },

      {
        name: "GtC",
        description: "3D printed Contemplative Toys",
        year: "2024",
        link: "/products" // This could link to your existing products page
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
      description: "Speechify but you can create custom voices",
      year: "2024",
      link: "https://chromewebstore.google.com/detail/recite/phfjcdmiejoobfkokhfemoflmaepfdna"
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