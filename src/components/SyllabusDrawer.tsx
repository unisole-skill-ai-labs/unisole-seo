import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  FileText,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  Layers,
  Award,
  ArrowRight,
  ShieldCheck,
  Clock,
  Briefcase,
  Wrench,
  GraduationCap,
  Eye,
} from 'lucide-react';

interface ModuleItem {
  num: string;
  title: string;
  topics?: string[];
  practical?: string;
  pipeline?: string[];
}

interface PathwayData {
  id: string;
  eyebrow?: string;
  title: string;
  duration?: string;
  level?: string;
  handsOn?: string;
  enrollLink?: string;
  syllabusLink?: string;
  description?: string;
  roles?: string[];
  tools?: string[];
  modules?: ModuleItem[];
  capstone?: {
    title: string;
    flow?: string[];
    outputs?: string[];
  };
}

interface SyllabusDrawerProps {
  isOpen: boolean;
  pathway: PathwayData | null;
  groupTitle?: string;
  onClose: () => void;
  onEnroll?: (link: string) => void;
}

export default function SyllabusDrawer({
  isOpen,
  pathway,
  groupTitle,
  onClose,
  onEnroll,
}: SyllabusDrawerProps) {
  const [activeTab, setActiveTab] = useState<'interactive' | 'pdf'>('interactive');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    '01': true,
    '02': true,
  });

  // Resolve local self-hosted PDF URL
  const getEmbedPdfUrl = (pathwayId?: string, fallbackUrl?: string) => {
    if (pathwayId) return `/syllabi/${pathwayId}.pdf`;
    if (!fallbackUrl || fallbackUrl === '#') return null;
    const driveMatch = fallbackUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }
    return fallbackUrl;
  };

  // Keyboard shortcut ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset tab when pathway changes
  useEffect(() => {
    if (pathway) {
      setActiveTab('interactive');
      setExpandedModules({ '01': true, '02': true });
    }
  }, [pathway?.id]);

  // Instant direct PDF file download from local domain
  const handleDownloadPdf = () => {
    if (!pathway) return;

    const downloadUrl = `/syllabi/${pathway.id}.pdf`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `Unisole_${pathway.title.replace(/[^a-zA-Z0-9]/g, '_')}_Syllabus.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen || !pathway) return null;

  const embedUrl = getEmbedPdfUrl(pathway.id, pathway.syllabusLink);

  const toggleModule = (num: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [num]: !prev[num],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    pathway.modules?.forEach((m) => {
      all[m.num] = true;
    });
    setExpandedModules(all);
  };

  const collapseAll = () => {
    setExpandedModules({});
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex justify-end bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="syllabus-drawer-title"
    >
      <div className="w-full max-w-2xl sm:max-w-3xl bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col h-full overflow-hidden transform transition-all animate-in slide-in-from-right duration-300">
        
        {/* ================= HEADER ================= */}
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-bold tracking-wider">
                {pathway.eyebrow || 'CURRICULUM'}
              </span>
              {groupTitle && (
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  • {groupTitle}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Close Syllabus (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h2
              id="syllabus-drawer-title"
              className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight"
            >
              {pathway.title}
            </h2>
            {pathway.description && (
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                {pathway.description}
              </p>
            )}
          </div>

          {/* Quick Metrics & Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {pathway.duration && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                {pathway.duration}
              </span>
            )}
            {pathway.level && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                {pathway.level}
              </span>
            )}
            {pathway.handsOn && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                {pathway.handsOn}
              </span>
            )}
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('interactive')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'interactive'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Interactive Syllabus</span>
            </button>

            {embedUrl && (
              <button
                type="button"
                onClick={() => setActiveTab('pdf')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'pdf'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Official PDF View</span>
              </button>
            )}
          </div>
        </div>

        {/* ================= BODY CONTENT ================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'interactive' ? (
            <div className="space-y-6">
              {/* Controls: Expand / Collapse all */}
              {pathway.modules && pathway.modules.length > 0 && (
                <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-800 text-xs">
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    {pathway.modules.length} Core Modules & Milestones
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={expandAll}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                    >
                      Expand All
                    </button>
                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                    <button
                      onClick={collapseAll}
                      className="text-[11px] text-zinc-500 hover:underline font-semibold cursor-pointer"
                    >
                      Collapse All
                    </button>
                  </div>
                </div>
              )}

              {/* Module Accordions */}
              <div className="space-y-3">
                {pathway.modules?.map((m) => {
                  const isExpanded = !!expandedModules[m.num];
                  return (
                    <div
                      key={m.num}
                      className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 overflow-hidden transition-all shadow-xs"
                    >
                      <button
                        type="button"
                        onClick={() => toggleModule(m.num)}
                        className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-8 h-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-500/20">
                            {m.num}
                          </span>
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                            {m.title}
                          </h4>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 space-y-3 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/40 animate-in fade-in duration-150">
                          {/* Topics List */}
                          {m.topics && m.topics.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                                Key Topics Covered
                              </span>
                              <ul className="space-y-1.5">
                                {m.topics.map((t, idx) => (
                                  <li
                                    key={idx}
                                    className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{t}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Practical / Deliverable */}
                          {m.practical && (
                            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 text-xs">
                              <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-0.5">
                                🛠️ Hands-On Practical Deliverable:
                              </span>
                              <span className="text-zinc-700 dark:text-zinc-300">
                                {m.practical}
                              </span>
                            </div>
                          )}

                          {/* Pipeline Steps */}
                          {m.pipeline && m.pipeline.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                                Production Workflow Pipeline
                              </span>
                              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                {m.pipeline.map((step, sIdx) => (
                                  <React.Fragment key={sIdx}>
                                    <span className="px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-[11px]">
                                      {step}
                                    </span>
                                    {sIdx < m.pipeline!.length - 1 && (
                                      <span className="text-zinc-400">→</span>
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Capstone Project Section */}
              {pathway.capstone && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/30 via-zinc-900 to-violet-950/30 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400 shrink-0" />
                    <h3 className="font-extrabold text-sm text-zinc-100">
                      Final Capstone: {pathway.capstone.title}
                    </h3>
                  </div>

                  {pathway.capstone.flow && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {pathway.capstone.flow.map((node, nIdx) => (
                        <React.Fragment key={nIdx}>
                          <span className="px-2.5 py-1 rounded-lg bg-white/10 text-indigo-200 font-mono text-[10px]">
                            {node}
                          </span>
                          {nIdx < pathway.capstone!.flow!.length - 1 && (
                            <span className="text-zinc-500 text-xs">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  {pathway.capstone.outputs && (
                    <ul className="space-y-1 pt-1 border-t border-white/10">
                      {pathway.capstone.outputs.map((out, oIdx) => (
                        <li
                          key={oIdx}
                          className="text-xs text-zinc-300 flex items-center gap-2"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Tools & Frameworks Stack */}
              {pathway.tools && pathway.tools.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Tools & Tech Stack Mastered</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {pathway.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-mono border border-zinc-200 dark:border-zinc-700"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Roles */}
              {pathway.roles && pathway.roles.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Target Career Roles</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {pathway.roles.map((role, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* PDF Tab Embed */
            <div className="h-full flex flex-col space-y-3">
              {embedUrl ? (
                <div className="flex-1 min-h-[500px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 shadow-inner relative">
                  <iframe
                    src={embedUrl}
                    title={`${pathway.title} Syllabus PDF`}
                    className="w-full h-full min-h-[500px] border-0"
                    allow="autoplay"
                  />
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                  <FileText className="w-10 h-10 mb-2 text-zinc-500" />
                  <p className="text-xs">PDF preview not available for this pathway.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= FOOTER / CTA ACTIONS ================= */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-colors cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF Copy</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
            {pathway.enrollLink && (
              <a
                href={pathway.enrollLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onEnroll && onEnroll(pathway.enrollLink!)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <span>Enroll in Pathway</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
