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
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-32 pb-20 space-y-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-2xl mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Edge Compute Simulation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
              Inference Sandbox & <br />
              <span className="text-zinc-500 dark:text-zinc-400">Telemetry Console</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg leading-relaxed">
              Test neural network weights, monitor GPU metrics, and simulate edge node inference configured for campus laboratory environments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Inference Console & Prompt */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Prompt Box Card */}
              <div className="minimal-card p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 gap-2.5">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Query Gateway Node</h3>
                  </div>

                  {/* Model Selector Dropdown */}
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="text-xs font-medium bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 px-2.5 py-1 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 cursor-pointer"
                  >
                    <option value="llama-3-8b-instruct">Llama-3-8B-Instruct (Edge Node)</option>
                    <option value="mistral-7b-v0.2">Mistral-7B-v0.2 (Local Cluster)</option>
                    <option value="phi-3-mini">Phi-3-Mini (Offline Air-Gapped)</option>
                  </select>
                </div>

                {/* Preset Suggestions */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 flex-shrink-0">Presets:</span>
                  {PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => runMockInference(undefined, p.prompt)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-zinc-100 hover:bg-zinc-200/70 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md whitespace-nowrap transition-colors cursor-pointer flex-shrink-0"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Prompt form */}
                <form onSubmit={runMockInference} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                      Input Prompt
                    </label>
                    <textarea
                      rows={3}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Type your question or query here (e.g. Write a clean FastAPI endpoint for model inference)..."
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 focus:outline-none focus:border-zinc-400 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 resize-none font-mono"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {prompt.length} chars
                    </span>

                    <button
                      type="submit"
                      disabled={loading || !prompt.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 text-white text-xs font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Streaming...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Execute</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Console Window */}
              <div className="bg-zinc-950 text-zinc-100 rounded-xl border border-zinc-850 p-4 sm:p-5 font-mono text-xs shadow-minimal overflow-hidden relative">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-3 text-[10px] uppercase font-mono text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-zinc-400">tty1 — telemetry.log</span>
                  </div>

                  {output && (
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer text-[10px]"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>

                <div className="min-h-[160px] max-h-[340px] overflow-y-auto whitespace-pre-wrap leading-relaxed select-text scrollbar-thin text-zinc-300 text-xs">
                  {loading ? (
                    <div className="flex items-center gap-2 text-zinc-400 py-6">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Streaming response chunks...</span>
                    </div>
                  ) : output ? (
                    output
                  ) : (
                    <span className="text-zinc-600 italic block py-4">
                      &gt;_ Gateway idle. Pick a preset above or write a prompt and click "Execute" to stream tokens.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Telemetry Specs & Cluster Hardware */}
            <div className="space-y-4">
              
              {/* Telemetry Gauge Card */}
              <div className="minimal-card p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Real-time Telemetry</span>
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-600 dark:text-emerald-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Live
                  </span>
                </div>

                {/* Metric 1 */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                      Token Generation
                    </span>
                    <span className="font-mono text-zinc-900 dark:text-white font-bold">{stats.tokensPerSec} tps</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-300" style={{ width: `${Math.min(stats.tokensPerSec, 100)}%` }}></div>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                      GPU VRAM Allocation
                    </span>
                    <span className="font-mono text-zinc-900 dark:text-white font-bold">{stats.gpuMem} / 24 GB</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-300" style={{ width: `${(stats.gpuMem / 24) * 100}%` }}></div>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                      Inference Latency
                    </span>
                    <span className="font-mono text-zinc-900 dark:text-white font-bold">{stats.latency} ms</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-300" style={{ width: `${Math.min(stats.latency / 2, 100)}%` }}></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                  <span>Target:</span>
                  <span className="text-zinc-700 dark:text-zinc-300">node-04.hpc.unisole</span>
                </div>
              </div>

              {/* Edge Lab Architecture info */}
              <div className="minimal-card p-5 space-y-2.5">
                <h4 className="text-xs font-bold flex items-center gap-1.5 text-zinc-900 dark:text-white">
                  <Server className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Campus Lab Deployment</span>
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Unisole AI Labs sets up localized containerized environments on institutional campus servers, letting students build MLOps pipelines without recurring cloud billing.
                </p>
                <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
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

