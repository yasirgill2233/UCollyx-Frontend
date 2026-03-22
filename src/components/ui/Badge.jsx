export default function Badge({ children, type="primary" }) {
  let bg="", text="";
  if(type==="primary") { bg="#3b82f6"; text="#ffffff"; }
  else if(type==="success") { bg="#10b981"; text="#ffffff"; }
  else if(type==="warning") { bg="#f59e0b"; text="#111827"; }
  else if(type==="danger") { bg="#ef4444"; text="#ffffff"; }
  else { bg="#e5e7eb"; text="#374151"; }

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-semibold`} style={{background:bg, color:text}}>
      {children}
    </span>
  );
}