import { useNavigate } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
      {/* Icon & Error Code */}
      <div className="relative mb-8">
        <h1 className="animate-bounce text-[120px] font-black text-indigo-100 leading-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
        </div>
      </div>

      {/* Text Content */}
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Oops! Page not found
      </h2>
      <p className="text-gray-500 max-w-md mb-10">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-all"
        >
          Go Back
        </button>
        
        <button 
          onClick={() => navigate("/")} 
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
        >
          <Home size={18} />
          Back to Home
        </button>
      </div>

      {/* Decorative Element */}
      <div className="mt-20 text-gray-300 text-sm font-medium tracking-widest uppercase">
        UCollyx Collaboration Space
      </div>
    </div>
  );
};

export default NotFound;