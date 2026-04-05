import React, { useRef, useState, useEffect } from "react";
import { Image as ImageIcon, X, ArrowLeft, ArrowRight, Hexagon, Plus, Upload, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

// --- Helper: Slugify Function ---
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Spaces to -
    .replace(/[^\w-]+/g, '')  // Remove non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
};

export default function WorkspaceSetup() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // --- States ---
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [timezone, setTimezone] = useState("(GMT+5:00) Pakistan Standard Time");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [emails, setEmails] = useState(["", ""]); // Team invites

  // --- Auto-fill Owner Email (Optional: Based on logged-in user) ---
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) setOwnerEmail(user.email);
  }, []);

//   const triggerFileInput = () => {
//   fileInputRef.current.click();
// };

  // --- Handlers ---
  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    setSlug(slugify(val));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // const handleEmailChange = (index, value) => {
  //   const newEmails = [...emails];
  //   newEmails[index] = value;
  //   setEmails(newEmails);
  // };

  const addEmailField = () => setEmails([...emails, ""]);
  const removeEmailField = (index) =>
    setEmails(emails.filter((_, i) => i !== index));

  // --- Final Submit Logic ---
  const handleCreateWorkspace = async () => {
    if (!name || !slug) return alert("Workspace name and URL are required!");

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("timezone", timezone);
      formData.append("ownerEmail", ownerEmail);

      // Filter empty emails and append
      const validEmails = emails.filter((email) => email.trim() !== "");
      formData.append("invitedEmails", JSON.stringify(validEmails));

      if (fileInputRef.current.files[0]) {
        formData.append("logo", fileInputRef.current.files[0]);
      }
      
      console.log(formData)

      const res = await API.post("/workspace/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res)

      setStep(2)

      // Success: Redirect to the new workspace dashboard
      // navigate(`/${res.data.data.slug}/dashboard`);
    } catch (err) {
      console.log(err)
      alert(err.response?.data?.message || "Failed to create workspace");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvites = async () => {
    // Sirf wo emails lein jo khali nahi hain
    const validEmails = emails.filter((email) => email.trim() !== "");
    
    if (validEmails.length === 0) {
        // Agar koi email nahi dala to direct dashboard par le jayein
        return navigate(`/${slug}/dashboard`);
    }

    setIsLoading(true);
    try {
        await API.post("/workspace/invite-members", {
            workspaceSlug: slug, // Workspace ki pehchan ke liye
            emails: validEmails,
            inviterName: JSON.parse(localStorage.getItem("user")).full_name
        });

        alert("Invitations sent successfully!");
        navigate(`/${slug}/dashboard`); // Dashboard par redirect karein
    } catch (err) {
        alert("Workspace created, but failed to send some invites.");
        navigate(`/${slug}/dashboard`);
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f0f2f5] p-4">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-[31%] overflow-hidden border border-gray-100">
        {/* Tab Header */}
        <div className="flex border-b border-gray-100">
          <div
            className={`flex-1 py-4 pt-8 text-center text-sm font-semibold transition-all ${step === 1 ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-400"}`}
          >
            Workspace Details
          </div>
          <div
            className={`flex-1 py-4 pt-8 text-center text-sm font-semibold transition-all ${step === 2 ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-400"}`}
          >
            Invite Team
          </div>
        </div>

        <div className="p-8">
          {step === 1 ? (
            /* STEP 1: Workspace Details */
            /* STEP 1: Workspace Details */
            <div className="flex flex-col items-center animate-in fade-in duration-500">
              <div className="bg-indigo-600 p-3 rounded-2xl text-white mb-6 shadow-lg shadow-indigo-100">
                <Hexagon size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Create Your Workspace
              </h2>
              <p className="text-gray-500 text-sm mt-1 mb-8">
                Set up your collaboration space
              </p>

              <div className="w-full space-y-5 text-left">
                {/* Workspace Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="e.g. UCollyx Devs"
                    className="w-full border border-gray-200 rounded-md p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50/30"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 px-1">
                    This will be visible to all members of your workspace
                  </p>
                </div>

                {/* Workspace Slug (URL) */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Workspace URL
                  </label>
                  <div className="flex items-center group">
                    <div className="bg-gray-100 border border-r-0 border-gray-200 p-3 rounded-l-md text-gray-400 text-xs font-medium">
                      ucollyx.com/
                    </div>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(slugify(e.target.value))}
                      placeholder="your-workspace-url"
                      className="flex-1 border border-gray-200 rounded-r-md p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm bg-white font-medium text-indigo-600"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1.5 px-1 font-mono">
                    Suggested slug based on your workspace name
                  </p>
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full border border-gray-200 rounded-md p-3 outline-none bg-white text-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="PKT">
                      (GMT+5:00) Pakistan Standard Time - Karachi
                    </option>
                    <option value="PST">
                      (GMT-8:00) Pacific Time - Los Angeles
                    </option>
                    <option value="UTC">
                      (GMT+0:00) Universal Coordinated Time
                    </option>
                  </select>
                </div>

                {/* Owner Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Owner Email
                  </label>
                  <input
                    type="email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="sara.johnson@acmecorp.com"
                    className="w-full border border-gray-200 rounded-md p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50/30"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 px-1">
                    You will be assigned as the{" "}
                    <strong>Organization Admin</strong>.
                  </p>
                </div>

                {/* Logo Section */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Workspace Logo (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 relative group shadow-sm">
                      {logoPreview ? (
                        <>
                          <img
                            src={logoPreview}
                            alt="Logo"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setLogoPreview(null)}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} className="text-white" />
                          </button>
                        </>
                      ) : (
                        <ImageIcon size={24} className="text-gray-300" />
                      )}
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()} // Direct ref call
                      className="border border-gray-200 px-4 py-2 rounded-md text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-all hover:border-gray-300 active:scale-95"
                    >
                      <Upload size={14} />
                      {logoPreview ? "Change Logo" : "Upload Logo"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 w-full mt-10">
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 py-3.5 border border-gray-200 rounded-md font-bold text-gray-400 text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={handleCreateWorkspace}
                  disabled={!name || !slug || !ownerEmail}
                  className="flex-[1.5] py-3.5 bg-indigo-600 text-white rounded-md font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  Next: Invite Team <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: Invite Team */
            /* STEP 2: Invite Team */
<div className="flex flex-col items-center animate-in slide-in-from-right duration-500">
    <span className="text-4xl mb-6">👋</span>
    <h2 className="text-2xl font-bold text-gray-800">Invite your team</h2>
    <p className="text-gray-500 text-sm mt-1 mb-8">
        Add team members to <span className="text-indigo-600 font-bold">{name || "Workspace"}</span>
    </p>

    <div className="w-full space-y-3 mb-6">
        {emails.map((email, index) => (
            <div key={index} className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                        const newEmails = [...emails];
                        newEmails[index] = e.target.value;
                        setEmails(newEmails);
                    }}
                    placeholder={`teammate${index + 1}@company.com`}
                    className="flex-1 border border-gray-200 rounded-md p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                {emails.length > 1 && (
                    <button
                        onClick={() => removeEmailField(index)}
                        className="p-3 border border-red-100 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-all"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>
        ))}
        <button
            onClick={addEmailField}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-md text-gray-500 font-medium flex items-center justify-center gap-2 hover:border-indigo-300 hover:text-indigo-500 transition-all"
        >
            <Plus size={18} /> Add another email
        </button>
    </div>

    <div className="flex gap-4 w-full">
        <button
            onClick={() => setStep(1)}
            className="flex-1 py-3 border border-gray-200 rounded-md font-semibold text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50"
        >
            <ArrowLeft size={18} /> Back
        </button>
        <button 
            onClick={handleSendInvites} // Ab ye final create trigger karega
            disabled={isLoading}
            className="flex-[1.5] py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
        >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Finish & Create"}
        </button>
    </div>
    
    <button 
        onClick={handleSendInvites} // Skip logic bhi same hi hoga but empty emails ke sath
        className="mt-6 text-sm text-indigo-500 font-medium hover:underline"
    >
        Skip for now
    </button>
</div>
          )}
        </div>
      </div>
    </div>
  );
}
