import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Play, Sparkles, Terminal, Activity, RefreshCw, Cpu, Layers, HardDrive } from 'lucide-react';

export default function AiPlaygroundPage() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama-3-8b-instruct');

  const runMockInference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setOutput('');

    setTimeout(() => {
      setLoading(false);
      setOutput(
        `[inference@unisole-engine:${selectedModel}] > Processing context...\n\n` +
        `Response based on your query: "${prompt}"\n\n` +
        `✅ Unisole local model executed successfully.\n` +
        `⏱️ Latency: 142ms\n` +
        `⚡ Throughput: 58 tokens/sec\n` +
        `📦 Resources: GPU Node-4 (NVIDIA A10G)\n\n` +
        `Welcome to the Sandbox. Your input is fully verified on our secure gateway. You can use our endpoints at /api/v1/inference to query these weights programmatically.`
      );
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-950">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider mb-3">
              <Activity className="w-3.5 h-3.5" />
              Interactive AI Sandbox
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              AI Playground & Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-2xl">
              Test machine learning models, inspect active nodes inside school networks, and run sandbox inference queries using the local gateway cluster.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Inference Tester */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
                  <div className="flex items-center gap-2.5">
                    <Terminal className="w-4 h-4 text-slate-500" />
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Query Model Weights</h3>
                  </div>

                  {/* Model Selector Dropdown */}
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="text-xs font-semibold bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 px-3 py-1.5 rounded-xl outline-none text-slate-700 dark:text-slate-250 cursor-pointer"
                  >
                    <option value="llama-3-8b-instruct">Llama-3-8B-Instruct (Local)</option>
                    <option value="mistral-7b-v0.2">Mistral-7B-v0.2 (Local)</option>
                    <option value="phi-3-mini">Phi-3-Mini (Offline Edge)</option>
                  </select>
                </div>

                {/* Prompt form input */}
                <form onSubmit={runMockInference} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Input Prompt</label>
                    <textarea
                      rows={4}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g. Write a brief Python script to setup a secure FastAPI listener for processing PyTorch inputs..."
                      className="w-full text-xs px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-700 dark:text-slate-250 placeholder:text-slate-400 resize-none font-mono"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading || !prompt.trim()}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-bold transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Running Inference...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Execute Prompt
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Output Panel Console */}
              <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 p-6 font-mono text-xs shadow-md overflow-hidden relative">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  <span>Console Log Outputs</span>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                  </div>
                </div>

                <div className="min-h-[140px] max-h-[300px] overflow-y-auto whitespace-pre-wrap leading-relaxed select-text scrollbar-thin">
                  {loading ? (
                    <div className="flex items-center gap-2 text-slate-400">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Streaming response chunk packages...</span>
                    </div>
                  ) : output ? (
                    output
                  ) : (
                    <span className="text-slate-500">&gt;_ Console idle. Enter a prompt above and execute to monitor diagnostics.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Telemetry Specs & CPU usage */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 rounded-3xl p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-850 dark:text-slate-150 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                  Core Telemetry Metrics
                </h3>

                <div className="space-y-5">
                  {/* Gauge 1 */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-450">
                        <Cpu className="w-4 h-4" />
                        Host CPU Capacity
                      </span>
                      <span className="text-slate-800 dark:text-slate-250">28.4%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900 dark:bg-white rounded-full transition-all duration-500" style={{ width: '28.4%' }}></div>
                    </div>
                  </div>

                  {/* Gauge 2 */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-450">
                        <Layers className="w-4 h-4" />
                        VRAM Allocations (Nodes)
                      </span>
                      <span className="text-slate-800 dark:text-slate-250">72.1%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-700 dark:bg-slate-300 rounded-full transition-all duration-500" style={{ width: '72.1%' }}></div>
                    </div>
                  </div>

                  {/* Gauge 3 */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-450">
                        <HardDrive className="w-4 h-4" />
                        Solid Storage Drive
                      </span>
                      <span className="text-slate-800 dark:text-slate-250">44.6%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900 dark:bg-white rounded-full transition-all duration-500" style={{ width: '44.6%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>Server Node Status</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Operational
                  </span>
                </div>
              </div>

              {/* Tips Sandbox Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-28 h-28 bg-slate-800 rounded-full blur-2xl opacity-40 pointer-events-none" />
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-slate-200" />
                  Offline Node Deployment
                </h4>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  We deploy localized offline containers inside partner educational labs. This allows classroom systems to access local weights without relying on high-speed internet.
                </p>
                <div className="mt-4 pt-4 border-t border-white/10 text-[10px] text-slate-400 font-mono">
                  gateway_version: v2.4.1
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
