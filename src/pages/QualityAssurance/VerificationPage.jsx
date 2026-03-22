import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Search, Terminal, ArrowLeft, Clock } from 'lucide-react';

const VerificationPage = () => {
  const location = useLocation();
  const incomingBugs = location.state?.bugs;

  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('steps'); 
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [activeModal, setActiveModal] = useState(null); 
  const [failComment, setFailComment] = useState("");

  useEffect(() => {
    if (incomingBugs && incomingBugs.length > 0) {
      // Mapping individual data without generic templates
      const formatted = incomingBugs.map((bug, index) => ({
        ...bug, 
        id: bug.id,
        tc: bug.tc || `TC-${2300 + index}`, 
        link: bug.id,
        status: bug.testStatus || 'PENDING',
        priority: bug.severity,
        // Individual fields uthaye ja rahe hain
        steps: bug.steps || ["No execution steps provided for this bug."], 
        expected: bug.expected || "No specific expected result defined.",
        actual: bug.actual || bug.title,
        summary: bug.summary || "No resolution summary provided.",
        commit: bug.commit || "N/A",
        sprint: bug.sprint || "Current Sprint"
      }));
      setData(formatted);
      setSelectedId(formatted[0].id);
    } else {
      // Default fallback agar dashboard se data na aaye
      setData([
        { 
          id: 'BUG-1247', tc: 'TC-2301', link: 'BUG-1247', title: 'Checkout flow crashes on payment', 
          project: 'E-Commerce', status: 'PENDING', priority: 'CRITICAL', sprint: 'Sprint 24',
          steps: ["Add items to cart", "Navigate to checkout", "Click Complete Purchase"],
          expected: "Payment processes successfully and order confirmed.", 
          actual: "Application freezes on payment screen with 504 error.", 
          summary: "Timeout increased and retry logic added to payment API.", 
          commit: "a7f3c92"
        }
      ]);
      setSelectedId('BUG-1247');
    }
  }, [incomingBugs]);

  const filteredList = useMemo(() => {
    return data.filter(item => 
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       item.link.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (projectFilter === "All Projects" || item.project === projectFilter)
    );
  }, [searchQuery, projectFilter, data]);

  const activeData = useMemo(() => data.find(d => d.id === selectedId) || data[0], [selectedId, data]);

  const handleStatusUpdate = (newStatus) => {
    setData(prev => prev.map(item => 
      item.id === selectedId ? { ...item, status: newStatus } : item
    ));
    setActiveModal(null);
    setFailComment("");
  };

  if (!activeData) return null;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => window.history.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft size={18}/></button>
            <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">Verification Lab</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search ID or Title..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none w-64 focus:ring-2 focus:ring-indigo-500/20 font-bold" />
            </div>
            <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-slate-500 outline-none cursor-pointer">
              <option>All Projects</option>
              <option>E-Commerce</option><option>CRM</option><option>Mobile App</option>
            </select>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          {/* Left Panel */}
          <div className="w-[50%] border-r border-slate-200 bg-white flex flex-col shrink-0">
            <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retest Queue</h2>
              <span className="bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded font-black">{filteredList.length} ITEMS</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {filteredList.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full p-5 rounded-[1.5rem] border-2 text-left transition-all ${
                    selectedId === item.id ? 'border-indigo-600 bg-white shadow-lg -translate-y-0.5' : 'border-slate-50 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">#{item.id}</span>
                    <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase border ${
                      item.status === 'PASSED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      item.status === 'FAILED' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {item.status === 'PENDING' ? 'IN QUEUE' : item.status}
                    </span>
                  </div>
                  <h4 className={`text-[13px] font-bold mb-3 leading-snug ${selectedId === item.id ? 'text-indigo-600' : 'text-slate-800'}`}>{item.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded text-white ${item.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-400'}`}>{item.priority}</span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{item.project}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 bg-white flex flex-col overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-100 shrink-0">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1 uppercase">Verification: {activeData.id}</h2>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{activeData.project} • {activeData.sprint}</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                   <Clock size={14} className="text-slate-400"/>
                   <span className="text-[10px] font-black text-slate-500 uppercase">Verification Active</span>
                </div>
              </div>

              <div className="flex gap-10">
                {['steps', 'summary'].map((t) => (
                  <button key={t} onClick={() => setActiveTab(t)} className={`pb-4 text-[10px] font-black tracking-[0.2em] relative transition-colors ${activeTab === t ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-500'}`}>
                    {t === 'steps' ? 'EXECUTION PROCEDURE' : 'BUG RECAP'}
                    {activeTab === t && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
              {activeTab === 'steps' ? (
                <div className="space-y-10 max-w-4xl">
                  <section>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Step-by-Step Execution</label>
                    <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
                      {activeData.steps.map((step, i) => (
                        <div key={i} className="flex gap-5 p-5 text-[13px] font-bold text-slate-600 hover:bg-slate-50/50 transition-colors">
                          <span className="text-indigo-300 font-black">{i + 1}.</span> 
                          <p className="leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl border border-emerald-100 bg-emerald-50/10">
                      <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-3 block">Expected Result</label>
                      <p className="text-[12px] font-bold text-slate-600 leading-relaxed">{activeData.expected}</p>
                    </div>
                    <div className="p-6 rounded-3xl border border-red-100 bg-red-50/10">
                      <label className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-3 block">Observed Bug</label>
                      <p className="text-[12px] font-bold text-slate-600 leading-relaxed">{activeData.actual}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-10 max-w-3xl">
                  <section>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Resolution Summary</label>
                    <div className="p-8 rounded-[2.5rem] bg-indigo-50/30 border border-indigo-100 text-slate-800 text-lg font-bold leading-relaxed shadow-inner">
                      "{activeData.summary}"
                    </div>
                  </section>
                  <section>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Developer Handover</label>
                    <div className="flex items-center justify-between p-6 bg-slate-900 rounded-2xl shadow-xl">
                      <div className="flex items-center gap-4 text-white">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-black">GIT</div>
                        <div>
                          <p className="text-[9px] text-indigo-400 font-black tracking-widest">REFERENCE COMMIT</p>
                          <code className="text-sm font-bold text-indigo-100">{activeData.commit}</code>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>

            <div className="p-8 bg-white border-t border-slate-100 shrink-0">
              <div className="flex gap-4">
                <button onClick={() => setActiveModal('pass')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl text-xs font-black shadow-lg shadow-emerald-100 transition-all uppercase tracking-widest">
                  Verify & Pass ✓
                </button>
                <button onClick={() => setActiveModal('fail')} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl text-xs font-black shadow-lg shadow-red-100 transition-all uppercase tracking-widest">
                  Reject & Reopen ↺
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODALS remain same as your functional original */}
      {activeModal === 'pass' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-[2.5rem] p-10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black italic">✓</div>
            <h3 className="text-xl font-black mb-2 uppercase">Confirm Pass?</h3>
            <p className="text-xs text-slate-400 font-bold mb-10 uppercase tracking-widest">Marking this bug as resolved permanently.</p>
            <div className="flex gap-3">
              <button onClick={() => setActiveModal(null)} className="flex-1 py-4 border border-slate-100 rounded-2xl font-black text-slate-400 text-[10px] uppercase">Cancel</button>
              <button onClick={() => handleStatusUpdate('PASSED')} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-emerald-100">Confirm Pass</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'fail' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-[440px] rounded-[2.5rem] p-10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black italic">✕</div>
            <h3 className="text-xl font-black mb-2 uppercase">Confirm Fail?</h3>
            <textarea value={failComment} onChange={(e) => setFailComment(e.target.value)} placeholder="Provide failure details..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-xs font-bold h-32 mb-8 outline-none focus:ring-2 focus:ring-red-100" />
            <div className="flex gap-3">
              <button onClick={() => setActiveModal(null)} className="flex-1 py-4 border border-slate-100 rounded-2xl font-black text-slate-400 text-[10px] uppercase">Cancel</button>
              <button disabled={!failComment.trim()} onClick={() => handleStatusUpdate('FAILED')} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-red-100 disabled:opacity-50">Reject Ticket</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationPage;