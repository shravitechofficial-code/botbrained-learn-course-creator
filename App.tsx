
import React, { useState, useEffect } from 'react';
import { SelectionState, Persona, Vertical, Level, SkillType, BuildType, RoadmapResult } from './types';
import { 
  PERSONA_DATA, 
  VERTICAL_DETAILS, 
  LEVEL_DETAILS, 
  SKILL_TYPE_DETAILS, 
  BUILD_TYPE_DETAILS, 
  LOGO 
} from './constants';
import { SelectionCard } from './components/SelectionCard';
import { generateRoadmap } from './services/geminiService';
import { OutputDisplay } from './components/OutputDisplay';

const LOADING_PHASES = [
  { label: 'Waking up the silicon brain', message: "Botbrained Learn is hunting for coffee... and your 2026 survival guide." },
  { label: 'Vibe checking your persona', message: "Ensuring your AI roadmap is cooler than your neighbor's smart toaster." },
  { label: 'Actually Googling stuff', message: "Searching real links. No fake 'example.com' garbage allowed here." },
  { label: 'Drafting your escape plan', message: "Condensing months of 'AI hype' into 90 minutes of pure, unadulterated utility." },
  { label: 'Design-ish things', message: "Building a 13-slide deck so you can look like a genius in your next meeting." },
  { label: 'Polishing the marketing lies', message: "I mean, crafting high-conversion ad hooks. Definitely the latter." },
  { label: 'Almost ready to disrupt', message: "Removing the hallucinations. (Mostly). Hang tight!" },
];

const App: React.FC = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [result, setResult] = useState<RoadmapResult | null>(null);
  const [selections, setSelections] = useState<SelectionState>({
    persona: null,
    vertical: null,
    level: null,
    skillType: null,
    buildType: null,
  });

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingPhase((prev) => (prev < LOADING_PHASES.length - 1 ? prev + 1 : prev));
      }, 3500);
    } else {
      setLoadingPhase(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSelection = (key: keyof SelectionState, value: any) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const roadmap = await generateRoadmap(selections);
      if (roadmap && roadmap.title) {
        setResult(roadmap);
      } else {
        throw new Error("Invalid roadmap data received");
      }
    } catch (error) {
      console.error("Failed to generate roadmap", error);
      alert("The AI had a brain freeze or couldn't find real links. Refresh and try again—we'll keep the silicon warm.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelections({
      persona: null,
      vertical: null,
      level: null,
      skillType: null,
      buildType: null,
    });
    setResult(null);
    setStep(0);
  };

  const isBuildingSelected = selections.skillType === SkillType.BUILDING;
  const isUsingSelected = selections.skillType === SkillType.USING;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-12">
            <div className="text-center space-y-6 max-w-4xl mx-auto py-8">
              <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-widest animate-bounce">
                No Ph.D. Required. No Math Required. 🧠
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
                Job-Proof Your Life <br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Before a Fridge Does.</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Look, the robots are coming. You can either hide under your desk or learn to build them. We choose the latter. Get a custom roadmap that actually works in <span className="text-white font-semibold">2026</span>. 🚀
              </p>
            </div>
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-white tracking-tight italic">"Who am I and why am I here?"</h2>
                <p className="text-slate-500 mt-1">Pick your current vibe below.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {PERSONA_DATA.map(p => (
                  <SelectionCard
                    key={p.id}
                    label={p.label}
                    icon={p.icon}
                    description={p.description}
                    selected={selections.persona === p.label}
                    onClick={() => handleSelection('persona', p.label as Persona)}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-12">
              <button
                disabled={!selections.persona}
                onClick={nextStep}
                className="group relative px-12 py-5 bg-indigo-600 text-white rounded-full font-black text-xl hover:bg-indigo-500 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_40px_rgba(79,70,229,0.3)]"
              >
                Let's Go! ➔
              </button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-8">
             <div className="text-center space-y-4 mb-12">
              <h1 className="text-5xl font-black text-white">What's your arena?</h1>
              <p className="text-slate-400 text-lg">Choose where you'll be deploying your AI army.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {VERTICAL_DETAILS.map(v => (
                <SelectionCard
                  key={v.label}
                  label={v.label}
                  description={v.description}
                  selected={selections.vertical === v.label}
                  onClick={() => handleSelection('vertical', v.label as Vertical)}
                />
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-12">
               <button onClick={prevStep} className="px-10 py-4 border border-white/10 text-white rounded-full font-bold hover:bg-white/5">Wait, go back</button>
               <button disabled={!selections.vertical} onClick={nextStep} className="px-10 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-lg">Next: Power Level</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-5xl font-black text-white">How much do you know?</h1>
              <p className="text-slate-400 text-lg">Be honest. We won't judge.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {LEVEL_DETAILS.map(l => (
                <SelectionCard
                  key={l.label}
                  label={l.label}
                  description={l.description}
                  selected={selections.level === l.label}
                  onClick={() => handleSelection('level', l.label as Level)}
                />
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-12">
               <button onClick={prevStep} className="px-10 py-4 border border-white/10 text-white rounded-full font-bold hover:bg-white/5">Go Back</button>
               <button disabled={!selections.level} onClick={nextStep} className="px-10 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-lg">Onward!</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-5xl font-black text-white">The Crossroads</h1>
              <p className="text-slate-400 text-lg">Do you want to drive the car or build the engine?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {SKILL_TYPE_DETAILS.map(s => (
                <SelectionCard
                  key={s.label}
                  label={s.label}
                  description={s.description}
                  selected={selections.skillType === s.label}
                  onClick={() => handleSelection('skillType', s.label as SkillType)}
                />
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-12">
               <button onClick={prevStep} className="px-10 py-4 border border-white/10 text-white rounded-full font-bold">Back</button>
               <button 
                disabled={!selections.skillType || loading} 
                onClick={isUsingSelected ? handleGenerate : nextStep} 
                className={`px-10 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-lg flex items-center gap-2 ${loading ? 'animate-pulse' : ''}`}
               >
                 {isUsingSelected 
                   ? (loading ? 'Consulting the Brain...' : 'Build My Roadmap') 
                   : 'One More Step...'
                 }
               </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-5xl font-black text-white">Building Vibe</h1>
              <p className="text-slate-400 text-lg">How are we making these robots work?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {BUILD_TYPE_DETAILS.map(b => (
                <SelectionCard
                  key={b.label}
                  label={b.label}
                  description={b.description}
                  selected={selections.buildType === b.label}
                  onClick={() => handleSelection('buildType', b.label as BuildType)}
                />
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-12">
               <button onClick={prevStep} className="px-10 py-4 border border-white/10 text-white rounded-full font-bold">Back</button>
               <button 
                disabled={!selections.buildType || loading} 
                onClick={handleGenerate} 
                className={`px-10 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-lg flex items-center gap-2 ${loading ? 'animate-pulse' : ''}`}
               >
                 {loading ? 'Crunching Numbers...' : 'Generate My Future'}
               </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const progressPercentage = (isUsingSelected && step >= 3) ? 100 : ((step + 1) / 5) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <nav className="p-6 border-b border-white/5 sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-lg shadow-lg">
              {LOGO}
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase italic">botbrained</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-500">
            <span>2026 Ready</span>
            <div className="w-1 h-1 bg-slate-700 rounded-full" />
            <span>Zero Hallucinations</span>
            <div className="w-1 h-1 bg-slate-700 rounded-full" />
            <span>Job-Proof</span>
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto p-6 md:p-12 pb-24 z-10">
        {result ? (
          <OutputDisplay data={result} onReset={reset} />
        ) : (
          <div className="max-w-5xl mx-auto">
            {!loading && (
              <div className="w-full h-1 bg-white/5 rounded-full mb-16 relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[500px] space-y-12 max-w-2xl mx-auto">
                <div className="relative">
                  <div className="w-40 h-40 border-4 border-indigo-500/10 border-t-pink-500 rounded-full animate-spin" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl animate-bounce">🤖</div>
                  <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full animate-pulse" />
                </div>

                <div className="text-center space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <h2 className="text-4xl font-black text-white">
                      {LOADING_PHASES[loadingPhase].label}...
                    </h2>
                    <p className="text-xl text-slate-400 italic bg-white/5 p-4 rounded-2xl border border-white/10">
                      "{LOADING_PHASES[loadingPhase].message}"
                    </p>
                  </div>

                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-[3.5s] ease-linear shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                      style={{ width: `${((loadingPhase + 1) / LOADING_PHASES.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em]">Neural Processing at 8.4 TFLOPS (maybe)</p>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {renderStep()}
              </div>
            )}
          </div>
        )}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50" />
    </div>
  );
};

export default App;
