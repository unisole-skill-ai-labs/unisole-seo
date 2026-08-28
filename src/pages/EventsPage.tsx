import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import eventsData from '../data/events';
import { getOptimizedImageUrl } from '../utils/image';
import { Calendar, MapPin, Users, Loader2, Sparkles, Search, ArrowRight, ExternalLink } from 'lucide-react';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDay(dateStr: string) {
  return new Date(dateStr).getDate();
}

function formatMonth(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short' });
}

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setEvents(eventsData);
    setLoading(false);
  }, []);

  const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'workshops', label: 'Workshops & Hackathons' },
    { id: 'seminars', label: 'Guest Lectures & Talks' },
    { id: 'labs', label: 'Campus AI Showcases' },
  ];

  const filteredEvents = events.filter((e) => {
    const matchesSearch = e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-20 space-y-12">
        {/* Header */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200/70 dark:border-indigo-800/70 uppercase tracking-wider shadow-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>Campus Community & Seminars</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Upcoming & Past <span className="gradient-heading">Events</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Hands-on AI workshops, teacher training symposiums, and research seminars hosted across partner colleges and schools.
          </p>

          {/* Search bar & filter pills */}
          <div className="pt-4 max-w-md mx-auto flex items-center bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-1.5 shadow-xs focus-within:border-indigo-500 transition-colors">
            <Search className="w-4 h-4 text-slate-400 ml-2.5 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event title, topic, or college..."
              className="bg-transparent text-xs text-slate-900 dark:text-white px-3 py-2 outline-none w-full placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-white px-2 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </header>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <div className="text-center py-16 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/40 p-8 max-w-md mx-auto space-y-3">
            <p className="text-base font-bold text-slate-800 dark:text-white">Couldn't load events</p>
            <p className="text-xs text-slate-500">{error}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 border border-slate-200/80 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/30 p-12 max-w-md mx-auto space-y-4">
            <Calendar className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No matching events found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {searchQuery ? `No results for "${searchQuery}".` : 'Check back soon for upcoming seminars, lab showcases, and workshops.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div 
                className="bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-card-hover dark:hover:shadow-dark-card-hover hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all duration-300 flex flex-col justify-between hover-lift group"
                key={event._id}
              >
                
                {/* Event Image Banner */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/80">
                  {event.banner ? (
                    <img
                      src={getOptimizedImageUrl(event.banner, { width: 500 })}
                      alt={event.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      width="360"
                      height="200"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400">
                      <Calendar className="w-10 h-10" />
                    </div>
                  )}

                  {/* Left Date Ribbon */}
                  <div className="absolute top-4 left-4 p-2 bg-slate-950/85 backdrop-blur-md text-white rounded-2xl flex flex-col items-center justify-center min-w-[54px] shadow-lg border border-white/10">
                    <span className="text-base font-black tracking-tight leading-none text-indigo-400">{formatDay(event.date)}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-1">{formatMonth(event.date)}</span>
                  </div>
                </div>

                {/* Event info details */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>

                  {/* Event Meta rows */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-350">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span>{formatDate(event.date)}{event.time ? ` • ${event.time}` : ''}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span className="line-clamp-1">{event.audience}</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}