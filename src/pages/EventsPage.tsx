import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import eventsData from '../data/events';
import { getOptimizedImageUrl } from '../utils/image';
import { Calendar, MapPin, Users, Loader2 } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEvents(eventsData);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-12">
        {/* Header */}
        <header className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 uppercase tracking-wider">
            📅 Community Meetups
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Upcoming & Past Events
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {loading
              ? 'Loading active events list...'
              : `${events.length} event${events.length !== 1 ? 's' : ''} scheduled`}
          </p>
        </header>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-455" />
          </div>
        ) : error ? (
          <div className="text-center py-16 border border-slate-200/60 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/30 p-8 max-w-md mx-auto space-y-3">
            <p className="text-base font-bold text-slate-800 dark:text-white">Couldn't load events</p>
            <p className="text-xs text-slate-500">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 border border-slate-200/60 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/30 p-12 max-w-md mx-auto space-y-4">
            <Calendar className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No events announced yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Check back soon for upcoming seminars, lab showcases, and workshops.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div 
                className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
                key={event._id}
              >
                
                {/* Event Image Banner */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/60">
                  {event.banner ? (
                    <img
                      src={getOptimizedImageUrl(event.banner, { width: 500 })}
                      alt={event.title}
                      className="h-full w-full object-cover"
                      width="360"
                      height="200"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400">
                      <Calendar className="w-10 h-10" />
                    </div>
                  )}

                  {/* Left Date Ribbon overlay */}
                  <div className="absolute top-4 left-4 p-2 bg-indigo-600 text-white rounded-xl flex flex-col items-center justify-center min-w-[50px] shadow-md shadow-indigo-600/10">
                    <span className="text-base font-black tracking-tight leading-none">{formatDay(event.date)}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-1">{formatMonth(event.date)}</span>
                  </div>
                </div>

                {/* Event info details */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>

                  {/* Event Meta rows */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-2.5 text-xs text-slate-600 dark:text-slate-450">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(event.date)}{event.time ? ` • ${event.time}` : ''}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.audience}</span>
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