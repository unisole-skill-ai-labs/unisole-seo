import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import eventsData from '../data/events';
import './EventsPage.css';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDay(dateStr) {
  return new Date(dateStr).getDate();
}

function formatMonth(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short' });
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setEvents(eventsData);
    setLoading(false);
  }, []);

  return (
    <>
      <Navbar />

      <section className="events-page">
        <div className="events-page-header">
          <h1 className="events-page-title">Upcoming Events</h1>
          <p className="events-page-subtitle">
            {loading
              ? 'Loading events...'
              : `${events.length} event${events.length !== 1 ? 's' : ''} announced`}
          </p>
        </div>

        {loading ? (
          <div className="events-empty">
            <p className="events-empty-title">Loading...</p>
          </div>
        ) : error ? (
          <div className="events-empty">
            <p className="events-empty-title">Couldn't load events</p>
            <p className="events-empty-sub">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="events-empty">
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M16 3v4M8 3v4M3 10h18" />
            </svg>
            <p className="events-empty-title">No events announced yet</p>
            <p className="events-empty-sub">Check back soon for upcoming events.</p>
          </div>
        ) : (
          <div className="events-list">
            {events.map((event) => (
              <div className="event-card" key={event._id}>
                <div className="event-date-block">
                  <span className="event-date-day">{formatDay(event.date)}</span>
                  <span className="event-date-month">{formatMonth(event.date)}</span>
                </div>

                {event.banner && (
                  <div className="event-banner-wrap">
                    <img src={event.banner} alt={event.title} className="event-banner-img" />
                  </div>
                )}

                <div className="event-info">
                  <h3 className="event-title">{event.title}</h3>
                  {event.description && (
                    <p className="event-description">{event.description}</p>
                  )}

                  <div className="event-meta">
                    <div className="event-meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="5" width="18" height="16" rx="2" />
                        <path d="M16 3v4M8 3v4M3 10h18" />
                      </svg>
                      <span>{formatDate(event.date)}{event.time ? ` • ${event.time}` : ''}</span>
                    </div>

                    <div className="event-meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{event.location}</span>
                    </div>

                    <div className="event-meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                      </svg>
                      <span>{event.audience}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}