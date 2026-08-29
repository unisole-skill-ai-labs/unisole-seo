import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, BookOpen, Clock, Calendar, Search, Sparkles, X, Share2, BookmarkCheck } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  fullContent?: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    org?: string;
  };
  img: string;
}

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Production-Grade Retrieval-Augmented Generation (RAG)',
    category: 'Applied AI',
    excerpt: 'An in-depth exploration of state-of-the-art vector embedding pipelines, hybrid searches, and reranking mechanisms to minimize hallucination in enterprise setups.',
    fullContent: `
      <h3>Introduction to Hybrid Vector Search</h3>
      <p>Modern RAG pipelines require more than naive cosine similarity on Dense embeddings. When implementing semantic search inside university systems, domain vocabularies (e.g. course codes, faculty designations) require sparse BM25 indexing paired with dense sentence transformers.</p>
      
      <h3>Vector Database Topologies</h3>
      <p>We evaluate pgvector on PostgreSQL vs dedicated vector stores like Qdrant and Pinecone. For campus labs with air-gapped compute, local pgvector with HNSW indexing delivers sub-50ms query latencies on 500,000 document chunks.</p>
      
      <h3>Reranking with Cross-Encoders</h3>
      <p>Passing top-20 candidate documents through a bge-reranker-large model improves retrieval precision by over 34%, eliminating context distraction for smaller language models like Llama-3-8B.</p>
    `,
    readTime: '8 min read',
    date: 'Aug 24, 2026',
    author: {
      name: 'Aditya Kaudhal',
      role: 'AI & Technology Lead',
      avatar: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403939/IMG-20260720-WA0003.jpg_bjlrkr.jpg',
      org: 'IIT Delhi'
    },
    img: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '2',
    title: 'The Future of MLOps in Distributed Learning Environments',
    category: 'MLOps',
    excerpt: 'Deploying edge intelligence across school lab setups. How we orchestrate Dockerized PyTorch models with minimal network overhead and standard instrumentation.',
    fullContent: `
      <h3>Edge Orchestration in High Schools</h3>
      <p>School computer labs often experience erratic bandwidth. By packaging PyTorch runtime environments inside slim Alpine Docker containers with pre-cached ONNX weights, offline lab sessions execute without cloud dependency.</p>
      
      <h3>Model Registry & Telemetry</h3>
      <p>We use lightweight FastAPI listeners that log inference throughput, token latency, and GPU VRAM consumption to a central Prometheus dashboard, letting teachers monitor student workloads in real-time.</p>
    `,
    readTime: '6 min read',
    date: 'Aug 18, 2026',
    author: {
      name: 'Divyank',
      role: 'Tech Lead',
      avatar: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785404022/WhatsApp_Image_2026-07-30_at_3.03.01_PM_rheqln.jpg'
    },
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '3',
    title: 'Introducing Sustainable AI Frameworks in Higher Education',
    category: 'Research',
    excerpt: 'Aligning college projects with actual industrial application. A review of academic pathways designed to introduce practical machine learning skills to undergraduates.',
    fullContent: `
      <h3>From Toy Datasets to Real Pipelines</h3>
      <p>Undergraduate projects frequently stall at the Jupyter Notebook stage. Our structured curriculum transitions students to building modular Python packages with automated CI/CD testing on GitHub Actions.</p>
    `,
    readTime: '5 min read',
    date: 'Aug 12, 2026',
    author: {
      name: 'Girish Gaurav Sharma',
      role: 'Lead Advisor – Research',
      avatar: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403939/IMG-20260730-WA0005.jpg_bgzql0.jpg',
      org: 'NIT Hamirpur'
    },
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '4',
    title: 'Practical Fine-Tuning of Small Language Models (SLMs)',
    category: 'Applied AI',
    excerpt: 'Why massive LLMs are not always the answer. A step-by-step breakdown of fine-tuning smaller 3B-7B parameter models on domain-specific datasets with LoRA/QLoRA.',
    fullContent: `
      <h3>Efficiency of Quantized Low-Rank Adaptation (QLoRA)</h3>
      <p>4-bit NormalFloat (NF4) quantization allows fine-tuning 8B parameter models on single consumer GPUs (RTX 4090 / A10G) without catastrophic forgetting.</p>
    `,
    readTime: '10 min read',
    date: 'Jul 29, 2026',
    author: {
      name: 'Peeyush',
      role: 'Lead Researcher',
      avatar: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785408576/IMG-20260616-WA0002.jpg_qe7akr.jpg',
      org: 'NIT Hamirpur'
    },
    img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '5',
    title: 'Interactive Python Environments for Classroom AI Labs',
    category: 'Web Dev & AI',
    excerpt: 'Behind the engineering of real-time browser runtimes. Building secure client-side code environments that execute machine learning models asynchronously without server overload.',
    fullContent: `
      <h3>Client-Side Execution with WebAssembly & Pyodide</h3>
      <p>Running NumPy and Scikit-Learn directly within client browsers via WebAssembly eliminates backend server costs while providing immediate student feedback.</p>
    `,
    readTime: '7 min read',
    date: 'Jul 15, 2026',
    author: {
      name: 'Anshu Roy',
      role: 'Software Developer',
      avatar: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785477270/196225806_ufrfe9.jpg',
      org: 'NIT Hamirpur'
    },
    img: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '6',
    title: 'The AI Lab Paradigm: Scaling Compute Resources Locally',
    category: 'Hardware',
    excerpt: 'Optimizing local hardware nodes inside public high schools. Setting up small clusters that run offline models efficiently for batch evaluations.',
    fullContent: `
      <h3>Local Hardware Architectures</h3>
      <p>How we design resilient hardware nodes with thermal throttling management and offline model caches for continuous classroom uptime.</p>
    `,
    readTime: '9 min read',
    date: 'Jun 22, 2026',
    author: {
      name: 'Kushal',
      role: 'Academic Head',
      avatar: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403940/IMG-20250311-WA0007.jpg_vvfqnl.jpg',
      org: 'IIT Patna'
    },
    img: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600'
  }
];

const categories = ['All', 'Applied AI', 'MLOps', 'Research', 'Web Dev & AI', 'Hardware'];

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);

  const filteredPosts = mockPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-32 pb-20 space-y-10">
        
        {/* Header Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Research & Publications</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-zinc-900 dark:text-white">
              Technical Guides & <br />
              <span className="text-zinc-500 dark:text-zinc-400">
                Applied AI Research
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
              Articles and architectural blueprints written by engineers and faculty advisors from IIT Delhi, NIT Hamirpur, and IIT Patna.
            </p>
          </div>
        </section>

        {/* Filter Controls */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Categories Tab Pill List */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                    : 'bg-zinc-100 hover:bg-zinc-200/70 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Inputs */}
          <div className="relative min-w-[240px] md:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-zinc-400 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
            />
          </div>
        </section>

        {/* Grid Blogs Layout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="minimal-card flex flex-col justify-between overflow-hidden group cursor-pointer"
                  onClick={() => setReadingPost(post)}
                >

                  {/* Aspect Cover Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                    <img
                      src={post.img}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-3.5 left-3.5 px-2.5 py-1 text-[9px] font-bold bg-slate-950/80 text-white rounded-lg backdrop-blur-md border border-white/10 uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                    <div>
                      {/* Meta tags */}
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-indigo-500" />
                          {post.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-500" />
                          {post.readTime}
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Author & Footer CTA */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      {/* Author Details */}
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">{post.author.name}</span>
                          <span className="text-[10px] text-slate-400 block">{post.author.org || post.author.role}</span>
                        </div>
                      </div>

                      {/* Read More Link */}
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900/30 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">No research logs found</h3>
              <p className="text-xs text-slate-500">Try searching another term or switching categories.</p>
            </div>
          )}
        </section>

      </main>

      {/* Reader Modal */}
      {readingPost && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setReadingPost(null)}
        >
          <div 
            className="relative w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white backdrop-blur-md cursor-pointer transition-colors"
              onClick={() => setReadingPost(null)}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header image */}
            <div className="relative h-48 sm:h-56 w-full flex-shrink-0 bg-slate-950 overflow-hidden">
              <img
                src={readingPost.img}
                alt={readingPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">{readingPost.category}</span>
                <h2 className="text-xl sm:text-2xl font-black leading-tight">{readingPost.title}</h2>
              </div>
            </div>

            {/* Body */}
            <div className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={readingPost.author.avatar}
                  alt={readingPost.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{readingPost.author.name}</h4>
                  <p className="text-[11px] text-slate-400">{readingPost.author.role} {readingPost.author.org ? `• ${readingPost.author.org}` : ''} • {readingPost.readTime}</p>
                </div>
              </div>

              <div 
                dangerouslySetInnerHTML={{ __html: readingPost.fullContent || `<p>${readingPost.excerpt}</p>` }}
                className="prose dark:prose-invert prose-indigo max-w-none prose-h3:text-sm sm:prose-h3:text-base prose-h3:font-black prose-p:my-2"
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

