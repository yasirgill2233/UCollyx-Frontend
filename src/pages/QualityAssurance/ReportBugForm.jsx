import React, { useState, useMemo } from "react";
import {
  CheckCircle,
  Circle,
  ChevronDown,
  Upload,
  AlertTriangle,
  ShieldAlert,
  X,
  Plus,
  Trash2,
  ArrowLeftIcon,
} from "lucide-react";
import { useNavigate } from "react-router";


const ReportBugForm = () => {
  const [formData, setFormData] = useState({
    bugTitle: "",
    project: "E-Commerce Platform",
    module: "Product Catalog",
    environment: "Staging",
    severity: "CRITICAL",
    bugType: "",
    steps: [""],
    expectedResult: "",
    actualResult: "",
    isRedCard: false,
    redCardReason: "",
  });

  const [files, setFiles] = useState([]);

  const navigate = useNavigate()

  // --- Dynamic Progress Logic ---
  const progressMetrics = useMemo(() => {
    const steps = [
      { id: 'Basic Details', completed: !!(formData.bugTitle && formData.project && formData.module) },
      { id: 'Severity & Type', completed: !!(formData.severity && formData.bugType) },
      { id: 'Description', completed: !!(formData.steps.some(s => s.trim() !== "") && formData.expectedResult && formData.actualResult) },
      { id: 'Evidence', completed: files.length > 0 },
      { id: 'Red Card Check', completed: formData.isRedCard ? !!formData.redCardReason : true }, // If red card is off, it's "complete" by default
    ];

    const completedCount = steps.filter(s => s.completed).length;
    const percentage = Math.round((completedCount / steps.length) * 100);

    return { percentage, steps };
  }, [formData, files]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData((prev) => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => setFormData((prev) => ({ ...prev, steps: [...prev.steps, ""] }));

  const removeStep = (index) => {
    if (formData.steps.length > 1) {
      const newSteps = formData.steps.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, steps: newSteps }));
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files).map((file) => ({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    }));
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  return (
    <div className="flex-1 bg-[#F9FBFF] min-h-screen p-8">
      <form className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in-50 duration-500">
        
        {/* Page Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex justify-start items-center gap-2"><ArrowLeftIcon className="hover:cursor-pointer" onClick={()=>navigate(-1)}/>Report a Bug</h1>
            <p className="text-sm text-slate-400">Provide clear details to help fix the issue quickly</p>
          </div>
        </div>

        {/* 1. DYNAMIC PROGRESS BAR SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-bold text-slate-800">Form Progress</h3>
            <span className="text-sm font-bold text-blue-600 transition-all duration-500">
              {progressMetrics.percentage}% complete
            </span>
          </div>
          <div className="relative flex justify-between items-center px-2">
            {/* Background Line */}
            <div className="absolute top-[15px] left-0 w-full h-1 bg-slate-100 z-0" />
            {/* Animated Progress Line */}
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
          <SectionHeader title="Basic Details" sub="Identify the bug and its context" />
          <div className="grid gap-5 mt-8">
            <InputField label="Bug Title" name="bugTitle" value={formData.bugTitle} onChange={handleInputChange} placeholder="e.g. TASK-2342342" />
            <div className="grid grid-cols-2 gap-5">
              <CustomSelect label="Project" value={formData.project} options={["E-Commerce Platform", "UCollyx", "Mobile App"]} onChange={(val) => setFormData(p => ({...p, project: val}))} />
              <CustomSelect label="Module" value={formData.module} options={["Checkout", "Dashboard", "Auth"]} onChange={(val) => setFormData(p => ({...p, module: val}))} />
            </div>
          </div>
        </div>

        {/* 3. Severity & Type Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <SectionHeader title="Severity & Type" sub="Classify the impact" />
          <div className="mt-8 space-y-5">
            <div className="grid grid-cols-4 gap-4">
              {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
                <SeverityButton key={sev} label={sev} current={formData.severity} onClick={(val) => setFormData(p => ({...p, severity: val}))} />
              ))}
            </div>
            <InputField label="Bug Type" name="bugType" value={formData.bugType} onChange={handleInputChange} placeholder="Select Type (e.g. UI, Logic, Security)" />
          </div>
        </div>

        {/* 4. CONSOLIDATED DESCRIPTION */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <SectionHeader title="Description" sub="Steps, Expected and Actual Results" />
          <div className="mt-8 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Steps to Reproduce</label>
                <button type="button" onClick={addStep} className="text-blue-600 flex items-center gap-1 text-[10px] font-bold"><Plus size={12}/> Add Step</button>
              </div>
              {formData.steps.map((step, index) => (
                <div key={index} className="flex gap-3 group">
                  <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">{index + 1}</span>
                  <input value={step} onChange={(e) => handleStepChange(index, e.target.value)} placeholder="Enter step..." className="flex-1 border-b border-slate-100 text-xs py-1 focus:border-blue-500 outline-none" />
                  {formData.steps.length > 1 && <Trash2 size={14} className="text-slate-300 hover:text-red-500 cursor-pointer" onClick={() => removeStep(index)}/>}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <TextArea label="Expected Result" name="expectedResult" value={formData.expectedResult} onChange={handleInputChange} color="bg-green-50/30" border="border-green-100" />
              <TextArea label="Actual Result" name="actualResult" value={formData.actualResult} onChange={handleInputChange} color="bg-red-50/30" border="border-red-100" />
            </div>
          </div>
        </div>

        {/* 5. Evidence Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <SectionHeader title="Evidence" sub="Screenshots or Logs" />
          <div className="mt-6">
            <label className="border-2 border-dashed border-slate-100 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50">
              <Upload className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs text-slate-500">Click to upload files</p>
              <input type="file" multiple onChange={handleFileUpload} className="hidden" />
            </label>
            {files.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {files.map((f, i) => <div key={i} className="text-[10px] bg-slate-100 px-2 py-1 rounded flex items-center gap-2">{f.name} <X size={10} className="cursor-pointer" onClick={() => setFiles(p => p.filter((_, idx) => idx !== i))}/></div>)}
              </div>
            )}
          </div>
        </div>

        {/* 6. Red Card Section */}
        <div className={`rounded-3xl border-2 p-8 transition-all ${formData.isRedCard ? 'border-red-500' : 'border-slate-200'}`}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={formData.isRedCard} onChange={(e) => setFormData(p => ({...p, isRedCard: e.target.checked}))} className="w-5 h-5 accent-red-500" />
            <span className="font-bold text-slate-700">Raise Red Card</span>
          </label>
          {formData.isRedCard && (
            <textarea name="redCardReason" value={formData.redCardReason} onChange={handleInputChange} className="w-full mt-4 p-4 bg-red-50/20 border border-red-100 rounded-xl text-xs outline-none" placeholder="Reason for escalation..." />
          )}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all">Submit Bug Report</button>
      </form>
    </div>
  );
};

// --- Helper Components ---
const ProgressStep = ({ label, active, completed }) => (
  <div className="relative z-10 flex flex-col items-center gap-2">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white transition-all duration-500 ${completed ? "bg-blue-600 border-blue-600 text-white" : active ? "border-blue-600 text-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.2)]" : "border-slate-200 text-slate-300"}`}>
      {completed ? <CheckCircle size={18} /> : <Circle size={10} className="fill-current" />}
    </div>
    <span className={`text-[9px] font-bold uppercase ${active ? "text-blue-600" : "text-slate-300"}`}>{label}</span>
  </div>
);

const SectionHeader = ({ title, sub }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><CheckCircle size={20} /></div>
    <div><h3 className="text-sm font-bold text-slate-800">{title}</h3><p className="text-[10px] text-slate-400 font-semibold uppercase">{sub}</p></div>
  </div>
);

const SeverityButton = ({ label, current, onClick }) => (
  <button type="button" onClick={() => onClick(label)} className={`p-3 border-2 rounded-xl text-xs font-black transition-all ${current === label ? "border-blue-600 bg-blue-50 text-blue-700 shadow-inner" : "border-slate-100 text-slate-400 hover:border-slate-200"}`}>
    {label}
  </button>
);

const InputField = ({ label, ...props }) => (
  <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label><input className="w-full p-3 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 transition-colors" {...props} /></div>
);

const TextArea = ({ label, color, border, ...props }) => (
  <div className="space-y-2"><label className="text-[10px] font-bold text-slate-500 uppercase">{label}</label><textarea className={`w-full h-24 p-4 ${color} ${border} border rounded-2xl text-xs outline-none focus:ring-1 focus:ring-blue-500/20`} {...props} /></div>
);

const CustomSelect = ({ label, value, options, onChange }) => (
  <div className="space-y-2 flex-1"><label className="text-[10px] font-bold text-slate-400 uppercase">{label}</label><select value={value} onChange={e => onChange(e.target.value)} className="w-full p-3.5 border border-slate-200 rounded-xl text-xs bg-white outline-none cursor-pointer">{options.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
);

export default ReportBugForm;