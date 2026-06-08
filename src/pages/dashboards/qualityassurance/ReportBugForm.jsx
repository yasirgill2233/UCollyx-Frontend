import React, { useState, useMemo } from "react";
import {
  CheckCircle,
  Circle,
  Upload,
  X,
  Plus,
  Trash2,
  ArrowLeftIcon,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useProjectMembers, useCreateIssue } from "../../../hooks/useIssues";
import { triggerToast } from "../../../utils/toastHelper";
import { useMyProjects } from "../../../hooks/useProjects";

const ReportBugForm = () => {
  const navigate = useNavigate();
  const createIssueMutation = useCreateIssue();

  // Static reference lists (Inko aap backend calls se bhi pull kar sakte hain)
  const availableProjects = [
    { id: 1, name: "E-Commerce Platform" },
    { id: 15, name: "UCollyx Workspace" },
    { id: 16, name: "Mobile App App" },
  ];

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

  // const { data: projectMembers = [], isLoading: isMembersLoading } = useProjectMembers(selectedProjectId);

  const { data: myProjects, isLoading: isMembersLoading } = useMyProjects();
  const projects = myProjects?.data || [];

  
  const currentSelectedProject = useMemo(() => {
    if (!selectedProjectId || !projects.length) return null;
    return projects.find(project => String(project.id) === String(selectedProjectId));
  }, [selectedProjectId, projects]);
  
  console.log(projects, selectedProjectId, currentSelectedProject)

  // --- Dynamic Form Completion Tracker ---
  const progressMetrics = useMemo(() => {
    const steps = [
      { id: "Basic Details", completed: !!(formData.title && selectedProjectId && formData.module_name) },
      { id: "Severity & Team", completed: !!(formData.severity && selectedAssignee?.id) },
      { id: "Description", completed: !!(formData.steps_to_repro.some(s => s.trim() !== "") && formData.expected_result && formData.actual_result) },
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
      rawFile: file // For server form-data payload parsing context
    }));
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. Create a fresh FormData object instance
    const formDataPayload = new FormData();

    // 2. Append standard text fields
    formDataPayload.append("project_id", selectedProjectId);
    formDataPayload.append("assigned_to", selectedAssignee?.id || "");
    formDataPayload.append("title", formData.title);
    formDataPayload.append("description", `Module: ${formData.module_name}`);
    formDataPayload.append("severity", formData.severity);
    formDataPayload.append("environment", formData.environment);
    formDataPayload.append("expected_result", formData.expected_result);
    formDataPayload.append("actual_result", formData.actual_result);
    
    // Steps to reproduce ko stringify karke ya plain text format mein append karein
    formDataPayload.append("steps_to_repro", JSON.stringify(formData.steps_to_repro));
    
    // Metadata block (Red card validation logic)
    formDataPayload.append("metadata", JSON.stringify({
      is_red_card: formData.is_red_card,
      red_card_reason: formData.is_red_card ? formData.red_card_reason : ""
    }));

    // 3. 🔥 CRITICAL FIX: Append actual raw binary files to matching 'issues' field name
    // files array ke andar jo origin file pointer hai (rawFile), usay append karna hai
    files.forEach((fileObj) => {
      // fileObj.rawFile hamari asal binary file hai jo target input[type="file"] se aayi thi
      if (fileObj.rawFile) {
        formDataPayload.append("issues", fileObj.rawFile); 
      }
    });

    // 4. Trigger React Query mutation with Multipart configuration header context
    createIssueMutation.mutate(formDataPayload, {
      onSuccess: () => {
        triggerToast("Bug Form Created Succesffully","success")
      }
    });
  };

  // --- Submit Handler ---
  // const handleSubmit = (e) => {
  //   e.preventDefault();
    
  //   // Server expected dynamic architecture bundle payload compilation
  //   const payload = {
  //     project_id: selectedProjectId,
  //     assigned_to: selectedAssignee?.id || null,
  //     title: formData.title,
  //     description: `Module: ${formData.module_name}`,
  //     severity: formData.severity,
  //     environment: formData.environment,
  //     steps_to_repro: formData.steps_to_repro.filter(s => s.trim() !== "").join("\n"),
  //     expected_result: formData.expected_result,
  //     actual_result: formData.actual_result,
  //     // Custom system attributes context integration
  //     metadata: JSON.stringify({
  //       is_red_card: formData.is_red_card,
  //       red_card_reason: formData.is_red_card ? formData.red_card_reason : ""
  //     })
  //   };

  //   createIssueMutation.mutate(payload, {
  //     onSuccess: () => {
  //       // Submit successfully hone par user navigation backup
  //       // navigate(-1);
  //       triggerToast("Bug Form Created Succesffully","success")
  //     }
  //   });
  // };

  return (
    <div className="flex-1 bg-[#F9FBFF] min-h-screen p-8">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in-50 duration-500">
        
        {/* Page Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex justify-start items-center gap-3">
              <ArrowLeftIcon className="hover:cursor-pointer text-slate-600 hover:text-blue-600 transition-colors" onClick={() => navigate(-1)} />
              Report a Quality Issue
            </h1>
            <p className="text-sm text-slate-400">Log trace details directly into your workspace pipeline</p>
          </div>
        </div>

        {/* 1. DYNAMIC PROGRESS BAR SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-bold text-slate-800">Pipeline Progression Tracker</h3>
            <span className="text-sm font-black text-blue-600 transition-all duration-500">
              {progressMetrics.percentage}% complete
            </span>
          </div>
          <div className="relative flex justify-between items-center px-2">
            <div className="absolute top-[15px] left-0 w-full h-1 bg-slate-100 z-0" />
            <div 
              className="absolute top-[15px] left-0 h-1 bg-blue-600 z-0 transition-all duration-700 ease-in-out" 
              style={{ width: `${progressMetrics.percentage}%` }}
            />

            {progressMetrics.steps.map((step, idx) => (
              <ProgressStep 
                key={step.id} 
                label={step.id} 
                completed={step.completed}
                active={progressMetrics.percentage >= ((idx + 1) * 20)}
              />
            ))}
          </div>
        </div>

        {/* 2. Basic Details Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <SectionHeader title="Basic Context Details" sub="Identify project allocation vectors" />
          <div className="grid gap-5 mt-8">
            <InputField label="Bug Track Heading / Reference" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Critical Failure on Payment Process checkout checkout runtime loop" required />
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2 flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Target Project</label>
                <select 
                  value={selectedProjectId} 
                  onChange={e => {
                    setSelectedProjectId(parseInt(e.target.value));
                    setSelectedAssignee(null); // Reset user profile validation when swapping context projects
                  }} 
                  className="w-full p-3.5 border border-slate-200 rounded-xl text-xs bg-white outline-none cursor-pointer font-bold text-slate-700"
                >
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <CustomSelect label="Target Module Component" value={formData.module_name} options={["Checkout", "Dashboard Engine", "Auth Gateway", "Product Catalog"]} onChange={(val) => setFormData(p => ({...p, module_name: val}))} />
            </div>
          </div>
        </div>

        {/* 3. Severity & Allocation Custom Select Team Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <SectionHeader title="Severity Profile & Target Dev Assignment" sub="Classify system footprint impact matrices" />
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Severity Vector</label>
              <div className="grid grid-cols-2 gap-3">
                {['Critical', 'High', 'Medium', 'Low'].map(sev => (
                  <SeverityButton key={sev} label={sev} current={formData.severity} onClick={(val) => setFormData(p => ({...p, severity: val}))} />
                ))}
              </div>
            </div>

            {/* Custom Assignee Dropdown Selector with Images Support */}
            <div className="space-y-2 relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Assign Developer for Fix</label>
              <button
                type="button"
                onClick={() => setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs font-bold text-slate-700 flex items-center justify-between outline-none"
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
                    <span className="text-slate-400 font-normal">{isMembersLoading ? "Syncing Project Members..." : "Select Assignee Developer"}</span>
                  )}
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {isAssigneeDropdownOpen && !isMembersLoading && (
                <div className="absolute left-0 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
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
                        <div className="w-5 h-5 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-[9px] font-black shrink-0 border border-slate-100">
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
          
          <div className="mt-5">
             <CustomSelect label="Runtime Environment Scope" value={formData.environment} options={["Production", "Staging", "Dev"]} onChange={(val) => setFormData(p => ({...p, environment: val}))} />
          </div>
        </div>

        {/* 4. CONSOLIDATED DESCRIPTION */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <SectionHeader title="Reproduction Lifecycle Vectors" sub="Steps execution thread maps" />
          <div className="mt-8 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Steps to Reproduce</label>
                <button type="button" onClick={addStep} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"><Plus size={12}/> Add Step</button>
              </div>
              {formData.steps_to_repro.map((step, index) => (
                <div key={index} className="flex gap-3 group items-center">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[9px] font-black shrink-0">{index + 1}</span>
                  <input value={step} onChange={(e) => handleStepChange(index, e.target.value)} placeholder="Provide action trace context layer..." className="flex-1 border-b border-slate-100 text-xs py-2 focus:border-blue-500 outline-none font-medium text-slate-600 transition-colors" />
                  {formData.steps_to_repro.length > 1 && <Trash2 size={14} className="text-slate-300 hover:text-red-500 cursor-pointer transition-colors" onClick={() => removeStep(index)}/>}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <TextArea label="Expected Assert Behavior Result" name="expected_result" value={formData.expected_result} onChange={handleInputChange} color="bg-green-50/10" border="border-green-100/70 text-slate-700" placeholder="Describe the expected system state context..." />
              <TextArea label="Actual Crash Output Result" name="actual_result" value={formData.actual_result} onChange={handleInputChange} color="bg-red-50/10" border="border-red-100/70 text-slate-700" placeholder="Describe the active failure dump traces..." />
            </div>
          </div>
        </div>

        {/* 5. Evidence Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <SectionHeader title="Binary Logs & Artifact Evidence" sub="Attach trace captures or system execution dumps" />
          <div className="mt-6">
            <label className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50/50 transition-colors group">
              <Upload className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors mb-2" />
              <p className="text-xs font-bold text-slate-500">Drop log captures or click to stream binary files</p>
              <input type="file" multiple onChange={handleFileUpload} className="hidden" />
            </label>
            {files.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <div key={i} className="text-[10px] font-bold text-slate-600 bg-slate-100/80 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2">
                    <span>{f.name} ({f.size})</span>
                    <X size={12} className="cursor-pointer text-slate-400 hover:text-red-500 transition-colors" onClick={() => setFiles(p => p.filter((_, idx) => idx !== i))}/>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 6. Red Card Section */}
        <div className={`rounded-3xl border-2 p-8 transition-all ${formData.is_red_card ? 'border-red-500 bg-red-50/10' : 'border-slate-200 bg-white'}`}>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input type="checkbox" checked={formData.is_red_card} onChange={(e) => setFormData(p => ({...p, is_red_card: e.target.checked}))} className="w-5 h-5 accent-red-500 rounded" />
            <span className="font-black uppercase tracking-wider text-xs text-slate-700">Escalate Block Threat Layer (Raise Red Card)</span>
          </label>
          {formData.is_red_card && (
            <textarea name="red_card_reason" value={formData.red_card_reason} onChange={handleInputChange} className="w-full mt-4 p-4 bg-white border border-red-100 rounded-2xl text-xs font-medium text-slate-600 outline-none shadow-sm focus:border-red-400" placeholder="Provide absolute architecture blockers explanation..." required />
          )}
        </div>

        <button 
          type="submit" 
          disabled={createIssueMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-600/10 transition-all active:scale-[0.99]"
        >
          {createIssueMutation.isPending ? "Streaming Data to Pipeline..." : "Commit Bug Report"}
        </button>
      </form>
    </div>
  );
};

// --- Sub-helper Functional Elements ---
const ProgressStep = ({ label, active, completed }) => (
  <div className="relative z-10 flex flex-col items-center gap-2">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white transition-all duration-500 ${completed ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20" : active ? "border-blue-600 text-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.15)]" : "border-slate-200 text-slate-300"}`}>
      {completed ? <CheckCircle size={16} /> : <Circle size={8} className="fill-current" />}
    </div>
    <span className={`text-[8px] font-black uppercase tracking-tighter ${active ? "text-blue-600" : "text-slate-400"}`}>{label}</span>
  </div>
);

const SectionHeader = ({ title, sub }) => (
  <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
    <div className="p-2 bg-blue-50 rounded-xl text-blue-600 shadow-inner"><CheckCircle size={18} /></div>
    <div><h3 className="text-xs font-black uppercase tracking-wider text-slate-800">{title}</h3><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{sub}</p></div>
  </div>
);

const SeverityButton = ({ label, current, onClick }) => (
  <button type="button" onClick={() => onClick(label)} className={`p-3 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${current === label ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" : "border-slate-200 text-slate-400 bg-white hover:border-slate-300"}`}>
    {label}
  </button>
);

const InputField = ({ label, ...props }) => (
  <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label><input className="w-full p-3.5 border border-slate-200 rounded-xl text-xs outline-none font-medium text-slate-600 focus:border-blue-500 transition-colors bg-white shadow-inner" {...props} /></div>
);

const TextArea = ({ label, color, border, ...props }) => (
  <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label><textarea className={`w-full h-28 p-4 ${color} ${border} border rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none shadow-inner`} {...props} /></div>
);

const CustomSelect = ({ label, value, options, onChange }) => (
  <div className="space-y-2 flex-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label><select value={value} onChange={e => onChange(e.target.value)} className="w-full p-3.5 border border-slate-200 rounded-xl text-xs bg-white outline-none font-bold text-slate-700 cursor-pointer">{options.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
);

export default ReportBugForm;