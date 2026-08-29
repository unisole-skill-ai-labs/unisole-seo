import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  Loader2,
  AlertCircle,
  RotateCw,
  Layers,
  FileText,
} from 'lucide-react';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PdfViewerProps {
  url: string;
  title?: string;
  onDownload?: () => void;
}

export default function PdfViewer({ url, title = 'Document', onDownload }: PdfViewerProps) {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('all');

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<{ [key: number]: HTMLCanvasElement | null }>({});

  // Auto calculate Fit to Width
  const calculateFitWidth = (customDoc?: any) => {
    const docToUse = customDoc || pdfDoc;
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth - (window.innerWidth < 640 ? 32 : 64);
    if (containerWidth > 200) {
      if (docToUse) {
        docToUse.getPage(1).then((firstPage: any) => {
          const defaultViewport = firstPage.getViewport({ scale: 1.0, rotation });
          const newScale = containerWidth / defaultViewport.width;
          setScale(Math.max(0.6, Math.min(newScale, 2.2)));
        }).catch(() => {
          const fallbackScale = containerWidth / 595;
          setScale(Math.max(0.6, Math.min(fallbackScale, 2.2)));
        });
      } else {
        const fallbackScale = containerWidth / 595;
        setScale(Math.max(0.6, Math.min(fallbackScale, 2.2)));
      }
    }
  };

  // Load PDF Document & Auto Fit Width
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setCurrentPage(1);

    const loadingTask = pdfjsLib.getDocument({
      url,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
      cMapPacked: true,
    });

    loadingTask.promise
      .then((doc) => {
        if (!isMounted) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setLoading(false);
        // Default to Fit Width on document load
        setTimeout(() => {
          if (isMounted) calculateFitWidth(doc);
        }, 50);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF document. Please verify the file path.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
      loadingTask.destroy().catch(() => {});
    };
  }, [url]);

  // ResizeObserver for dynamic fit-width on window resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      calculateFitWidth();
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [pdfDoc, rotation]);

  // Render a specific page onto its canvas with HiDPI support
  const renderPage = async (pageNumber: number, canvas: HTMLCanvasElement) => {
    if (!pdfDoc) return;

    try {
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale, rotation });
      const context = canvas.getContext('2d');
      if (!context) return;

      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

      const renderContext = {
        canvasContext: context,
        transform,
        viewport,
      };

      await page.render(renderContext).promise;
    } catch (err: any) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error(`Error rendering page ${pageNumber}:`, err);
      }
    }
  };

  // Trigger page renders when doc, scale, rotation, or viewMode changes
  useEffect(() => {
    if (!pdfDoc) return;

    if (viewMode === 'all') {
      for (let i = 1; i <= numPages; i++) {
        const canvas = canvasRefs.current[i];
        if (canvas) {
          renderPage(i, canvas);
        }
      }
    } else {
      const canvas = canvasRefs.current[currentPage];
      if (canvas) {
        renderPage(currentPage, canvas);
      }
    }
  }, [pdfDoc, numPages, currentPage, scale, rotation, viewMode]);

  // Navigation handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.6));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFitWidth = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 48; // padding
      if (containerWidth > 300) {
        // Standard A4 width is ~595pt
        const newScale = containerWidth / 620;
        setScale(Math.max(0.7, Math.min(newScale, 1.8)));
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-[200] rounded-none' : 'w-full h-full min-h-[560px]'
      }`}
    >
      {/* ================= PDF TOOLBAR ================= */}
      <div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0 text-zinc-300">
        
        {/* Left: View Mode & Page Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-zinc-800/80 p-1 rounded-xl border border-zinc-700/50">
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Continuous Scroll Mode"
            >
              All Pages
            </button>
            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'single'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Single Page Mode"
            >
              Single
            </button>
          </div>

          {viewMode === 'single' && (
            <div className="flex items-center gap-1.5 bg-zinc-800/80 px-2 py-1 rounded-xl border border-zinc-700/50 text-xs">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="p-1 rounded-md hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-zinc-200 font-bold px-1">
                {currentPage} / {numPages || 1}
              </span>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage >= numPages}
                className="p-1 rounded-md hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {viewMode === 'all' && numPages > 0 && (
            <span className="text-xs font-mono text-zinc-400">
              {numPages} {numPages === 1 ? 'Page' : 'Pages'}
            </span>
          )}
        </div>

        {/* Center/Right: Zoom & Display Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-zinc-800/80 p-1 rounded-xl border border-zinc-700/50">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-zinc-200 px-1.5 min-w-[42px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleFitWidth}
            className="px-2.5 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl border border-zinc-700/50 text-xs font-semibold transition-colors cursor-pointer"
            title="Fit to Width"
          >
            Fit Width
          </button>

          <button
            type="button"
            onClick={handleRotate}
            className="p-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl border border-zinc-700/50 transition-colors cursor-pointer"
            title="Rotate 90°"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl border border-zinc-700/50 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
              title="Download PDF Copy"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= PDF CANVAS VIEWPORT ================= */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 bg-zinc-950/90 flex flex-col items-center gap-6 select-none relative">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-xs z-10 text-zinc-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-xs font-medium tracking-wide">Rendering Crisp Vector PDF...</p>
          </div>
        )}

        {error && (
          <div className="my-auto p-6 max-w-md rounded-2xl bg-rose-950/30 border border-rose-800/40 text-center space-y-3 text-rose-300">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Document Display Error</h4>
            <p className="text-xs text-rose-300/80 leading-relaxed">{error}</p>
            {onDownload && (
              <button
                onClick={onDownload}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Direct Download PDF</span>
              </button>
            )}
          </div>
        )}

        {!loading && !error && numPages > 0 && (
          <>
            {viewMode === 'all' ? (
              // Continuous multi-page stream
              Array.from({ length: numPages }, (_, index) => {
                const pageNum = index + 1;
                return (
                  <div
                    key={pageNum}
                    className="flex flex-col items-center gap-2 group transition-all"
                  >
                    <div className="rounded-xl overflow-hidden shadow-2xl border border-zinc-800 bg-white ring-1 ring-white/10 hover:ring-indigo-500/30 transition-all">
                      <canvas
                        ref={(el) => {
                          canvasRefs.current[pageNum] = el;
                        }}
                        className="block max-w-full"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      Page {pageNum} of {numPages}
                    </span>
                  </div>
                );
              })
            ) : (
              // Single page view
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-xl overflow-hidden shadow-2xl border border-zinc-800 bg-white ring-1 ring-white/10">
                  <canvas
                    ref={(el) => {
                      canvasRefs.current[currentPage] = el;
                    }}
                    className="block max-w-full"
                  />
                </div>
                <span className="text-[10px] font-mono text-zinc-500">
                  Page {currentPage} of {numPages}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
