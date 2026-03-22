export default function Alert({ children, type="success" }) {
  let bg="", text="";
  if(type==="success") { bg="#d1fae5"; text="#065f46"; }
  else if(type==="warning") { bg="#fef3c7"; text="#78350f"; }
  else if(type==="danger") { bg="#fee2e2"; text="#991b1b"; }
  else { bg="#e5e7eb"; text="#374151"; }

  return (
    <div className="p-4 rounded-lg mb-4" style={{background:bg, color:text}}>
      {children}
    </div>
  );
}