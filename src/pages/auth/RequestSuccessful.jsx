import { Link2, Search, Key, ArrowLeft, ArrowRight, CheckCircle2, Timer, Check } from "lucide-react";
import { useNavigate } from "react-router";

export default function RequestSuccessful() {

  const navigate = useNavigate(); // Hook initialize karein

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f0f2f5] p-4 font-sans">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-[480px] p-8 border border-gray-100 min-h-[550px] flex flex-col justify-between">

      
          <div className="animate-in zoom-in fade-in duration-500 flex flex-col items-center text-center h-full">
            <div className="bg-green-50 w-20 h-20 rounded-md flex items-center justify-center mb-8">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Request sent!</h2>
            <p className="text-gray-400 mt-4 px-6 leading-relaxed">
              Your join request has been sent to the workspace admin of <br/>
              <span className="text-indigo-600 font-bold">{ "Design Studio X"}</span>
            </p>
            <p className="text-gray-400 text-sm mt-8 px-4">
              You'll receive an email once they approve your request. This usually takes a few minutes.
            </p>

            <div className="w-full bg-yellow-50/50 border border-yellow-100 rounded-md p-5 mt-10 flex gap-4 text-left">
              <span className="text-xl">⌛</span>
              <div className="space-y-1">
                <h5 className="text-yellow-800 font-bold text-sm">Waiting for approval</h5>
                <p className="text-yellow-700/70 text-xs leading-relaxed">Meanwhile, you can ask the admin to invite you directly via email for instant access.</p>
              </div>
            </div>

            <button className="w-full mt-10 py-4 bg-indigo-500/90 text-white rounded-md font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3">
              Go to Dashboard <ArrowRight size={20} />
            </button>
            
            <button onClick={() => navigate('/workspace-selection')} className="mt-6 text-gray-400 text-sm hover:text-indigo-500 transition-all">
              ← Choose different option
            </button>
          </div>
      

      </div>
    </div>
  );
}