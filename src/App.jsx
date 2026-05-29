import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target, Save, Trash2, ArrowLeft, Zap, Download, Upload, ShieldCheck, Youtube, Ban, Heart, Printer, Info } from 'lucide-react';

// SYLLABUS DATA (2023-2025 Standardized E-Maths 4052)
const SYLLABUS_DATA = [
  { name: "Algebra", goal: 11.7 }, 
  { name: "Eqn/Inequalities", goal: 12.2 },
  { name: "Pythagoras/Trigo", goal: 9.8 }, 
  { name: "Mensuration", goal: 10.0 },
  { name: "Data Handling", goal: 7.0 }, 
  { name: "Number Operations", goal: 6.5 },
  { name: "Percentage", goal: 5.2 }, 
  { name: "Functions/Graph", goal: 5.7 },
  { name: "Probability", goal: 4.4 }, 
  { name: "Ratio/Proportion", goal: 5.2 },
  { name: "Vectors", goal: 3.5 }, 
  { name: "Coord Geometry", goal: 4.4 },
  { name: "Angles/Polygons", goal: 3.1 }, 
  { name: "Matrices", goal: 2.4 },
  { name: "Congruence/Similarity", goal: 2.2 }, 
  { name: "Properties Circles", goal: 2.6 },
  { name: "Rate/Speed", goal: 2.4 }, 
  { name: "Sets", goal: 1.5 }
];

export default function ExamMasterySystem() {
  const [view, setView] = useState('dashboard');
  const [exams, setExams] = useState([]);
  const [activeTab, setActiveTab] = useState('P1');
  const [currentExam, setCurrentExam] = useState({ id: null, title: '', p1Rows: [], p1Date: '', p2Rows: [], p2Date: '' });
  const fileInputRef = useRef(null);

  // DATA PERSISTENCE (Keyed to E-Maths 4052)
  useEffect(() => {
    const saved = localStorage.getItem('eps_emath_gps_v1');
    if (saved) { 
      try { setExams(JSON.parse(saved)); } catch (e) { setExams([]); } 
    } else { setExams([]); }
  }, []);

  const syncData = (newData) => {
    setExams(newData);
    localStorage.setItem('eps_emath_gps_v1', JSON.stringify(newData));
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(exams)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ExamPaperStrategist_EMATH_4052_Backup.json`;
    link.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          syncData(imported);
          alert("Database Successfully Restored.");
        } catch (err) { alert("Invalid File Format."); }
      };
      reader.readAsText(file);
    }
  };

  const handlePrint = () => window.print();

  const handleSave = () => {
    if (!currentExam.title) return alert("Please name your Exam Set.");
    const filtered = exams.filter(e => e.id !== currentExam.id);
    syncData([currentExam, ...filtered]);
    setView('dashboard');
  };

  const latest = exams[0] || { p1Rows: [], p2Rows: [] };
  const allRows = [...(latest.p1Rows || []), ...(latest.p2Rows || [])];
  
  const analysis = SYLLABUS_DATA.map(t => {
    const relevant = allRows.filter(r => r.topic === t.name);
    const s = relevant.reduce((acc, r) => acc + Number(r.myScore || 0), 0);
    const m = relevant.reduce((acc, r) => acc + Number(r.maxMarks || 0), 1);
    const mastery = (s / m) * 100;
    const impact = t.goal * (1 - (mastery / 100));
    return { ...t, reality: Number(mastery.toFixed(1)), impactScore: impact };
  });

  const prioritized = [...analysis].sort((a, b) => b.impactScore - a.impactScore);

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 pb-20">
      
      {/* PRINT OVERRIDE STYLES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          .print-full-height { max-height: none !important; overflow: visible !important; }
          .print-break-inside-avoid { page-break-inside: avoid; }
          body { background: white !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .custom-scrollbar { overflow: visible !important; height: auto !important; }
        }
      `}} />

      {/* 1. ANTI-SCAM BANNER */}
      <div className="w-full bg-[#EA580C] text-white py-2.5 px-6 text-center text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4 border-b-2 border-[#C2410C] no-print">
        <Ban size={13}/><span>OFFICIAL @EXAMPAPERSTRATEGIST GPS: THIS APP IS 100% FREE. IF YOU PAID FOR THIS, YOU HAVE BEEN SCAMMED!</span><Ban size={13}/>
      </div>

      {/* 2. LOGO & UTILITY HEADER */}
      <nav className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center my-8 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 mx-4 print:shadow-none print:border-none">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="bg-indigo-600 p-3 rounded-3xl text-white shadow-lg shadow-indigo-100"><ShieldCheck size={28}/></div>
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
              O-LEVEL E-MATHS <span className="text-indigo-600">STRATEGIC GPS</span>
            </h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Syllabus 4052 Mastery Module</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 no-print">
          <a href="https://youtube.com/@ExamPaperStrategist" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-3 bg-[#FFF1F2] text-[#E11D48] rounded-2xl font-black text-[10px] hover:bg-[#FFE4E6] uppercase tracking-tight transition-all">
            <Youtube size={16}/> Usage Guide
          </a>
          <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>
          
          <input type="file" ref={fileInputRef} onChange={importData} className="hidden" accept=".json" />
          <button onClick={() => fileInputRef.current.click()} title="Import JSON" className="p-3 text-slate-400 hover:text-indigo-600 transition-colors"><Upload size={20}/></button>
          <button onClick={exportData} title="Export JSON" className="p-3 text-slate-400 hover:text-indigo-600 transition-colors"><Download size={20}/></button>
          <button onClick={handlePrint} title="Print PDF" className="p-3 text-slate-400 hover:text-indigo-600 transition-colors"><Printer size={20}/></button>
          
          <button onClick={() => { setCurrentExam({ id: Date.now(), title: '', p1Rows: [], p1Date: '', p2Rows: [], p2Date: '' }); setView('entry'); }} className="bg-indigo-600 text-white px-8 py-3.5 rounded-[1.5rem] font-black text-sm shadow-lg shadow-indigo-100 transition-transform active:scale-95">+ Add Paper</button>
        </div>
      </nav>

      {view === 'dashboard' ? (
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          {/* Main Analytics Engine Chart */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 print-break-inside-avoid">
             <div className="flex justify-between items-center mb-10">
                <h3 className="font-black text-base uppercase text-slate-400 flex items-center gap-3"><Target size={20}/> Syllabus Coverage Tracking <span className="text-indigo-600 italic uppercase">({latest.title || 'No Data'})</span></h3>
                <div className="text-3xl window-percentage font-black text-indigo-600">
                   {exams.length > 0 ? (allRows.reduce((s,r)=>s+Number(r.myScore||0),0)/allRows.reduce((m,r)=>m+Number(r.maxMarks||0),1)*100).toFixed(1) : "0.0"}%
                </div>
             </div>
             <div className="h-96 w-full">
                <ResponsiveContainer>
                  <BarChart data={analysis}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{fontSize: 9, fontWeight: 800, fill: '#64748B'}} angle={-45} textAnchor="end" height={80} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="goal" name="Syllabus Target" fill="#F1F5F9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="reality" name="Your Mastery" radius={[4, 4, 0, 0]}>
                      {analysis.map((entry, i) => <Cell key={i} fill={entry.reality >= entry.goal ? '#10B981' : '#6366F1'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Core Analytics Matrix Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <h3 className="font-black text-base uppercase mb-8 flex items-center gap-3"><Zap size={20} className="text-[#F59E0B]"/> Strategic Study Priority</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar print-full-height">
                   {prioritized.map((item, idx) => (
                     <div key={item.name} className="flex justify-between items-center p-5 bg-[#F8FAFC] rounded-3xl border border-slate-100 hover:shadow-lg transition-all print-break-inside-avoid">
                        <div>
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Priority #{idx+1}</span>
                          <p className="font-black text-slate-700 text-sm tracking-tight">{item.name}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-base font-black ${item.reality < item.goal ? 'text-[#E11D48]' : 'text-[#10B981]'}`}>{item.reality}%</p>
                          <p className="text-[9px] font-bold text-slate-300 tracking-tighter">Impact Score: {item.impactScore.toFixed(0)}</p>
                        </div>
                     </div>
                   ))}
                </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 no-print">
               <h3 className="font-black text-base uppercase italic mb-6">Recent Attempts</h3>
               <div className="space-y-3">
                 {exams.map(e => (
                   <div key={e.id} className="group flex justify-between items-center p-4 rounded-2xl hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all">
                      <button onClick={() => {setCurrentExam(e); setView('entry')}} className="text-left flex-1">
                        <p className="font-black text-sm text-slate-700 uppercase italic tracking-tight">{e.title}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{e.p1Date || '--'} | {e.p2Date || '--'}</p>
                      </button>
                      <button onClick={() => { if(window.confirm("Delete record?")) syncData(exams.filter(x => x.id !== e.id)) }} className="opacity-0 group-hover:opacity-100 p-2 text-slate-200 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      ) : (
        /* DATA ENTRY ENGINE VIEW */
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100">
             <div className="flex justify-between mb-12 items-center">
                <input className="text-4xl font-black text-slate-800 outline-none w-2/3 uppercase placeholder:text-slate-100 bg-transparent tracking-tighter" placeholder="EXAM NAME (E.G. TYS 2024)" value={currentExam.title} onChange={e => setCurrentExam({...currentExam, title: e.target.value.toUpperCase()})} />
                <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-400 font-bold text-sm uppercase hover:text-indigo-600 no-print"><ArrowLeft size={16}/> Back</button>
             </div>

             <div className="flex gap-2 mb-10 bg-[#F1F5F9] p-2.5 rounded-[2.5rem] border border-slate-100 no-print">
                {['P1', 'P2'].map(p => (
                  <button key={p} onClick={() => setActiveTab(p)} className={`flex-1 py-5 rounded-[1.7rem] text-xs font-black transition-all ${activeTab === p ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400'}`}>PAPER {p === 'P1' ? '1' : '2'}</button>
                ))}
             </div>

             <div className="space-y-3 mb-12 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar print-full-height">
                {(activeTab === 'P1' ? currentExam.p1Rows : currentExam.p2Rows).map((row, idx) => (
                  <div key={row.id} className="flex items-center gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm transition-all print-break-inside-avoid">
                    <input placeholder="Q#" value={row.qNo} onChange={e => { const k = activeTab === 'P1' ? 'p1Rows' : 'p2Rows'; const n = [...currentExam[k]]; n[idx].qNo = e.target.value; setCurrentExam({...currentExam, [k]: n}); }} className="w-12 font-black text-indigo-600 outline-none bg-transparent" />
                    <select value={row.topic} onChange={e => { const k = activeTab === 'P1' ? 'p1Rows' : 'p2Rows'; const n = [...currentExam[k]]; n[idx].topic = e.target.value; setCurrentExam({...currentExam, [k]: n}); }} className="flex-1 font-bold text-slate-500 text-sm outline-none bg-transparent">
                      {SYLLABUS_DATA.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                    </select>
                    <input type="number" placeholder="Marks" value={row.myScore} onChange={e => { const k = activeTab === 'P1' ? 'p1Rows' : 'p2Rows'; const n = [...currentExam[k]]; n[idx].myScore = e.target.value; setCurrentExam({...currentExam, [k]: n}); }} className="w-16 p-2.5 bg-[#EEF2FF] rounded-xl font-black text-center text-indigo-600 outline-none" /><span className="text-slate-200">/</span><input type="number" placeholder="Max" value={row.maxMarks} onChange={e => { const k = activeTab === 'P1' ? 'p1Rows' : 'p2Rows'; const n = [...currentExam[k]]; n[idx].maxMarks = e.target.value; setCurrentExam({...currentExam, [k]: n}); }} className="w-16 p-2.5 bg-[#F1F5F9] rounded-xl font-bold text-center text-slate-300  outline-none" />
                    <button onClick={() => { const k = activeTab === 'P1' ? 'p1Rows' : 'p2Rows'; const n = currentExam[k].filter((_, i) => i !== idx); setCurrentExam({...currentExam, [k]: n}); }} className="text-slate-200 hover:text-red-500 transition-colors no-print"><Trash2 size={16}/></button>
                  </div>
                ))}
             </div>

             <button onClick={() => { const k = activeTab === 'P1' ? 'p1Rows' : 'p2Rows'; setCurrentExam({...currentExam, [k]: [...currentExam[k], {id: Date.now(), qNo: '', topic: SYLLABUS_DATA[0].name, myScore: '', maxMarks: ''}]}); }} className="w-full py-5 rounded-[2rem] border-2 border-dashed border-slate-100 text-slate-300 font-bold text-sm mb-12 hover:bg-indigo-50 transition-all no-print">+ Add Question Row</button>

             <button onClick={handleSave} className="w-full bg-indigo-600 text-white font-black py-7 rounded-[2.5rem] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all no-print">
                <Save size={24}/> LOCK IN RESULTS
             </button>
          </div>
        </div>
      )}

      {/* FOOTER & ACCREDITATION DATA LAYER */}
      <footer className="max-w-7xl mx-auto mt-16 p-8 border-t border-slate-200 mx-4">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-xs">
              <Heart size={14} className="fill-indigo-600" />{' '}
              @ExamPaperStrategist Engine
            </div>
            <p className="text-[10px] text-slate-400 italic">
              Developed by @ExamPaperStrategist. This tool is built entirely for your own tracking and revision strategy.
            </p>
            {/* CLICKABLE EMAIL LINK FOR QUERIES */}
            <p className="text-[10px] font-bold text-slate-500 pt-1 no-print">
              For queries or custom builds: <a href="mailto:miketutor2025@hotmail.com" className="text-indigo-600 hover:underline">miketutor2025@hotmail.com</a>
            </p>
          </div>
          <div className="flex-1 space-y-2 border-l border-slate-100 pl-8">
            <h4 className="font-black text-[10px] uppercase text-slate-500 tracking-tighter flex items-center gap-1">
              <Info size={12} /> Academic Notice
            </h4>
            <p className="text-[9px] leading-relaxed text-slate-400">
              Personal tracking tool matching historical SEAB GCE O-Level 4052 parameters (2023-2025). This tool is just for your own tracking and revision strategy. We are not responsible for your final school grades or exam results.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
