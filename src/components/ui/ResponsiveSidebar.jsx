import { useState } from "react";

export default function ResponsiveSidebar() {
  const [open, setOpen] = useState(false);
  const items = ["Dashboard","Users","Settings"];

  return (
    <>
      <button className="md:hidden px-4 py-2 bg-[#2563eb] text-white rounded-lg" onClick={()=>setOpen(!open)}>
        ☰
      </button>
      <div className={`fixed top-0 left-0 h-full w-64 bg-[#1e40af] text-white p-5 transition-transform ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <h1 className="text-2xl font-bold mb-10">UCollyx</h1>
        <nav className="space-y-2">
          {items.map(item=>(
            <a key={item} className="block px-4 py-2 rounded-r-lg hover:bg-[#1d4ed8]">{item}</a>
          ))}
        </nav>
      </div>
    </>
  );
}