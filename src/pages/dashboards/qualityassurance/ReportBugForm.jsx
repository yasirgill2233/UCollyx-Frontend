// import React, { useState, useMemo } from "react";
// import {
//   CheckCircle,
//   Circle,
//   Upload,
//   X,
//   Plus,
//   Trash2,
//   ArrowLeftIcon,
//   ChevronDown,
// } from "lucide-react";
// import { useNavigate } from "react-router";
// import { useProjectMembers, useCreateIssue } from "../../../hooks/useIssues";
// import { triggerToast } from "../../../utils/toastHelper";
// import { useMyProjects } from "../../../hooks/useProjects";

// const ReportBugForm = () => {
//   const navigate = useNavigate();
//   const createIssueMutation = useCreateIssue();

//   // Static reference lists (Inko aap backend calls se bhi pull kar sakte hain)
//   const availableProjects = [
//     { id: 1, name: "E-Commerce Platform" },
//     { id: 15, name: "UCollyx Workspace" },
//     { id: 16, name: "Mobile App App" },
//   ];

//   // --- Core State Hook Binding ---
//   const [selectedProjectId, setSelectedProjectId] = useState(1);
//   const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
//   const [selectedAssignee, setSelectedAssignee] = useState(null);
//   const [files, setFiles] = useState([]);

//   const [formData, setFormData] = useState({
//     title: "",
//     module_name: "Checkout",
//     environment: "Dev",
//     severity: "Medium",
//     steps_to_repro: [""],
//     expected_result: "",
//     actual_result: "",
//     is_red_card: false,
//     red_card_reason: "",
//   });

//   // const { data: projectMembers = [], isLoading: isMembersLoading } = useProjectMembers(selectedProjectId);

//   const { data: myProjects, isLoading: isMembersLoading } = useMyProjects();
//   const projects = myProjects?.data || [];

//   const currentSelectedProject = useMemo(() => {
//     if (!selectedProjectId || !projects.length) return null;
//     return projects.find(project => String(project.id) === String(selectedProjectId));
//   }, [selectedProjectId, projects]);

//   console.log(projects, selectedProjectId, currentSelectedProject)

//   // --- Dynamic Form Completion Tracker ---
//   const progressMetrics = useMemo(() => {
//     const steps = [
//       { id: "Basic Details", completed: !!(formData.title && selectedProjectId && formData.module_name) },
//       { id: "Severity & Team", completed: !!(formData.severity && selectedAssignee?.id) },
//       { id: "Description", completed: !!(formData.steps_to_repro.some(s => s.trim() !== "") && formData.expected_result && formData.actual_result) },
//       { id: "Evidence Thread", completed: files.length > 0 },
//       { id: "Red Card Check", completed: formData.is_red_card ? !!formData.red_card_reason.trim() : true },
//     ];

//     const completedCount = steps.filter((s) => s.completed).length;
//     const percentage = Math.round((completedCount / steps.length) * 100);

//     return { percentage, steps };
//   }, [formData, selectedProjectId, selectedAssignee, files]);

//   // --- Form Functional Handlers ---
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleStepChange = (index, value) => {
//     const newSteps = [...formData.steps_to_repro];
//     newSteps[index] = value;
//     setFormData((prev) => ({ ...prev, steps_to_repro: newSteps }));
//   };

//   const addStep = () => setFormData((prev) => ({ ...prev, steps_to_repro: [...prev.steps_to_repro, ""] }));

//   const removeStep = (index) => {
//     if (formData.steps_to_repro.length > 1) {
//       const newSteps = formData.steps_to_repro.filter((_, i) => i !== index);
//       setFormData((prev) => ({ ...prev, steps_to_repro: newSteps }));
//     }
//   };

//   const handleFileUpload = (e) => {
//     const uploadedFiles = Array.from(e.target.files).map((file) => ({
//       name: file.name,
//       size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
//       rawFile: file // For server form-data payload parsing context
//     }));
//     setFiles((prev) => [...prev, ...uploadedFiles]);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // 1. Create a fresh FormData object instance
//     const formDataPayload = new FormData();

//     // 2. Append standard text fields
//     formDataPayload.append("project_id", selectedProjectId);
//     formDataPayload.append("assigned_to", selectedAssignee?.id || "");
//     formDataPayload.append("title", formData.title);
//     formDataPayload.append("description", `Module: ${formData.module_name}`);
//     formDataPayload.append("severity", formData.severity);
//     formDataPayload.append("environment", formData.environment);
//     formDataPayload.append("expected_result", formData.expected_result);
//     formDataPayload.append("actual_result", formData.actual_result);

//     // Steps to reproduce ko stringify karke ya plain text format mein append karein
//     formDataPayload.append("steps_to_repro", JSON.stringify(formData.steps_to_repro));

//     // Metadata block (Red card validation logic)
//     formDataPayload.append("metadata", JSON.stringify({
//       is_red_card: formData.is_red_card,
//       red_card_reason: formData.is_red_card ? formData.red_card_reason : ""
//     }));

//     // 3. 🔥 CRITICAL FIX: Append actual raw binary files to matching 'issues' field name
//     // files array ke andar jo origin file pointer hai (rawFile), usay append karna hai
//     files.forEach((fileObj) => {
//       // fileObj.rawFile hamari asal binary file hai jo target input[type="file"] se aayi thi
//       if (fileObj.rawFile) {
//         formDataPayload.append("issues", fileObj.rawFile);
//       }
//     });

//     // 4. Trigger React Query mutation with Multipart configuration header context
//     createIssueMutation.mutate(formDataPayload, {
//       onSuccess: () => {
//         triggerToast("Bug Form Created Succesffully","success")
//       }
//     });
//   };

//   return (
//     <div className="flex-1 bg-[#F9FBFF] min-h-screen p-8">
//       <form onSubmit={handleSubmit} className="max-w-full mx-auto space-y-6 pb-20 animate-in fade-in-50 duration-500">

//         {/* Page Header */}
//         <div className="flex justify-between items-center mb-10">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-800 flex justify-start items-center gap-3">
//               <ArrowLeftIcon className="hover:cursor-pointer text-slate-600 hover:text-blue-600 transition-colors" onClick={() => navigate(-1)} />
//               Report a Quality Issue
//             </h1>
//             <p className="text-sm text-slate-400">Log trace details directly into your workspace pipeline</p>
//           </div>
//         </div>

//         {/* 1. DYNAMIC PROGRESS BAR SECTION */}
//         <div className="bg-white rounded-md border border-slate-200 p-8 shadow-sm">
//           <div className="flex justify-between items-center mb-8">
//             <h3 className="text-sm font-bold text-slate-800">Pipeline Progression Tracker</h3>
//             <span className="text-sm font-black text-blue-600 transition-all duration-500">
//               {progressMetrics.percentage}% complete
//             </span>
//           </div>
//           <div className="relative flex justify-between items-center px-2">
//             <div className="absolute top-[15px] left-0 w-full h-1 bg-slate-100 z-0" />
//             <div
//               className="absolute top-[15px] left-0 h-1 bg-blue-600 z-0 transition-all duration-700 ease-in-out"
//               style={{ width: `${progressMetrics.percentage}%` }}
//             />

//             {progressMetrics.steps.map((step, idx) => (
//               <ProgressStep
//                 key={step.id}
//                 label={step.id}
//                 completed={step.completed}
//                 active={progressMetrics.percentage >= ((idx + 1) * 20)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* 2. Basic Details Section */}
//         <div className="bg-white rounded-md border border-slate-200 p-8 shadow-sm">
//           <SectionHeader title="Basic Context Details" sub="Identify project allocation vectors" />
//           <div className="grid gap-5 mt-8">
//             <InputField label="Bug Track Heading / Reference" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Critical Failure on Payment Process checkout checkout runtime loop" required />
//             <div className="grid grid-cols-2 gap-5">
//               <div className="space-y-2 flex-1">
//                 <label className="text-[10px] font-bold text-slate-400 uppercase">Target Project</label>
//                 <select
//                   value={selectedProjectId}
//                   onChange={e => {
//                     setSelectedProjectId(parseInt(e.target.value));
//                     setSelectedAssignee(null); // Reset user profile validation when swapping context projects
//                   }}
//                   className="w-full p-3.5 border border-slate-200 rounded-md text-xs bg-white outline-none cursor-pointer font-bold text-slate-700"
//                 >
//                   {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
//                 </select>
//               </div>
//               <CustomSelect label="Target Module Component" value={formData.module_name} options={["Checkout", "Dashboard Engine", "Auth Gateway", "Product Catalog"]} onChange={(val) => setFormData(p => ({...p, module_name: val}))} />
//             </div>
//           </div>
//         </div>

//         {/* 3. Severity & Allocation Custom Select Team Box */}
//         <div className="bg-white rounded-md border border-slate-200 p-8 shadow-sm">
//           <SectionHeader title="Severity Profile & Target Dev Assignment" sub="Classify system footprint impact matrices" />
//           <div className="mt-8 grid grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Severity Vector</label>
//               <div className="grid grid-cols-2 gap-3">
//                 {['Critical', 'High', 'Medium', 'Low'].map(sev => (
//                   <SeverityButton key={sev} label={sev} current={formData.severity} onClick={(val) => setFormData(p => ({...p, severity: val}))} />
//                 ))}
//               </div>
//             </div>

//             {/* Custom Assignee Dropdown Selector with Images Support */}
//             <div className="space-y-2 relative">
//               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Assign Developer for Fix</label>
//               <button
//                 type="button"
//                 onClick={() => setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)}
//                 className="w-full bg-white border border-slate-200 rounded-md p-3.5 text-xs font-bold text-slate-700 flex items-center justify-between outline-none"
//                 disabled={isMembersLoading}
//               >
//                 <div className="flex items-center gap-2">
//                   {selectedAssignee ? (
//                     <>
//                       <div className="w-5 h-5 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-[9px] font-black shrink-0">
//                         {selectedAssignee?.avatar_url ? (
//                           <img src={import.meta.env.VITE_SERVER_URL + selectedAssignee?.avatar_url} alt="Avatar" crossOrigin="anonymous" className="w-full h-full object-cover" />
//                         ) : selectedAssignee?.full_name?.[0] || "U"}
//                       </div>
//                       <span className="truncate">{selectedAssignee?.full_name}</span>
//                     </>
//                   ) : (
//                     <span className="text-slate-400 font-normal">{isMembersLoading ? "Syncing Project Members..." : "Select Assignee Developer"}</span>
//                   )}
//                 </div>
//                 <ChevronDown size={14} className="text-slate-400" />
//               </button>

//               {isAssigneeDropdownOpen && !isMembersLoading && (
//                 <div className="absolute left-0 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-xl z-50 py-1 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
//                   {currentSelectedProject?.members?.length > 0 ? (
//                     currentSelectedProject?.members?.map((u) => (
//                       <button
//                         key={u.id}
//                         type="button"
//                         onClick={() => {
//                           setSelectedAssignee(u);
//                           setIsAssigneeDropdownOpen(false);
//                         }}
//                         className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
//                       >
//                         <div className="w-5 h-5 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-[9px] font-black shrink-0 border border-slate-100">
//                           {u?.avatar_url ? (
//                             <img src={import.meta.env.VITE_SERVER_URL + u?.avatar_url} alt="Avatar" crossOrigin="anonymous" className="w-full h-full object-cover" />
//                           ) : u?.full_name?.[0] || "U"}
//                         </div>
//                         <span className="text-xs font-bold text-slate-700 truncate">{u?.full_name}</span>
//                       </button>
//                     ))
//                   ) : (
//                     <div className="px-4 py-3 text-xs text-slate-400 font-bold uppercase text-center">No team allocation mapped.</div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="mt-5">
//              <CustomSelect label="Runtime Environment Scope" value={formData.environment} options={["Production", "Staging", "Dev"]} onChange={(val) => setFormData(p => ({...p, environment: val}))} />
//           </div>
//         </div>

//         {/* 4. CONSOLIDATED DESCRIPTION */}
//         <div className="bg-white rounded-md border border-slate-200 p-8 shadow-sm">
//           <SectionHeader title="Reproduction Lifecycle Vectors" sub="Steps execution thread maps" />
//           <div className="mt-8 space-y-8">
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Steps to Reproduce</label>
//                 <button type="button" onClick={addStep} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"><Plus size={12}/> Add Step</button>
//               </div>
//               {formData.steps_to_repro.map((step, index) => (
//                 <div key={index} className="flex gap-3 group items-center">
//                   <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[9px] font-black shrink-0">{index + 1}</span>
//                   <input value={step} onChange={(e) => handleStepChange(index, e.target.value)} placeholder="Provide action trace context layer..." className="flex-1 border-b border-slate-100 text-xs py-2 focus:border-blue-500 outline-none font-medium text-slate-600 transition-colors" />
//                   {formData.steps_to_repro.length > 1 && <Trash2 size={14} className="text-slate-300 hover:text-red-500 cursor-pointer transition-colors" onClick={() => removeStep(index)}/>}
//                 </div>
//               ))}
//             </div>
//             <div className="grid grid-cols-2 gap-6">
//               <TextArea label="Expected Assert Behavior Result" name="expected_result" value={formData.expected_result} onChange={handleInputChange} color="bg-green-50/10" border="border-green-100/70 text-slate-700" placeholder="Describe the expected system state context..." />
//               <TextArea label="Actual Crash Output Result" name="actual_result" value={formData.actual_result} onChange={handleInputChange} color="bg-red-50/10" border="border-red-100/70 text-slate-700" placeholder="Describe the active failure dump traces..." />
//             </div>
//           </div>
//         </div>

//         {/* 5. Evidence Section */}
//         <div className="bg-white rounded-md border border-slate-200 p-8 shadow-sm">
//           <SectionHeader title="Binary Logs & Artifact Evidence" sub="Attach trace captures or system execution dumps" />
//           <div className="mt-6">
//             <label className="border-2 border-dashed border-slate-200 rounded-md p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50/50 transition-colors group">
//               <Upload className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors mb-2" />
//               <p className="text-xs font-bold text-slate-500">Drop log captures or click to stream binary files</p>
//               <input type="file" multiple onChange={handleFileUpload} className="hidden" />
//             </label>
//             {files.length > 0 && (
//               <div className="mt-4 flex flex-wrap gap-2">
//                 {files.map((f, i) => (
//                   <div key={i} className="text-[10px] font-bold text-slate-600 bg-slate-100/80 border border-slate-200 px-3 py-1.5 rounded-md flex items-center gap-2">
//                     <span>{f.name} ({f.size})</span>
//                     <X size={12} className="cursor-pointer text-slate-400 hover:text-red-500 transition-colors" onClick={() => setFiles(p => p.filter((_, idx) => idx !== i))}/>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* 6. Red Card Section */}
//         <div className={`rounded-md border-2 p-8 transition-all ${formData.is_red_card ? 'border-red-500 bg-red-50/10' : 'border-slate-200 bg-white'}`}>
//           <label className="flex items-center gap-3 cursor-pointer select-none">
//             <input type="checkbox" checked={formData.is_red_card} onChange={(e) => setFormData(p => ({...p, is_red_card: e.target.checked}))} className="w-5 h-5 accent-red-500 rounded" />
//             <span className="font-black uppercase tracking-wider text-xs text-slate-700">Escalate Block Threat Layer (Raise Red Card)</span>
//           </label>
//           {formData.is_red_card && (
//             <textarea name="red_card_reason" value={formData.red_card_reason} onChange={handleInputChange} className="w-full mt-4 p-4 bg-white border border-red-100 rounded-md text-xs font-medium text-slate-600 outline-none shadow-sm focus:border-red-400" placeholder="Provide absolute architecture blockers explanation..." required />
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={createIssueMutation.isPending}
//           className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-md font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-600/10 transition-all active:scale-[0.99]"
//         >
//           {createIssueMutation.isPending ? "Streaming Data to Pipeline..." : "Commit Bug Report"}
//         </button>
//       </form>
//     </div>
//   );
// };

// // --- Sub-helper Functional Elements ---
// const ProgressStep = ({ label, active, completed }) => (
//   <div className="relative z-10 flex flex-col items-center gap-2">
//     <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white transition-all duration-500 ${completed ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20" : active ? "border-blue-600 text-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.15)]" : "border-slate-200 text-slate-300"}`}>
//       {completed ? <CheckCircle size={16} /> : <Circle size={8} className="fill-current" />}
//     </div>
//     <span className={`text-[8px] font-black uppercase tracking-tighter ${active ? "text-blue-600" : "text-slate-400"}`}>{label}</span>
//   </div>
// );

// const SectionHeader = ({ title, sub }) => (
//   <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
//     <div className="p-2 bg-blue-50 rounded-md text-blue-600 shadow-inner"><CheckCircle size={18} /></div>
//     <div><h3 className="text-xs font-black uppercase tracking-wider text-slate-800">{title}</h3><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{sub}</p></div>
//   </div>
// );

// const SeverityButton = ({ label, current, onClick }) => (
//   <button type="button" onClick={() => onClick(label)} className={`p-3 border rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${current === label ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" : "border-slate-200 text-slate-400 bg-white hover:border-slate-300"}`}>
//     {label}
//   </button>
// );

// const InputField = ({ label, ...props }) => (
//   <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label><input className="w-full p-3.5 border border-slate-200 rounded-md text-xs outline-none font-medium text-slate-600 focus:border-blue-500 transition-colors bg-white shadow-inner" {...props} /></div>
// );

// const TextArea = ({ label, color, border, ...props }) => (
//   <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label><textarea className={`w-full h-28 p-4 ${color} ${border} border rounded-md text-xs font-medium outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none shadow-inner`} {...props} /></div>
// );

// const CustomSelect = ({ label, value, options, onChange }) => (
//   <div className="space-y-2 flex-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label><select value={value} onChange={e => onChange(e.target.value)} className="w-full p-3.5 border border-slate-200 rounded-md text-xs bg-white outline-none font-bold text-slate-700 cursor-pointer">{options.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
// );

// export default ReportBugForm;























import React, { useState, useMemo } from "react";
import {
  CheckCircle,
  Upload,
  X,
  Plus,
  Trash2,
  ArrowLeftIcon,
  ChevronRight,
  ChevronLeft,
  Terminal,
  ShieldAlert,
  Cpu,
  Layers,
  Send
} from "lucide-react";
import { useNavigate } from "react-router";
import { useCreateIssue } from "../../../hooks/useIssues";
import { triggerToast } from "../../../utils/toastHelper";
import { useMyProjects } from "../../../hooks/useProjects";

const ReportBugForm = () => {
  const navigate = useNavigate();
  const createIssueMutation = useCreateIssue();

  // --- Wizard Step State ---
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // --- Core State Hook Binding ---
  const [selectedProjectId, setSelectedProjectId] = useState(1);
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [files, setFiles] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    module_name: "Checkout",
    environment: "Dev",
    severity: "Medium",
    steps_to_repro: [""],
    expected_result: "",
    actual_result: "",
    is_red_card: false,
    red_card_reason: "",
  });

  const { data: myProjects, isLoading: isMembersLoading } = useMyProjects();
  const projects = myProjects?.data || [];

  const currentSelectedProject = useMemo(() => {
    if (!selectedProjectId || !projects.length) return null;
    return projects.find(project => String(project.id) === String(selectedProjectId));
  }, [selectedProjectId, projects]);

  // --- Dynamic Form Completion Tracker ---
  const progressMetrics = useMemo(() => {
    const steps = [
      { id: "Basic Details", completed: !!(formData.title && selectedProjectId && formData.module_name) },
      { id: "Severity & Team", completed: !!(formData.severity && selectedAssignee?.id) },
      { id: "Reproduction", completed: !!(formData.steps_to_repro.some(s => s.trim() !== "") && formData.expected_result && formData.actual_result) },
      { id: "Evidence Thread", completed: files.length > 0 },
      { id: "Red Card Check", completed: formData.is_red_card ? !!formData.red_card_reason.trim() : true },
    ];

    const completedCount = steps.filter((s) => s.completed).length;
    const percentage = Math.round((completedCount / steps.length) * 100);

    return { percentage, steps };
  }, [formData, selectedProjectId, selectedAssignee, files]);

  // --- Form Functional Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps_to_repro];
    newSteps[index] = value;
    setFormData((prev) => ({ ...prev, steps_to_repro: newSteps }));
  };

  const addStep = () => setFormData((prev) => ({ ...prev, steps_to_repro: [...prev.steps_to_repro, ""] }));

  const removeStep = (index) => {
    if (formData.steps_to_repro.length > 1) {
      const newSteps = formData.steps_to_repro.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, steps_to_repro: newSteps }));
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files).map((file) => ({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      rawFile: file 
    }));
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataPayload = new FormData();
    formDataPayload.append("project_id", selectedProjectId);
    formDataPayload.append("assigned_to", selectedAssignee?.id || "");
    formDataPayload.append("title", formData.title);
    formDataPayload.append("description", `Module: ${formData.module_name}`);
    formDataPayload.append("severity", formData.severity);
    formDataPayload.append("environment", formData.environment);
    formDataPayload.append("expected_result", formData.expected_result);
    formDataPayload.append("actual_result", formData.actual_result);
    formDataPayload.append("steps_to_repro", JSON.stringify(formData.steps_to_repro));
    formDataPayload.append("metadata", JSON.stringify({
      is_red_card: formData.is_red_card,
      red_card_reason: formData.is_red_card ? formData.red_card_reason : ""
    }));

    files.forEach((fileObj) => {
      if (fileObj.rawFile) {
        formDataPayload.append("issues", fileObj.rawFile);
      }
    });

    createIssueMutation.mutate(formDataPayload, {
      onSuccess: () => {
        triggerToast("Bug Form Created Successfully", "success");
      }
    });
  };

  const wizardStepsTitles = [
    "Context Matrix",
    "Severity & Assignment",
    "Reproduction Logs",
    "Binary Evidence",
    "Escalation Check"
  ];

  return (
    <div className="flex-1 bg-[#F9FBFF] min-h-screen p-8 text-slate-800 font-sans">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in-50 duration-500">

        {/* Page Header */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <Terminal className="text-blue-600" size={22} />
              Report a Quality Issue
            </h1>
            <p className="text-xs text-slate-400 mt-1">Log trace details directly into your workspace pipeline</p>
          </div>
          <button 
            type="button"
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-lg shadow-sm transition-colors"
          >
            <ArrowLeftIcon size={14} /> Back
          </button>
        </div>

        {/* 1. PIPELINE HUD TRACKER */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-500" style={{ width: `${progressMetrics.percentage}%` }} />
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Pipeline Status: Step {currentStepIndex + 1} of 5</span>
            </div>
            <span className="text-xs font-black text-blue-600 font-mono">
              {progressMetrics.percentage}% COMPLETED
            </span>
          </div>

          {/* Wizard Step Nav Indicators */}
          <div className="grid grid-cols-5 gap-2 pt-2 border-t border-slate-100">
            {wizardStepsTitles.map((title, idx) => (
              <button
                key={title}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`text-left py-1.5 px-2 rounded text-[10px] font-bold uppercase tracking-tight transition-all truncate ${
                  currentStepIndex === idx 
                    ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm" 
                    : progressMetrics.steps[idx]?.completed 
                    ? "text-emerald-600 bg-emerald-50" 
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                0{idx + 1}. {title}
              </button>
            ))}
          </div>
        </div>

        {/* --- WIZARD STEP CONTAINER --- */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm min-h-[380px] flex flex-col justify-between">
          
          {/* STEP 0: BASIC DETAILS */}
          {currentStepIndex === 0 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <SectionHeader icon={<Layers size={16} />} title="01. Basic Context Matrix" sub="Define system target parameters and bug title vector" />
              <div className="space-y-4 pt-2">
                <InputField label="Bug Track Heading / Summary" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Critical Failure on Payment Process runtime loop" required />
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Project</label>
                    <select
                      value={selectedProjectId}
                      onChange={e => {
                        setSelectedProjectId(parseInt(e.target.value));
                        setSelectedAssignee(null);
                      }}
                      className="w-full p-3.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 outline-none cursor-pointer font-bold focus:border-blue-500 transition-colors shadow-inner"
                    >
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  {/* Module Component Input Field (Changed from Select) */}
                  <InputField label="Target Module Component" name="module_name" value={formData.module_name} onChange={handleInputChange} placeholder="e.g. Checkout / Auth Gateway" required />
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: SEVERITY & ASSIGNMENT */}
          {currentStepIndex === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <SectionHeader icon={<Cpu size={16} />} title="02. Severity Vector & Developer Assignment" sub="Classify failure footprint impact matrices" />
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Severity Level</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Critical', 'High', 'Medium', 'Low'].map(sev => (
                      <SeverityButton key={sev} label={sev} current={formData.severity} onClick={(val) => setFormData(p => ({...p, severity: val}))} />
                    ))}
                  </div>
                </div>

                {/* Custom Assignee Dropdown */}
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Assign Developer Vector</label>
                  <button
                    type="button"
                    onClick={() => setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-3.5 text-xs font-bold text-slate-700 flex items-center justify-between outline-none hover:border-blue-400 shadow-inner"
                    disabled={isMembersLoading}
                  >
                    <div className="flex items-center gap-2">
                      {selectedAssignee ? (
                        <>
                          <div className="w-5 h-5 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-[9px] font-black shrink-0">
                            {selectedAssignee?.avatar_url ? (
                              <img src={import.meta.env.VITE_SERVER_URL + selectedAssignee?.avatar_url} alt="Avatar" crossOrigin="anonymous" className="w-full h-full object-cover" />
                            ) : selectedAssignee?.full_name?.[0] || "U"}
                          </div>
                          <span className="truncate">{selectedAssignee?.full_name}</span>
                        </>
                      ) : (
                        <span className="text-slate-400 font-normal">{isMembersLoading ? "Syncing Workspace Members..." : "Select Dev Target"}</span>
                      )}
                    </div>
                    <ChevronRight size={14} className="text-slate-400 rotate-90" />
                  </button>

                  {isAssigneeDropdownOpen && !isMembersLoading && (
                    <div className="absolute left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 max-h-48 overflow-y-auto">
                      {currentSelectedProject?.members?.length > 0 ? (
                        currentSelectedProject?.members?.map((u) => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => {
                              setSelectedAssignee(u);
                              setIsAssigneeDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                          >
                            <div className="w-5 h-5 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-[9px] font-black shrink-0">
                              {u?.avatar_url ? (
                                <img src={import.meta.env.VITE_SERVER_URL + u?.avatar_url} alt="Avatar" crossOrigin="anonymous" className="w-full h-full object-cover" />
                              ) : u?.full_name?.[0] || "U"}
                            </div>
                            <span className="text-xs font-bold text-slate-700 truncate">{u?.full_name}</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-xs text-slate-400 font-bold uppercase text-center">No team allocation mapped.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                 <CustomSelect label="Runtime Environment Scope" value={formData.environment} options={["Production", "Staging", "Dev"]} onChange={(val) => setFormData(p => ({...p, environment: val}))} />
              </div>
            </div>
          )}

          {/* STEP 2: REPRODUCTION STEPS */}
          {currentStepIndex === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <SectionHeader icon={<Terminal size={16} />} title="03. Reproduction Lifecycle Vectors" sub="Step execution thread maps & expected outputs" />
              <div className="space-y-6 pt-2">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Steps to Reproduce</label>
                    <button type="button" onClick={addStep} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"><Plus size={12}/> Add Step</button>
                  </div>
                  {formData.steps_to_repro.map((step, index) => (
                    <div key={index} className="flex gap-3 group items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="w-5 h-5 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black shrink-0 font-mono">0{index + 1}</span>
                      <input value={step} onChange={(e) => handleStepChange(index, e.target.value)} placeholder="Provide action trace context layer..." className="flex-1 bg-transparent text-xs py-1 outline-none font-medium text-slate-700 placeholder:text-slate-400" />
                      {formData.steps_to_repro.length > 1 && <Trash2 size={14} className="text-slate-400 hover:text-rose-500 cursor-pointer transition-colors" onClick={() => removeStep(index)}/>}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <TextArea label="Expected Assert Behavior" name="expected_result" value={formData.expected_result} onChange={handleInputChange} color="bg-emerald-50/40" border="border-emerald-200 text-emerald-900" placeholder="Describe the expected system state context..." />
                  <TextArea label="Actual Crash Output" name="actual_result" value={formData.actual_result} onChange={handleInputChange} color="bg-rose-50/40" border="border-rose-200 text-rose-900" placeholder="Describe the active failure dump traces..." />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: EVIDENCE FILES */}
          {currentStepIndex === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <SectionHeader icon={<Upload size={16} />} title="04. Binary Logs & Artifact Evidence" sub="Attach trace captures or system execution dumps" />
              <div className="pt-2">
                <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 transition-all group">
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-600 transition-colors mb-3" />
                  <p className="text-xs font-bold text-slate-700">Drop log captures or click to stream binary files</p>
                  <p className="text-[10px] text-slate-400 mt-1">Supports screenshots, logs, crash dumps</p>
                  <input type="file" multiple onChange={handleFileUpload} className="hidden" />
                </label>
                {files.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {files.map((f, i) => (
                      <div key={i} className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-2 rounded-lg flex items-center gap-3 shadow-sm">
                        <span>{f.name} ({f.size})</span>
                        <X size={12} className="cursor-pointer text-slate-400 hover:text-rose-500 transition-colors" onClick={() => setFiles(p => p.filter((_, idx) => idx !== i))}/>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: RED CARD ESCALATION */}
          {currentStepIndex === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <SectionHeader icon={<ShieldAlert size={16} />} title="05. Escalation Block Threat Layer" sub="Raise red card if architectural blocker is critical" />
              <div className={`rounded-xl border-2 p-6 transition-all ${formData.is_red_card ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'}`}>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" checked={formData.is_red_card} onChange={(e) => setFormData(p => ({...p, is_red_card: e.target.checked}))} className="w-5 h-5 accent-rose-500 rounded" />
                  <span className="font-black uppercase tracking-wider text-xs text-slate-800">Escalate Block Threat Layer (Raise Red Card)</span>
                </label>
                {formData.is_red_card && (
                  <textarea name="red_card_reason" value={formData.red_card_reason} onChange={handleInputChange} className="w-full mt-4 p-4 bg-white border border-rose-300 rounded-lg text-xs font-medium text-slate-700 outline-none shadow-sm focus:ring-1 focus:ring-rose-500 resize-none h-28" placeholder="Provide absolute architecture blockers explanation..." required />
                )}
              </div>
            </div>
          )}

          {/* --- BOTTOM WIZARD CONTROLS --- */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
            <button
              type="button"
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
              className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 transition-colors"
            >
              <ChevronLeft size={14} /> Previous Step
            </button>

            {currentStepIndex < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStepIndex(prev => Math.min(4, prev + 1))}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                Next Step <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={createIssueMutation.isPending}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Send size={14} /> {createIssueMutation.isPending ? "Streaming Data..." : "Commit Bug Report"}
              </button>
            )}
          </div>

        </div>

      </form>
    </div>
  );
};

// --- Sub-helper Functional Elements ---
const SectionHeader = ({ icon, title, sub }) => (
  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
    <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600 border border-blue-100 shadow-inner">{icon}</div>
    <div>
      <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">{title}</h3>
      <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">{sub}</p>
    </div>
  </div>
);

const SeverityButton = ({ label, current, onClick }) => (
  <button type="button" onClick={() => onClick(label)} className={`p-3 border rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${current === label ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" : "border-slate-200 text-slate-500 bg-white hover:border-slate-300 hover:text-slate-800"}`}>
    {label}
  </button>
);

const InputField = ({ label, ...props }) => (
  <div className="space-y-2 flex-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    <input className="w-full p-3.5 bg-white border border-slate-200 rounded-lg text-xs outline-none font-medium text-slate-700 focus:border-blue-500 transition-colors shadow-inner" {...props} />
  </div>
);

const TextArea = ({ label, color, border, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    <textarea className={`w-full h-28 p-4 ${color} ${border} border rounded-lg text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none shadow-inner`} {...props} />
  </div>
);

const CustomSelect = ({ label, value, options, onChange }) => (
  <div className="space-y-2 flex-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full p-3.5 border border-slate-200 rounded-lg text-xs bg-white outline-none font-bold text-slate-700 cursor-pointer focus:border-blue-500 transition-colors shadow-inner">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default ReportBugForm;