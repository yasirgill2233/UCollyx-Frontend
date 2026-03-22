import { useState } from "react";

export default function Dropdown({ label, items=[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button 
        className="bg-[#e5e7eb] px-4 py-2 rounded-lg text-[#374151] hover:bg-[#d1d5db] transition"
        onClick={()=>setOpen(!open)}
      >
        {label}
      </button>
      {open && (
        <div className="absolute mt-2 w-48 bg-white border border-[#e5e7eb] rounded-lg shadow-md z-50">
          {items.map((item,i)=>(
            <div key={i} className="px-4 py-2 hover:bg-[#f3f4f6] cursor-pointer">{item}</div>
          ))}
        </div>
      )}
    </div>
  );
}