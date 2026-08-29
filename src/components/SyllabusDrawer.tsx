import React, { useEffect } from 'react';
import PdfViewer from './PdfViewer';
import { X, Download, ArrowRight } from 'lucide-react';

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
  onClose,
  onEnroll,
}: SyllabusDrawerProps) {
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

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="syllabus-modal-title"
    >
      <div className="w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col h-[94vh] max-h-[950px] overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        
        {/* ================= MINIMAL CLEAN HEADER ================= */}
        <div className="px-5 py-3.5 border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-black text-xs flex items-center justify-center shrink-0">
              U
            </span>
            <div className="min-w-0">
              <h2
                id="syllabus-modal-title"
                className="text-sm sm:text-base font-bold text-white tracking-tight truncate"
              >
                {pathway.title}
              </h2>
              <span className="text-[11px] font-mono text-zinc-400 block -mt-0.5">
                Official Curriculum Syllabus
              </span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer active:scale-95 border border-zinc-700/50"
              title="Download Offline Copy"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            {pathway.enrollLink && (
              <a
                href={pathway.enrollLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onEnroll && onEnroll(pathway.enrollLink!)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <span>Enroll</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= BODY: DIRECT NATIVE PDF VIEWER ================= */}
        <div className="flex-1 overflow-hidden p-2 sm:p-4 bg-zinc-950">
          <PdfViewer
            url={`/syllabi/${pathway.id}.pdf`}
            title={`${pathway.title} Syllabus`}
            onDownload={handleDownloadPdf}
          />
        </div>

      </div>
    </div>
  );
}
