import React, {useRef, useState } from "react";
import { Image as ImageIcon, X, ArrowLeft, ArrowRight, Hexagon, Plus, Upload } from "lucide-react";
import { useNavigate } from "react-router";

export default function WorkspaceSetup() {
  const [step, setStep] = useState(1);
  const [emails, setEmails] = useState(["", ""]); // Starting with 2 email fields

  const navigate = useNavigate();

  // --- Naya State aur Ref Logo ke liye ---
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // FileReader ka use karke image ko URL mein convert karna
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Email add karne ka function
  const addEmailField = () => setEmails([...emails, ""]);
  
  // Email remove karne ka function
  const removeEmailField = (index) => {
    const updatedEmails = emails.filter((_, i) => i !== index);
    setEmails(updatedEmails);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-md shadow-xl w-full max-w-[31%] overflow-hidden border border-gray-100">
        
        {/* Tab Header */}
        <div className="flex border-b border-gray-100">
          <div className={`flex-1 py-4 pt-8 text-center text-sm font-semibold transition-all ${step === 1 ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-400"}`}>
            Workspace Details
          </div>
          <div className={`flex-1 py-4 pt-8 text-center text-sm font-semibold transition-all ${step === 2 ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-400"}`}>
            Invite Team
          </div>
        </div>

        <div className="p-8">
          {step === 1 ? (
            /* STEP 1: Workspace Details */
            <div className="flex flex-col items-center animate-in fade-in duration-500">
              <div className="bg-indigo-500 p-3 rounded-2xl text-white mb-6">
                <Hexagon size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Create Your Workspace</h2>
              <p className="text-gray-500 text-sm mt-1 mb-8">Set up your collaboration space</p>

              <div className="w-full space-y-5 text-left">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Workspace Name</label>
                  <input type="text" placeholder="My Awesom Workspace" className="w-full border border-gray-200 rounded-md p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  <p className="text-[11px] text-gray-400 mt-1">This will be visible to all members of your workspace</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Timezone</label>
                  <select className="w-full border border-gray-200 rounded-md p-3 outline-none bg-white text-gray-600">
                    <option>(GMT-8:00) Pacific Time - Los Angeles</option>
                  </select>
                  <p className="text-[11px] text-gray-400 mt-1">Used for scheduling and notifications</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Workspace Owner Email</label>
                  <input type="email" placeholder="sara.johnson@acmecorp.com" className="w-full border border-gray-200 rounded-md p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  <p className="text-[11px] text-gray-400 mt-1">You will become the Organization Admin.</p>
                </div>

                {/* Logo Section - Updated */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Workspace Logo (Optional)</label>
                  <div className="flex items-center gap-4">
                    {/* Logo Preview Container */}
                    <div className="w-14 h-14 border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center overflow-hidden bg-gray-50 relative group">
                      {logoPreview ? (
                        <>
                          <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => setLogoPreview(null)}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} className="text-white" />
                          </button>
                        </>
                      ) : (
                        <ImageIcon size={24} className="text-gray-400" />
                      )}
                    </div>
                    {/* Hidden Input & Custom Button */}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleLogoChange} 
                      className="hidden" 
                      accept="image/*" 
                    />
                    <button 
                      type="button"
                      onClick={triggerFileInput}
                      className="border border-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-all"
                    >
                      <Upload size={16} />
                      {logoPreview ? "Change Logo" : "Upload Logo"}
                    </button>
                </div>
                </div>
              </div>

              <div className="flex gap-4 w-full mt-10">
                <button onClick={() => navigate(-1)} className="flex-1 py-3 border border-gray-200 rounded-md font-semibold text-gray-500 flex items-center justify-center gap-2">
                  <ArrowLeft size={18} /> Back
                </button>
                <button onClick={() => setStep(2)} className="flex-[1.5] py-3 bg-blue-600 text-white rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                  Next: Invite Team <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: Invite Team */
            <div className="flex flex-col items-center animate-in slide-in-from-right duration-500">
              <span className="text-4xl mb-6">👋</span>
              <h2 className="text-2xl font-bold text-gray-800">Invite your team</h2>
              <p className="text-gray-500 text-sm mt-1 mb-8">Add team members to <span className="text-blue-600 font-bold">devsloop</span></p>

              <div className="w-full space-y-3 mb-6">
                {emails.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <input 
                      type="email" 
                      placeholder={`teammate${index+1}@company.com`} 
                      className="flex-1 border border-gray-200 rounded-md p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button onClick={() => removeEmailField(index)} className="p-3 border border-red-100 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-all">
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button onClick={addEmailField} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-md text-gray-500 font-medium flex items-center justify-center gap-2 hover:border-blue-300 hover:text-blue-500 transition-all">
                  <Plus size={18} /> Add another email
                </button>
              </div>

              <div className="bg-blue-50 p-4 rounded-md flex gap-3 mb-8">
                <span className="text-lg">💡</span>
                <p className="text-[12px] text-blue-700 leading-tight">Invites will be sent after workspace is created. Team members can also join later via invite link.</p>
              </div>

              <div className="flex gap-4 w-full">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 rounded-md font-semibold text-gray-500 flex items-center justify-center gap-2">
                  <ArrowLeft size={18} /> Back
                </button>
                <button className="flex-[1.5] py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                  Create Workspace
                </button>
              </div>
              <button className="mt-6 text-sm text-blue-500 font-medium hover:underline">Skip for now</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}