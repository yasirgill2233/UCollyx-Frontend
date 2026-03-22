export default function Modal({ isOpen, onClose, title, children }) {
  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose}></div>
      <div className="bg-white rounded-xl shadow-lg z-50 max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[#111827] font-semibold text-lg">{title}</h3>
          <button className="text-[#6b7280] font-bold text-xl" onClick={onClose}>×</button>
        </div>
        <div className="text-[#374151]">{children}</div>
      </div>
    </div>
  );
}