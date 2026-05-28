// import React, { useRef, useState, useEffect } from "react";
// import {
//   Image as ImageIcon,
//   X,
//   ArrowLeft,
//   ArrowRight,
//   Hexagon,
//   Plus,
//   Upload,
//   Loader2,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import API from "../../api/axios";
// import { triggerToast } from "../../utils/toastHelper";
// import { useCreateWorkspaceMutation, useInviteMutation } from "../../hooks/useWorkspace";

// // --- Helper: Slugify Function ---
// const slugify = (text) => {
//   return text
//     .toString()
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, "-") // Spaces to -
//     .replace(/[^\w-]+/g, "") // Remove non-word chars
//     .replace(/--+/g, "-"); // Replace multiple - with single -
// };

// export default function WorkspaceSetup() {
//   // const navigate = useNavigate();
//   // const fileInputRef = useRef(null);

//   // // --- States ---
//   // const [step, setStep] = useState(1);
//   // const [isLoading, setIsLoading] = useState(false);

//   // // Form States
//   // const [name, setName] = useState("");
//   // const [slug, setSlug] = useState("");
//   // const [timezone, setTimezone] = useState("(GMT+5:00) Pakistan Standard Time");
//   // const [ownerEmail, setOwnerEmail] = useState("");
//   // const [logoPreview, setLogoPreview] = useState(null);
//   // const [emails, setEmails] = useState(["", ""]); // Team invites

//   // // --- Auto-fill Owner Email (Optional: Based on logged-in user) ---
//   // useEffect(() => {
//   //   const user = JSON.parse(localStorage.getItem("user"));
//   //   if (user?.email) setOwnerEmail(user.email);
//   // }, []);

//   // //   const triggerFileInput = () => {
//   // //   fileInputRef.current.click();
//   // // };

//   // // --- Handlers ---
//   // const handleNameChange = (e) => {
//   //   const val = e.target.value;
//   //   setName(val);
//   //   setSlug(slugify(val));
//   // };

//   // const handleLogoChange = (e) => {
//   //   const file = e.target.files[0];
//   //   if (file) {
//   //     const reader = new FileReader();
//   //     reader.onloadend = () => setLogoPreview(reader.result);
//   //     reader.readAsDataURL(file);
//   //   }
//   // };

//   // // const handleEmailChange = (index, value) => {
//   // //   const newEmails = [...emails];
//   // //   newEmails[index] = value;
//   // //   setEmails(newEmails);
//   // // };

//   // const addEmailField = () => setEmails([...emails, ""]);
//   // const removeEmailField = (index) =>
//   //   setEmails(emails.filter((_, i) => i !== index));

//   // // --- Final Submit Logic ---
//   // const handleCreateWorkspace = async () => {
//   //   if (!name || !slug) return triggerToast("Workspace name and URL are required!","error");

//   //   setIsLoading(true);
//   //   try {
//   //     const formData = new FormData();
//   //     formData.append("name", name);
//   //     formData.append("slug", slug);
//   //     formData.append("timezone", timezone);
//   //     formData.append("ownerEmail", ownerEmail);

//   //     // Filter empty emails and append
//   //     const validEmails = emails.filter((email) => email.trim() !== "");
//   //     formData.append("invitedEmails", JSON.stringify(validEmails));

//   //     if (fileInputRef.current.files[0]) {
//   //       formData.append("logo", fileInputRef.current.files[0]);
//   //     }

//   //     console.log(formData);

//   //     const res = await API.post("/workspace/create", formData, {
//   //       headers: { "Content-Type": "multipart/form-data" },
//   //     });

//   //     console.log(res);

//   //     setStep(2);

//   //     // Success: Redirect to the new workspace dashboard
//   //     // navigate(`/${res.data.data.slug}/dashboard`);
//   //   } catch (err) {
//   //     console.log(err);
//   //     triggerToast(err.response?.data?.message || "Failed to create workspace","error");
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   // const handleSendInvites = async () => {
//   //   // Sirf wo emails lein jo khali nahi hain
//   //   const validEmails = emails.filter((email) => email.trim() !== "");

//   //   if (validEmails.length === 0) {
//   //     // Agar koi email nahi dala to direct dashboard par le jayein
//   //     return navigate(`/`);
//   //   }

//   //   setIsLoading(true);
//   //   try {
//   //     await API.post("/workspace/invite-members", {
//   //       workspaceSlug: slug, // Workspace ki pehchan ke liye
//   //       emails: validEmails,
//   //       inviterName: JSON.parse(localStorage.getItem("user")).full_name,
//   //     });

//   //     triggerToast("Invitations sent successfully!","success");
//   //     navigate(`/`); // Dashboard par redirect karein
//   //   } catch (err) {
//   //     triggerToast(err.response.data.message || "Workspace created, but failed to send some invites.","error");
//   //     navigate(`/`);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };


//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);

//   // Mutations
//   const createMutation = useCreateWorkspaceMutation();
//   const inviteMutation = useInviteMutation();

//   // --- States ---
//   const [step, setStep] = useState(1);
//   const [name, setName] = useState("");
//   const [slug, setSlug] = useState("");
//   const [timezone, setTimezone] = useState("(GMT+5:00) Pakistan Standard Time");
//   const [ownerEmail, setOwnerEmail] = useState("");
//   const [logoPreview, setLogoPreview] = useState(null);
//   const [emails, setEmails] = useState(["", ""]);

//   // Auto-fill Owner Email
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user?.email) setOwnerEmail(user.email);
//   }, []);

//   // UI Handlers (addEmailField, removeEmailField etc. yahan rakhen)

//   // --- Final Submit Logic ---
//   const handleCreateWorkspace = () => {
//     if (!name || !slug) return triggerToast("Workspace name and URL are required!", "error");

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("slug", slug);
//     formData.append("timezone", timezone);
//     formData.append("ownerEmail", ownerEmail);

//     const validEmails = emails.filter((email) => email.trim() !== "");
//     formData.append("invitedEmails", JSON.stringify(validEmails));

//     if (fileInputRef.current.files[0]) {
//       formData.append("logo", fileInputRef.current.files[0]);
//     }

//     createMutation.mutate(formData, {
//       onSuccess: (data) => {
//         setStep(2); // Next step par chale jayein
//         triggerToast("Workspace created successfully!", "success");
//       },
//       onError: (err) => {
//         triggerToast(err.response?.data?.message || "Failed to create workspace", "error");
//       }
//     });
//   };

//   const handleSendInvites = () => {
//     const validEmails = emails.filter((email) => email.trim() !== "");
//     if (validEmails.length === 0) return navigate(`/`);

//     const user = JSON.parse(localStorage.getItem("user"));

//     inviteMutation.mutate({
//       workspaceSlug: slug,
//       emails: validEmails,
//       inviterName: user.full_name,
//     }, {
//       onSuccess: () => {
//         triggerToast("Invitations sent successfully!", "success");
//         navigate(`/`);
//       },
//       onError: (err) => {
//         triggerToast(err.response?.data?.message || "Invites failed.", "error");
//         navigate(`/`); // Phir bhi dashboard le jayein kyunki workspace ban chuka hai
//       }
//     });
//   };

//   // 1. Workspace Name aur Slug handle karne ke liye
// const handleNameChange = (e) => {
//   const val = e.target.value;
//   setName(val);
//   // Slugify logic: spaces ko dashes mein badalna aur lowercase karna
//   setSlug(val.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''));
// };

// // 2. Logo upload aur preview ke liye
// const handleLogoChange = (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setLogoPreview(reader.result); // Screen par dikhane ke liye
//     };
//     reader.readAsDataURL(file);
//   }
// };

// // 3. Invite fields mein naya email add karne ke liye
// const addEmailField = () => setEmails([...emails, ""]);

// // 4. Kisi specific email field ko delete karne ke liye
// const removeEmailField = (index) => {
//   if (emails.length > 1) {
//     setEmails(emails.filter((_, i) => i !== index));
//   }
// };

//   // UI Variable for overall loading
//   const isLoading = createMutation.isPending || inviteMutation.isPending;

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-[#f0f2f5] p-4">
//       <div className="bg-white rounded-md shadow-2xl w-full max-w-[31%] overflow-hidden border border-gray-100">
//         {/* Tab Header */}
//         <div className="flex border-b border-gray-100">
//           <div
//             className={`flex-1 py-4 pt-8 text-center text-sm font-semibold transition-all ${step === 1 ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-400"}`}
//           >
//             Workspace Details
//           </div>
//           <div
//             className={`flex-1 py-4 pt-8 text-center text-sm font-semibold transition-all ${step === 2 ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-400"}`}
//           >
//             Invite Team
//           </div>
//         </div>

//         <div className="p-8">
//           {step === 1 ? (
//             /* STEP 1: Workspace Details */
//             /* STEP 1: Workspace Details */
//             <div className="flex flex-col items-center animate-in fade-in duration-500">
//               <div className="bg-indigo-600 p-3 rounded-2xl text-white mb-6 shadow-lg shadow-indigo-100">
//                 <Hexagon size={32} />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-800">
//                 Create Your Workspace
//               </h2>
//               <p className="text-gray-500 text-sm mt-1 mb-8">
//                 Set up your collaboration space
//               </p>

//               <div className="w-full space-y-5 text-left">
//                 {/* Workspace Name */}
//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 mb-2">
//                     Workspace Name
//                   </label>
//                   <input
//                     type="text"
//                     value={name}
//                     onChange={handleNameChange}
//                     placeholder="e.g. UCollyx Devs"
//                     className="w-full border border-gray-200 rounded-md p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50/30"
//                   />
//                   <p className="text-[11px] text-gray-400 mt-1.5 px-1">
//                     This will be visible to all members of your workspace
//                   </p>
//                 </div>

//                 {/* Workspace Slug (URL) */}
//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 mb-2">
//                     Workspace URL
//                   </label>
//                   <div className="flex items-center group">
//                     <div className="bg-gray-100 border border-r-0 border-gray-200 p-3 rounded-l-md text-gray-400 text-xs font-medium">
//                       ucollyx.com/
//                     </div>
//                     <input
//                       type="text"
//                       value={slug}
//                       onChange={(e) => setSlug(slugify(e.target.value))}
//                       placeholder="your-workspace-url"
//                       className="flex-1 border border-gray-200 rounded-r-md p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm bg-white font-medium text-indigo-600"
//                     />
//                   </div>
//                   <p className="text-[11px] text-gray-400 mt-1.5 px-1 font-mono">
//                     Suggested slug based on your workspace name
//                   </p>
//                 </div>

//                 {/* Timezone */}
//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 mb-2">
//                     Timezone
//                   </label>
//                   <select
//                     value={timezone}
//                     onChange={(e) => setTimezone(e.target.value)}
//                     className="w-full border border-gray-200 rounded-md p-3 outline-none bg-white text-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
//                   >
//                     <option value="PKT">
//                       (GMT+5:00) Pakistan Standard Time - Karachi
//                     </option>
//                     <option value="PST">
//                       (GMT-8:00) Pacific Time - Los Angeles
//                     </option>
//                     <option value="UTC">
//                       (GMT+0:00) Universal Coordinated Time
//                     </option>
//                   </select>
//                 </div>

//                 {/* Owner Email */}
//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 mb-2">
//                     Owner Email
//                   </label>
//                   <input
//                     type="email"
//                     value={ownerEmail}
//                     onChange={(e) => setOwnerEmail(e.target.value)}
//                     placeholder="sara.johnson@acmecorp.com"
//                     className="w-full border border-gray-200 rounded-md p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50/30"
//                   />
//                   <p className="text-[11px] text-gray-400 mt-1.5 px-1">
//                     You will be assigned as the{" "}
//                     <strong>Organization Admin</strong>.
//                   </p>
//                 </div>

//                 {/* Logo Section */}
//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 mb-2">
//                     Workspace Logo (Optional)
//                   </label>
//                   <div className="flex items-center gap-4">
//                     <div className="w-14 h-14 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 relative group shadow-sm">
//                       {logoPreview ? (
//                         <>
//                           <img
//                             src={logoPreview}
//                             alt="Logo"
//                             className="w-full h-full object-cover"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => setLogoPreview(null)}
//                             className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                           >
//                             <X size={16} className="text-white" />
//                           </button>
//                         </>
//                       ) : (
//                         <ImageIcon size={24} className="text-gray-300" />
//                       )}
//                     </div>

//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       onChange={handleLogoChange}
//                       className="hidden"
//                       accept="image/*"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => fileInputRef.current.click()} // Direct ref call
//                       className="border border-gray-200 px-4 py-2 rounded-md text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-all hover:border-gray-300 active:scale-95"
//                     >
//                       <Upload size={14} />
//                       {logoPreview ? "Change Logo" : "Upload Logo"}
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Navigation Buttons */}
//               <div className="flex gap-4 w-full mt-10">
//                 <button
//                   onClick={() => navigate(-1)}
//                   className="flex-1 py-3.5 border border-gray-200 rounded-md font-bold text-gray-400 text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95"
//                 >
//                   <ArrowLeft size={16} /> Back
//                 </button>
//                 <button
//                   onClick={handleCreateWorkspace}
//                   disabled={!name || !slug || !ownerEmail}
//                   className="flex-[1.5] py-3.5 bg-indigo-600 text-white rounded-md font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
//                 >
//                   Next: Invite Team <ArrowRight size={16} />
//                 </button>
//               </div>
//             </div>
//           ) : (
//             /* STEP 2: Invite Team */
//             /* STEP 2: Invite Team */
//             <div className="flex flex-col items-center animate-in slide-in-from-right duration-500">
//               <span className="text-4xl mb-6">👋</span>
//               <h2 className="text-2xl font-bold text-gray-800">
//                 Invite your team
//               </h2>
//               <p className="text-gray-500 text-sm mt-1 mb-8">
//                 Add team members to{" "}
//                 <span className="text-indigo-600 font-bold">
//                   {name || "Workspace"}
//                 </span>
//               </p>

//               <div className="w-full space-y-3 mb-6">
//                 {emails.map((email, index) => (
//                   <div key={index} className="flex gap-2">
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => {
//                         const newEmails = [...emails];
//                         newEmails[index] = e.target.value;
//                         setEmails(newEmails);
//                       }}
//                       placeholder={`teammate${index + 1}@company.com`}
//                       className="flex-1 border border-gray-200 rounded-md p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
//                     />
//                     {emails.length > 1 && (
//                       <button
//                         onClick={() => removeEmailField(index)}
//                         className="p-3 border border-red-100 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-all"
//                       >
//                         <X size={20} />
//                       </button>
//                     )}
//                   </div>
//                 ))}
//                 <button
//                   onClick={addEmailField}
//                   className="w-full py-3 border-2 border-dashed border-gray-200 rounded-md text-gray-500 font-medium flex items-center justify-center gap-2 hover:border-indigo-300 hover:text-indigo-500 transition-all"
//                 >
//                   <Plus size={18} /> Add another email
//                 </button>
//               </div>

//               <div className="flex gap-4 w-full">
//                 <button
//                   onClick={() => setStep(1)}
//                   className="flex-1 py-3 border border-gray-200 rounded-md font-semibold text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50"
//                 >
//                   <ArrowLeft size={18} /> Back
//                 </button>
//                 <button
//                   onClick={handleSendInvites} // Ab ye final create trigger karega
//                   disabled={isLoading}
//                   className="flex-[1.5] py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
//                 >
//                   {isLoading ? (
//                     <Loader2 size={18} className="animate-spin" />
//                   ) : (
//                     "Finish & Create"
//                   )}
//                 </button>
//               </div>

//               <button
//                 onClick={handleSendInvites} // Skip logic bhi same hi hoga but empty emails ke sath
//                 className="mt-6 text-sm text-indigo-500 font-medium hover:underline"
//               >
//                 Skip for now
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }





































import React, { useRef, useState, useEffect } from "react";
import {
  Image as ImageIcon,
  X,
  ArrowLeft,
  ArrowRight,
  Hexagon,
  Plus,
  Upload,
  Loader2,
  Sparkles,
  Layers,
  Globe,
  Clock,
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { triggerToast } from "../../utils/toastHelper";
import { useCreateWorkspaceMutation, useInviteMutation } from "../../hooks/useWorkspace";

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") 
    .replace(/[^\w-]+/g, "") 
    .replace(/--+/g, "-"); 
};

export default function WorkspaceSetup() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const createMutation = useCreateWorkspaceMutation();
  const inviteMutation = useInviteMutation();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [timezone, setTimezone] = useState("(GMT+5:00) Pakistan Standard Time");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [emails, setEmails] = useState(["", "", ""]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) setOwnerEmail(user.email);
  }, []);

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

  const addEmailField = () => setEmails([...emails, ""]);
  const removeEmailField = (index) => {
    if (emails.length > 1) setEmails(emails.filter((_, i) => i !== index));
  };

  const handleCreateWorkspace = () => {
    if (!name || !slug) return triggerToast("Workspace name and URL are required!", "error");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("timezone", timezone);
    formData.append("ownerEmail", ownerEmail);

    const validEmails = emails.filter((email) => email.trim() !== "");
    formData.append("invitedEmails", JSON.stringify(validEmails));

    if (fileInputRef.current.files[0]) {
      formData.append("logo", fileInputRef.current.files[0]);
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        setStep(2); 
        triggerToast("Workspace created successfully!", "success");
      },
      onError: (err) => {
        triggerToast(err.response?.data?.message || "Failed to create workspace", "error");
      }
    });
  };

  const handleSendInvites = () => {
    const validEmails = emails.filter((email) => email.trim() !== "");
    if (validEmails.length === 0) return navigate(`/`);

    const user = JSON.parse(localStorage.getItem("user"));

    inviteMutation.mutate({
      workspaceSlug: slug,
      emails: validEmails,
      inviterName: user.full_name,
    }, {
      onSuccess: () => {
        triggerToast("Invitations sent successfully!", "success");
        navigate(`/`);
      },
      onError: (err) => {
        triggerToast(err.response?.data?.message || "Invites failed.", "error");
        navigate(`/`); 
      }
    });
  };

  const isLoading = createMutation.isPending || inviteMutation.isPending;

  return (
    <div className="min-h-screen w-full flex bg-[#f8fafc] font-sans overflow-hidden">
      
      {/* LEFT SIDE PANEL: Spacious and High-Width Form Engine */}
      <div className="w-full lg:w-[55%] flex flex-col justify-between p-8 md:p-14 lg:p-20 bg-white relative z-10 overflow-y-auto">
        
        {/* Brand Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3b59ff] to-[#00f2fe] flex items-center justify-center font-black text-white shadow-lg text-sm">
            U
          </div>
          <span className="text-xl font-black text-[#1e2238] tracking-wider">UCollyx</span>
        </div>

        {/* Dynamic Multi-step Form Content Wrapper */}
        <div className="w-full max-w-xl mx-auto my-auto py-10">
          
          {/* Global Process Navigation Stepper */}
          <div className="flex items-center gap-4 mb-10 text-xs font-bold uppercase tracking-widest text-gray-400">
            <span className={`transition-colors ${step === 1 ? "text-[#3b59ff]" : "text-gray-400"}`}>01. Info</span>
            <div className={`h-[2px] w-12 rounded ${step === 2 ? "bg-[#9d4edd]" : "bg-gray-200"}`} />
            <span className={`transition-colors ${step === 2 ? "text-[#9d4edd]" : "text-gray-400"}`}>02. Team Slots</span>
          </div>

          {step === 1 ? (
            /* STEP 1: Broad Inputs View */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-7">
              <div>
                <h1 className="text-3xl font-black text-[#1a1d2f] tracking-tight mb-2">
                  Create your workspace
                </h1>
                <p className="text-gray-500 text-sm">Configure your organizational infrastructure and instance routing properties.</p>
              </div>

              <div className="space-y-5">
                {/* Workspace Name Input */}
                <div>
                  <label className="block text-[#565d7a] text-xs font-bold uppercase tracking-wider mb-2">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="e.g. Acme Development Group"
                    className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl p-3.5 text-sm text-[#1e2238] placeholder-gray-400 focus:bg-white focus:border-[#3b59ff] focus:ring-4 focus:ring-[#3b59ff]/10 outline-none transition-all duration-200"
                  />
                </div>

                {/* Workspace URL Route Input */}
                <div>
                  <label className="block text-[#565d7a] text-xs font-bold uppercase tracking-wider mb-2">
                    Workspace Routing Slug URL
                  </label>
                  <div className="flex items-center group">
                    <div className="bg-[#f1f5f9] border border-gray-200 border-r-0 p-3.5 rounded-l-xl text-gray-400 text-sm font-bold tracking-tight">
                      ucollyx.com/
                    </div>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(slugify(e.target.value))}
                      placeholder="acme-hq"
                      className="w-full bg-[#f8fafc] border border-gray-200 rounded-r-xl p-3.5 text-sm font-bold text-[#3b59ff] placeholder-gray-400 focus:bg-white focus:border-[#3b59ff] focus:ring-4 focus:ring-[#3b59ff]/10 outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Grid Container for Timezone & Admin Owner Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#565d7a] text-xs font-bold uppercase tracking-wider mb-2">
                      Instance Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl p-3.5 text-sm text-[#1e2238] focus:bg-white focus:border-[#3b59ff] focus:ring-4 focus:ring-[#3b59ff]/10 outline-none transition-all duration-200 cursor-pointer font-medium"
                    >
                      <option value="(GMT+5:00) Pakistan Standard Time">(GMT+5:00) Islamabad, Karachi</option>
                      <option value="PST">(GMT-8:00) Pacific Time - LA</option>
                      <option value="UTC">(GMT+0:00) Universal Coordinated</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#565d7a] text-xs font-bold uppercase tracking-wider mb-2">
                      Master Owner Email
                    </label>
                    <input
                      type="email"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="admin@company.com"
                      className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl p-3.5 text-sm text-[#1e2238] focus:bg-white focus:border-[#3b59ff] focus:ring-4 focus:ring-[#3b59ff]/10 outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Flexible Logo Asset Row */}
                <div className="bg-[#f8fafc] border border-gray-200/60 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden bg-white relative group shadow-sm shrink-0">
                      {logoPreview ? (
                        <>
                          <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setLogoPreview(null)}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} className="text-white" />
                          </button>
                        </>
                      ) : (
                        <ImageIcon size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-[#1a1d2f] text-sm font-bold">Workspace Branding Logo</p>
                      <p className="text-gray-400 text-xs">PNG, JPG formats up to 2MB (Optional)</p>
                    </div>
                  </div>

                  <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/*" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()} 
                    className="bg-white border border-gray-200 hover:border-[#3b59ff]/40 text-gray-600 hover:text-[#3b59ff] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 shadow-sm active:scale-95"
                  >
                    <Upload size={14} />
                    <span>{logoPreview ? "Change File" : "Upload"}</span>
                  </button>
                </div>
              </div>

              {/* Action Button Segment */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-3.5 bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 font-bold rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all duration-200"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={handleCreateWorkspace}
                  disabled={!name || !slug || !ownerEmail}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#3b59ff] to-[#8a2be2] hover:opacity-95 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg disabled:shadow-none disabled:cursor-not-allowed"
                >
                  <span>Continue Setup</span> <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: Wide Team Slots Onboarding */
            <div className="animate-in fade-in slide-in-from-right duration-300 space-y-6">
              <div>
                <h1 className="text-3xl font-black text-[#1a1d2f] tracking-tight mb-2">
                  Assemble your team
                </h1>
                <p className="text-gray-500 text-sm">Send dynamic access invites to engineers, stakeholders or operators directly.</p>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {emails.map((email, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        const newEmails = [...emails];
                        newEmails[index] = e.target.value;
                        setEmails(newEmails);
                      }}
                      placeholder={`engineer.${index + 1}@yourorganization.com`}
                      className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl p-3.5 text-sm text-[#1e2238] placeholder-gray-400 focus:bg-white focus:border-[#9d4edd] focus:ring-4 focus:ring-[#9d4edd]/10 outline-none transition-all duration-200"
                    />
                    {emails.length > 1 && (
                      <button
                        onClick={() => removeEmailField(index)}
                        className="p-3.5 border border-red-100 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all duration-200 shrink-0"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  onClick={addEmailField}
                  className="w-full py-3.5 border-2 border-dashed border-gray-200 text-gray-500 font-bold rounded-xl flex items-center justify-center gap-1.5 hover:border-[#9d4edd]/40 hover:text-[#9d4edd] bg-white transition-all duration-200 text-xs uppercase tracking-wider"
                >
                  <Plus size={16} /> Add Invite Slot
                </button>
              </div>

              {/* Step 2 Action Triggers */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="px-6 py-3.5 bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 font-bold rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all duration-200"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={handleSendInvites} 
                  disabled={isLoading}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#9d4edd] to-[#3b59ff] hover:opacity-95 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-xl"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin text-white" />
                  ) : (
                    <>
                      <span>Complete & Deploy Workspace</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={handleSendInvites} 
                  className="text-xs text-gray-400 hover:text-[#3b59ff] font-bold uppercase tracking-wider transition-colors pt-2 outline-none"
                >
                  Skip this process for now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <p className="text-center lg:text-left text-xs text-gray-400 font-medium">
          Protected instance encryption. Powered by UCollyx Engine Core.
        </p>
      </div>

      {/* RIGHT SIDE PANEL: Fluid Mesh Gradient Showcase & Living Workspace Mockup Preview */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#121424] relative flex-col justify-between p-16 overflow-hidden border-l border-white/5">
        
        {/* Intense Floating Colored Light Ambient Blurs */}
        <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-[#3b59ff]/30 rounded-full blur-[110px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[450px] h-[450px] bg-[#9d4edd]/20 rounded-full blur-[100px]" />

        {/* Top Tagline */}
        <div className="relative z-10 flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
          <Layers size={14} className="text-[#00f2fe]" /> Synchronized Cloud Environments
        </div>

        {/* Center Canvas Workspace Graphic Mockup Panel */}
        <div className="relative z-10 w-full max-w-sm mx-auto bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#3b59ff] to-[#00f2fe] flex items-center justify-center font-black text-white text-xs">
                {name ? name.substring(0, 2).toUpperCase() : "UC"}
              </div>
              <div>
                <h4 className="text-white text-xs font-bold tracking-wide truncate max-w-[140px]">
                  {name || "Your New Instance"}
                </h4>
                <p className="text-white/40 text-[10px] font-mono truncate max-w-[140px]">
                  ucollyx.com/{slug || "slug-route"}
                </p>
              </div>
            </div>
            <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full">
              Active
            </div>
          </div>

          {/* Dummy Live Ecosystem Stats inside the panel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-white/70 bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-[#00f2fe]" />
                <span>Ecosystem Server</span>
              </div>
              <span className="text-white font-mono text-[11px]">US-East-Cluster</span>
            </div>
            <div className="flex items-center justify-between text-xs text-white/70 bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[#3b59ff]" />
                <span>Instance Zone</span>
              </div>
              <span className="text-white text-[11px] truncate max-w-[120px]">{timezone.split(" ")[0]}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-white/70 bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#9d4edd]" />
                <span>Security Group</span>
              </div>
              <span className="text-emerald-400 font-bold text-[11px]">Enforced TLS</span>
            </div>
          </div>
        </div>

        {/* Bottom Context Message */}
        <div className="relative z-10 space-y-2">
          <h3 className="text-white font-black text-xl tracking-tight flex items-center gap-2">
            Build Better Together <Sparkles size={18} className="text-[#00f2fe]" />
          </h3>
          <p className="text-white/50 text-xs leading-relaxed max-w-xs">
            Deploy secure workspace infrastructure instantly. Team synchronizations, collaborative repositories, and IDE controls are bundled within your target cluster link.
          </p>
        </div>

      </div>

    </div>
  );
}