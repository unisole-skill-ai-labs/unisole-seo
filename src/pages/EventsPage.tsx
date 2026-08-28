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
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-20 space-y-10 flex-grow w-full">
        {/* Header */}
        <header className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Campus Meetups & Seminars</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-zinc-900 dark:text-white">
            Upcoming AI Seminars & <br />
            <span className="text-zinc-500 dark:text-zinc-400">
              Campus Showcases
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
            Connect with our researchers and mentors across colleges and schools for hands-on ML workshops and laboratory inaugurations.
          </p>

          {/* Search bar */}
          <div className="pt-2 max-w-md flex items-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-1">
            <Search className="w-3.5 h-3.5 text-zinc-400 ml-2.5 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, topics, or colleges..."
              className="bg-transparent text-xs text-zinc-900 dark:text-white px-2.5 py-1.5 outline-none w-full placeholder:text-zinc-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-white px-2 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </header>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          </div>
        ) : error ? (
          <div className="text-center py-16 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 p-6 max-w-md mx-auto space-y-2">
            <p className="text-sm font-bold text-zinc-800 dark:text-white">Couldn't load events</p>
            <p className="text-xs text-zinc-500">{error}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 p-8 max-w-md mx-auto space-y-3">
            <Calendar className="w-8 h-8 text-zinc-400 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">No matching events found</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {searchQuery ? `No results for "${searchQuery}".` : 'Check back soon for upcoming seminars and workshops.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredEvents.map((event) => (
              <div 
                className="minimal-card overflow-hidden flex flex-col justify-between group"
                key={event._id}
              >
                
                {/* Event Image Banner */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-850">
                  {event.banner ? (
                    <img
                      src={getOptimizedImageUrl(event.banner, { width: 500 })}
                      alt={event.title}
                      className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-300"
                      width="360"
                      height="200"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-400">
                      <Calendar className="w-8 h-8" />
                    </div>
                  )}

                  {/* Left Date Ribbon */}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-zinc-950/80 backdrop-blur-xs text-white rounded-md flex flex-col items-center justify-center min-w-[48px] border border-white/10">
                    <span className="text-sm font-bold tracking-tight leading-none text-white">{formatDay(event.date)}</span>
                    <span className="text-[9px] font-mono uppercase tracking-wider mt-0.5 text-zinc-400">{formatMonth(event.date)}</span>
                  </div>
                </div>

                {/* Event info details */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>

                  {/* Event Meta rows */}
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                      <span>{formatDate(event.date)}{event.time ? ` • ${event.time}` : ''}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
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