import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Play, 
  Sparkles, 
  Terminal, 
  Activity, 
  RefreshCw, 
  Cpu, 
  Layers, 
  HardDrive, 
  Copy, 
  Check, 
  Zap, 
  Gauge, 
  Server
} from 'lucide-react';

const PRESETS = [
  { label: 'FastAPI MLOps Listener', prompt: 'Write a clean FastAPI endpoint that accepts batch image tensor inputs and returns model inference scores.' },
  { label: 'Explain Backpropagation', prompt: 'Explain the mathematical chain rule behind gradient computation in multi-layer perceptrons in simple terms.' },
  { label: 'Fine-Tuning QLoRA Guide', prompt: 'What are the optimal hyperparameters (lora_r, lora_alpha, target_modules) for fine-tuning Llama-3 on a domain dataset?' },
  { label: 'Campus Lab Topology', prompt: 'How does Unisole design edge compute clusters to run 8B SLMs locally across school networks?' },
];

export default function AiPlaygroundPage() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama-3-8b-instruct');
  const [stats, setStats] = useState({ latency: 138, tokensPerSec: 62, gpuMem: 4.8 });
  const typingTimer = useRef<any>(null);

  const runMockInference = (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const targetPrompt = customPrompt || prompt;
    if (!targetPrompt.trim()) return;

    if (customPrompt) setPrompt(customPrompt);
    setLoading(true);
    setOutput('');

    // Randomize telemetry
    const lat = Math.floor(120 + Math.random() * 40);
    const tps = Math.floor(55 + Math.random() * 20);
    const mem = parseFloat((4.2 + Math.random() * 1.5).toFixed(1));
    setStats({ latency: lat, tokensPerSec: tps, gpuMem: mem });

    const fullResponse = 
`[unisole-core@cluster-node-04:${selectedModel}]
────────────────────────────────────────────────────────────────────
Execution Timestamp: ${new Date().toLocaleTimeString()}
Status: 200 OK | Node: NVIDIA A10G (Air-Gapped)

>>> Input Query: "${targetPrompt}"

>>> Model Response:
--------------------------------------------------------------------
${generateContextualResponse(targetPrompt, selectedModel)}

--------------------------------------------------------------------
📊 Telemetry Matrix:
• First Token Latency : ${lat} ms
• Generation Speed    : ${tps} tokens/sec
• VRAM Allocation     : ${mem} GB / 24.0 GB
• Gateway Session     : verified_unisole_lab_token_9x4b
✓ Sandbox Execution Completed Successfully.`;

    setTimeout(() => {
      setLoading(false);
      let currentIdx = 0;
      clearInterval(typingTimer.current);
      typingTimer.current = setInterval(() => {
        if (currentIdx < fullResponse.length) {
          const step = Math.floor(Math.random() * 6) + 3;
          currentIdx += step;
          setOutput(fullResponse.slice(0, currentIdx));
        } else {
          setOutput(fullResponse);
          clearInterval(typingTimer.current);
        }
      }, 15);
    }, 900);
  };

  useEffect(() => {
    return () => clearInterval(typingTimer.current);
  }, []);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-32 pb-20 space-y-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/70 uppercase tracking-wider shadow-xs">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Interactive Edge Sandbox</span>
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              AI Playground & <span className="gradient-heading">Telemetry</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Test neural network weights, monitor GPU telemetry, and explore simulated edge inference inside school & campus laboratory environments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Columns: Inference Console & Prompt */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Prompt Box Card */}
              <div className="bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Query Local Inference Gateway</h3>
                  </div>

                  {/* Model Selector Dropdown */}
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 px-3 py-1.5 rounded-xl outline-none text-slate-700 dark:text-slate-200 cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="llama-3-8b-instruct">Llama-3-8B-Instruct (Edge Node)</option>
                    <option value="mistral-7b-v0.2">Mistral-7B-v0.2 (Local Cluster)</option>
                    <option value="phi-3-mini">Phi-3-Mini (Offline Air-Gapped)</option>
                  </select>
                </div>

                {/* Preset Suggestions */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">Presets:</span>
                  {PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => runMockInference(undefined, p.prompt)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg whitespace-nowrap transition-colors cursor-pointer flex-shrink-0"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Prompt form */}
                <form onSubmit={runMockInference} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">
                      Input Prompt
                    </label>
                    <textarea
                      rows={3}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Type your question or query here (e.g. How does backpropagation compute gradient descent in deep nets?)..."
                      className="w-full text-xs px-4 py-3 rounded-2xl border border-slate-200/90 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 resize-none font-mono"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {prompt.length} chars
                    </span>

                    <button
                      type="submit"
                      disabled={loading || !prompt.trim()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Streaming Weights...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Execute Sandbox</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Console Window */}
              <div className="bg-slate-950 text-slate-100 rounded-3xl border border-slate-800/80 p-5 sm:p-6 font-mono text-xs shadow-xl overflow-hidden relative">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                    </div>
                    <span className="text-slate-400">tty1 — runtime_telemetry.log</span>
                  </div>

                  {output && (
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-[10px]"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>

                <div className="min-h-[160px] max-h-[340px] overflow-y-auto whitespace-pre-wrap leading-relaxed select-text scrollbar-thin text-slate-300">
                  {loading ? (
                    <div className="flex items-center gap-2.5 text-indigo-400 py-6">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Allocating GPU tensors & streaming response chunks...</span>
                    </div>
                  ) : output ? (
                    output
                  ) : (
                    <span className="text-slate-600 italic block py-4">
                      &gt;_ Gateway idle. Pick a preset above or write a prompt and click "Execute Sandbox" to stream live tokens.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Telemetry Specs & Cluster Hardware */}
            <div className="space-y-6">
              
              {/* Telemetry Gauge Card */}
              <div className="bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-indigo-500" />
                    <span>Real-time Telemetry</span>
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live
                  </span>
                </div>

                {/* Metric 1 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      Token Generation
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">{stats.tokensPerSec} tps</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(stats.tokensPerSec, 100)}%` }}></div>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      GPU VRAM Used
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">{stats.gpuMem} GB / 24 GB</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${(stats.gpuMem / 24) * 100}%` }}></div>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                      Inference Latency
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">{stats.latency} ms</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(stats.latency / 2, 100)}%` }}></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Target Node:</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">node-04.hpc.unisole</span>
                </div>
              </div>

              {/* Edge Lab Architecture info */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden border border-indigo-900/40 space-y-3">
                <h4 className="text-xs sm:text-sm font-bold flex items-center gap-2 text-indigo-300">
                  <Server className="w-4 h-4" />
                  <span>Campus Lab Deployment</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Unisole AI Labs sets up localized containerized environments on institutional campus servers, letting students build MLOps pipelines without recurring cloud billing.
                </p>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Engine: v2.4.1</span>
                  <span>CUDA: 12.4</span>
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

function generateContextualResponse(prompt: string, model: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('fastapi') || p.includes('endpoint')) {
    return `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch

app = FastAPI(title="Unisole Model Inference Gateway")

class InferenceRequest(BaseModel):
    prompt: str
    temperature: float = 0.7
    max_tokens: int = 512

@app.post("/api/v1/generate")
async def generate_response(req: InferenceRequest):
    try:
        # Load weights on dedicated GPU CUDA stream
        inputs = tokenizer(req.prompt, return_tensors="pt").to("cuda")
        with torch.no_grad():
            outputs = model.generate(**inputs, max_new_tokens=req.max_tokens)
        return {"result": tokenizer.decode(outputs[0]), "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))`;
  }

  if (p.includes('backpropagation') || p.includes('gradient')) {
    return `Backpropagation operates on the Multivariate Calculus Chain Rule:

1. Forward Pass: Computes activations z^[l] = W^[l]a^[l-1] + b^[l] and predictions y_hat.
2. Loss Evaluation: Computes cost function L(y, y_hat).
3. Backward Pass: Computes partial derivatives dL/dW = (dL/da) * (da/dz) * (dz/dW).
4. Weight Optimization: Updates parameters via Stochastic Gradient Descent (SGD):
   W := W - alpha * (dL/dW).`;
  }

  return `Analysis generated with ${model}:
1. Architecture considerations: Quantization reduces memory bandwidth bottlenecks from 16-bit to 4-bit NF4 representation.
2. Production integration: Dockerized inference pods coupled with Redis queue streaming provide robust scalability.
3. Next steps: Test batch latency profiles with Prometheus telemetry endpoints.`;
}

