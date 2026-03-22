import { useState } from "react";

export default function Tabs({ tabs=[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex border-b border-[#e5e7eb] mb-4">
        {tabs.map((tab,i)=>(
          <button 
            key={i} 
            className={`px-4 py-2 font-semibold ${active===i ? "border-b-2 border-[#2563eb] text-[#111827]" : "text-[#6b7280] hover:text-[#111827]"}`}
            onClick={()=>setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="text-[#374151]">
        {tabs[active]?.content}
      </div>
    </div>
  );
}