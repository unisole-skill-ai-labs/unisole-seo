import React, { useState } from 'react';
import { Check, Wrench, Download, CheckCircle2 } from 'lucide-react';

export interface ModuleItem {
  num: string;
  title: string;
  topics: string[];
  practical?: string;
  pipeline?: string[];
}

export interface CapstoneData {
  title: string;
  flow?: string[];
  outputs?: string[];
}

export interface PathwayData {
  id: string;
  eyebrow?: string;
  title: string;
  duration?: string;
  level?: string;
  handsOn?: string;
  price?: number;
  syllabusLink?: string;
  description?: string;
  roles?: string[];
  tools?: string[];
  modules: ModuleItem[];
  capstone?: CapstoneData;
}

interface PathwayCurriculumSectionProps {
  pathway: PathwayData;
  onSyllabusClick?: () => void;
}

const PHASE_METADATA: Record<string, { title: string; subtitle: string }[]> = {
  'cs-genai': [
    { title: 'Data & AI Backend Systems', subtitle: 'FastAPI, Docker, Caching & Data Prep' },
    { title: 'NLP & Sequence Models', subtitle: 'Text Embeddings, RNNs, LSTMs & Attention' },
    { title: 'Transformers & Production RAG', subtitle: 'BERT, Vector DBs, Hybrid Search & Evals' },
    { title: 'LangGraph & Agentic Systems', subtitle: 'Stateful Graphs, Tool Calling & Capstone' },
  ],
  'cs-agentic': [
    { title: 'Agent Loops & Fundamentals', subtitle: 'ReAct, Dynamic Tool Calling & MCP Protocol' },
    { title: 'Memory, State & Coordination', subtitle: 'LangGraph, Multi-Agent Swarms & State' },
    { title: 'Autonomous Workflows & HITL', subtitle: 'Docker Sandboxes, Observability & Guardrails' },
    { title: 'Cloud Deployment & Defense', subtitle: 'Cloud Infrastructure, Evals & Capstone' },
  ],
  'cs-p1': [
    { title: 'Data Engineering & Tracking', subtitle: 'Reproducibility, EDA & Experiment Tracking' },
    { title: 'Model Serving & Inference', subtitle: 'FastAPI, Batch/Stream & Low Latency' },
    { title: 'Pipelines & Orchestration', subtitle: 'Airflow, Feature Stores & Drift Monitoring' },
    { title: 'Cloud MLOps & Production', subtitle: 'Kubernetes, Cloud Deployments & Capstone' },
  ],
  'cs-common': [
    { title: 'Discovery & Market Fit', subtitle: 'Customer Discovery, ICP & Tech Feasibility' },
    { title: 'Rapid AI Prototyping', subtitle: 'Functional MVP, LLM APIs & UI Architecture' },
    { title: 'Business Model & Unit Economics', subtitle: 'Monetization, Pricing & CAC/LTV Strategy' },
    { title: 'Pitch Deck & Demo Day', subtitle: '10-Slide Deck, Live Demo & Investor Panel' },
  ],
};

export const PathwayCurriculumSection: React.FC<PathwayCurriculumSectionProps> = ({
  pathway,
  onSyllabusClick,
}) => {
  const [activePhase, setActivePhase] = useState(0);
  const modules = pathway.modules || [];
  const shouldPhase = modules.length > 4;

  const chunkSize = modules.length >= 9 ? 3 : (modules.length >= 6 ? 3 : 2);
  const phases: { index: number; title: string; subtitle: string; weekRange: string; modules: ModuleItem[] }[] = [];

  if (shouldPhase) {
    for (let i = 0; i < modules.length; i += chunkSize) {
      const phaseMods = modules.slice(i, i + chunkSize);
      const pIdx = Math.floor(i / chunkSize);
      const firstNum = phaseMods[0]?.num || `${i + 1}`;
      const lastNum = phaseMods[phaseMods.length - 1]?.num || `${i + phaseMods.length}`;
      const weekRange = firstNum === lastNum ? `W${firstNum}` : `W${firstNum}–${lastNum}`;

      const custom = PHASE_METADATA[pathway.id]?.[pIdx];
      const cleanTitle = custom?.title || phaseMods[0]?.title?.replace(/^Week\s*\d+\s*[-—:]\s*/i, '') || `Phase 0${pIdx + 1}`;
      const cleanSubtitle = custom?.subtitle || `Weeks ${firstNum} to ${lastNum} Competencies & Labs`;

      phases.push({
        index: pIdx,
        title: cleanTitle,
        subtitle: cleanSubtitle,
        weekRange,
        modules: phaseMods,
      });
    }
  }

  const currentPhaseIdx = Math.min(activePhase, Math.max(0, phases.length - 1));
  const displayModules = shouldPhase ? phases[currentPhaseIdx]?.modules || [] : modules;

  return (
    <div className="space-y-4 pt-2">
      {/* Milestone Phase Navigation Header */}
      {shouldPhase ? (
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                Milestone Roadmap
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {phases.length} Phases • {modules.length} Modules Total
              </span>
            </div>

            {onSyllabusClick && (
              <button
                type="button"
                onClick={onSyllabusClick}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span>Full Syllabus (PDF)</span>
              </button>
            )}
          </div>

          {/* Phase Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {phases.map((p) => {
              const isActive = p.index === currentPhaseIdx;
              return (
                <button
                  key={p.index}
                  type="button"
                  onClick={() => setActivePhase(p.index)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm ring-2 ring-zinc-900/10 dark:ring-white/20'
                      : 'bg-zinc-50/80 dark:bg-zinc-950/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span
                      className={`text-[10px] font-mono font-bold tracking-wider uppercase ${
                        isActive ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400 dark:text-zinc-500'
                      }`}
                    >
                      Phase 0{p.index + 1}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                          : 'bg-zinc-200/70 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {p.weekRange}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold leading-tight line-clamp-1">
                      {p.title}
                    </div>
                    <div
                      className={`text-[11px] line-clamp-1 mt-0.5 ${
                        isActive ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400 dark:text-zinc-500'
                      }`}
                    >
                      {p.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
            Curriculum Breakdown ({modules.length} Modules)
          </span>
        </div>
      )}

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
        {displayModules.map((mod) => {
          const cleanTitle = mod.title.replace(/^Week\s*\d+\s*[-—:]\s*/i, '');
          return (
            <div
              key={mod.num}
              className="border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-xs"
            >
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="text-[11px] font-mono font-bold text-zinc-900 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 px-2 py-0.5 rounded-md flex-shrink-0">
                    W{mod.num}
                  </span>
                  <h5 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                    {cleanTitle}
                  </h5>
                </div>

                <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                  {mod.topics.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="leading-snug">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-2.5 space-y-2">
                {mod.practical && (
                  <div className="bg-zinc-50/90 dark:bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800/80">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold mb-1">
                      <Wrench className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Hands-on Lab</span>
                    </div>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                      {mod.practical}
                    </p>
                  </div>
                )}

                {mod.pipeline && (
                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase mr-0.5">Flow:</span>
                    {mod.pipeline.map((step, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-1.5 py-0.5 text-[9px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded"
                      >
                        {step} {sIdx < mod.pipeline.length - 1 ? '→' : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Capstone Project Deliverable Section */}
      {pathway.capstone && (
        <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 rounded-xl p-5 space-y-3 mt-4">
          <div className="flex flex-wrap items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-2.5 gap-2">
            <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded">
              Capstone Defense
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
              {pathway.capstone.title}
            </h4>
          </div>

          {pathway.capstone.flow && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Execution Pipeline:</span>
              <div className="flex flex-wrap items-center gap-2">
                {pathway.capstone.flow.map((st, i) => (
                  <div key={st} className="flex items-center gap-1.5 text-xs">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[9px] font-bold text-zinc-700 dark:text-zinc-300">
                      {i + 1}
                    </span>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{st}</span>
                    {i < (pathway.capstone?.flow?.length ?? 0) - 1 && <span className="text-zinc-400">→</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {pathway.capstone.outputs && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Employer-Ready Deliverables:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {pathway.capstone.outputs.map((out, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 flex-shrink-0" />
                    <span className="font-medium">{out}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PathwayCurriculumSection;
