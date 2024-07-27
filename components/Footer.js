export default function Footer(){
return(<footer>
  <div className=" py-6 flex flex-row justify-center items-center gap-6">
    <span>
      &copy; {new Date().getFullYear()} Kushal. <br/>
    </span>
    <div className="flex flex-row gap-4">
      <a href ='/books' className="text-[#DA95DE] hover:font-bold">Reading List</a> 
      <a href ='/podcasts' className="text-[#DA95DE] hover:font-bold">Podcasts</a>
      <a href ='/essays' className="text-[#DA95DE] hover:font-bold">Essays</a>
    </div>
  </div>
</footer>
)
}