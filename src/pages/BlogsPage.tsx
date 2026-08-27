import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, BookOpen, Clock, Calendar, User, Search, Sparkles, Filter } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  img: string;
}

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Production-Grade Retrieval-Augmented Generation (RAG)',
    category: 'Applied AI',
    excerpt: 'An in-depth exploration of state-of-the-art vector embedding pipelines, hybrid searches, and reranking mechanisms to minimize hallucination in enterprise setups.',
    readTime: '8 min read',
    date: 'Aug 24, 2026',
    author: {
      name: 'Aditya Kaudhal',
      role: 'AI & Technology Lead',
      avatar: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403939/IMG-20260720-WA0003.jpg_bjlrkr.jpg'
    },
    img: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '2',
    title: 'The Future of MLOps in Distributed Learning Environments',
    category: 'MLOps',
    excerpt: 'Deploying edge intelligence across school lab setups. How we orchestrate Dockerized PyTorch models with minimal network overhead and standard instrumentation.',
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
    readTime: '5 min read',
    date: 'Aug 12, 2026',
    author: {
      name: 'Girish Gaurav Sharma',
      role: 'Lead Advisor',
      avatar: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403939/IMG-20260730-WA0005.jpg_bgzql0.jpg'
    },
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '4',
    title: 'Practical Fine-Tuning of Small Language Models (SLMs)',
    category: 'Applied AI',
    excerpt: 'Why massive LLMs are not always the answer. A step-by-step breakdown of fine-tuning smaller 3B-7B parameters models on domain-specific datasets with LoRA/QLoRA.',
    readTime: '10 min read',
    date: 'Jul 29, 2026',
    author: {
      name: 'Peeyush',
      role: 'Lead Researcher',
      avatar: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785408576/IMG-20260616-WA0002.jpg_qe7akr.jpg'
    },
    img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '5',
    title: 'Interactive Python Sandboxes for Classroom AI Labs',
    category: 'Web Dev & AI',
    excerpt: 'Behind the engineering of real-time sandboxes. Building secure code playgrounds that execute machine learning models asynchronously without server overload.',
    readTime: '7 min read',
    date: 'Jul 15, 2026',
    author: {
      name: 'Anshu Roy',
      role: 'Software Developer',
      avatar: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785477270/196225806_ufrfe9.jpg'
    },
    img: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '6',
    title: 'The AI Lab Paradigm: Scaling Compute Resources Locally',
    category: 'Hardware',
    excerpt: 'Optimizing local hardware nodes inside public high schools. Setting up small clusters that run offline models efficiently for batch evaluations.',
    readTime: '9 min read',
    date: 'Jun 22, 2026',
    author: {
      name: 'Kushal',
      role: 'Academic Head',
      avatar: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403940/IMG-20250311-WA0007.jpg_vvfqnl.jpg'
    },
    img: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600'
  }
];

const categories = ['All', 'Applied AI', 'MLOps', 'Research', 'Web Dev & AI', 'Hardware'];

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = mockPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-950">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-slate-850 rounded-full blur-3xl opacity-20 pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-slate-200 border border-white/10 uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Member Only Insight Portal
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Unisole AI Labs <br />
                Research Archives & Blog
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                Dive deep into real-world machine learning architectures, MLOps telemetry, lab implementations, and academic innovation guides curated directly by our advisors.
              </p>
            </div>
          </div>
        </section>

        {/* Filter Controls */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Categories Tab Pill List */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Inputs */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search research logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-700 dark:text-slate-250 placeholder:text-slate-400"
            />
          </div>
        </section>

        {/* Grid Blogs Layout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col bg-white dark:bg-slate-900/40 border border-slate-200/55 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group"
                >
                  {/* Aspect Cover Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                    <img
                      src={post.img}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-4 left-4 px-2.5 py-1 text-[9px] font-bold bg-slate-900/90 text-white dark:bg-white/95 dark:text-slate-950 rounded-lg border border-white/10 uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      {/* Meta tags */}
                      <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-350 transition-colors leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Author & Footer CTA */}
                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                      {/* Author Details */}
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">{post.author.name}</span>
                          <span className="text-[9px] text-slate-450 block">{post.author.role}</span>
                        </div>
                      </div>

                      {/* Read More Link */}
                      <span className="text-xs font-bold text-slate-900 dark:text-white inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Read
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900/30 border border-dashed border-slate-250 dark:border-slate-800 rounded-3xl">
              <BookOpen className="w-10 h-10 text-slate-350 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No blog posts found</h3>
              <p className="text-xs text-slate-500 mt-1">Try modifying your search query or choosing another category tag.</p>
            </div>
          )}
        </section>

        {/* Newsletter subscription panel */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-900/30 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-md">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Subscribe to AI Lab Research</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Receive technical alerts, codebase guides, and notifications of open webinars directly in your inbox.</p>
            </div>
            <div className="flex gap-2.5 max-w-sm w-full">
              <input
                type="email"
                placeholder="developer@institute.edu"
                className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-750 placeholder:text-slate-400"
              />
              <button className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-bold text-white transition-colors whitespace-nowrap">
                Sign Up
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
