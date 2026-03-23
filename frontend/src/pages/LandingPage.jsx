import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import useFetch from '../utils/useFetch';
import { getPublicEvents } from '../api/eventsApi';
import sliderApi from '../api/sliderApi';
import ImageSlider from '../components/ImageSlider';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';
import '../styles/landing.css';

const LandingPage = () => {
  const { data: events, loading: eventsLoading } = useFetch(getPublicEvents);
  const { data: sliders } = useFetch(() => sliderApi.getAll(true));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map DB slider shape -> ImageSlider shape
  const dynamicSlides = sliders?.length > 0
    ? sliders.map(s => ({ id: s._id, url: s.imageUrl, title: s.title || '', subtitle: '' }))
    : [];

  return (
    <div className="landing-page">
      <div className="background-liquid"></div>
      
      <section className="hero-section">
        <ImageSlider images={dynamicSlides} fullHeight={true} />
      </section>

      <section id="events-section" className="events-section container">
        <h2 className="section-title">Upcoming Events</h2>
        
        {eventsLoading ? (
          <div className="event-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="card skeleton-card">
                <div className="skeleton" style={{ height: '200px' }}></div>
                <div style={{ padding: '1.5rem' }}>
                  <div className="skeleton" style={{ height: '24px', width: '70%', marginBottom: '1rem' }}></div>
                  <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '1rem' }}></div>
                  <div className="skeleton" style={{ height: '60px', width: '100%' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="event-grid">
            {events.map(event => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No upcoming events at the moment. Check back later!</p>
          </div>
        )}
      </section>

      <section id="contact-section" className="contact-section container">
        <div className="contact-card card glass-card">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Have questions? Our team is here to help you excellence.</p>
            <div className="contact-details">
              <div className="detail-item">📍 Tiruchengode, Tamil Nadu</div>
              <div className="detail-item">📧 shc_events@college.edu</div>
            </div>
          </div>
          <form className="contact-form" onSubmit={async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
              await axiosInstance.post('/api/contacts/submit', data);
              toast.success("Message sent! Your query is received by our team.");
              e.target.reset();
            } catch (error) {
              toast.error(error.response?.data?.message || "Failed to send message");
            } finally {
              setIsSubmitting(false);
            }
          }}>
            <input type="text" name="name" placeholder="Your Name" required />
            <input type="email" name="email" placeholder="Your Email" required />
            <textarea name="message" placeholder="How can we help?" required></textarea>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      <footer className="college-footer">
        <div className="container">
          <p>&copy; 2026 Sacred Heart College. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
