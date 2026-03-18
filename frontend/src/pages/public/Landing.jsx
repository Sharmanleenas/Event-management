import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loader2 } from 'lucide-react';
import api from '../../api/axios';

export const Landing = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fallback mock data if backend not active
        const res = await api.get('/events/public').catch(() => ({
          data: [
            { _id: '1', title: 'Tech Symposium 2026', department: 'CS', amount: 500, description: 'Annual tech fest exploring the newest trends in AI and Software Engineering.' },
            { _id: '2', title: 'Business Conclave', department: 'MBA', amount: 300, description: 'Lead the future with industry giants at our premier management seminar.' }
          ]
        }));
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-opera-plaster">
      {/* Hero Section */}
      <section className="relative bg-opera-indigo text-white py-24 overflow-hidden border-b-8 border-opera-burgundy">
        {/* Geometric Decorative Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-opera-burgundy opacity-20 transform rotate-45 translate-x-32 -translate-y-32 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 border-4 border-opera-brass opacity-20 transform -translate-x-12 translate-y-12 rounded-full"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6">
            Discover Events.<br />Register. Attend.
          </h1>
          <p className="mt-4 text-xl text-opera-linen max-w-2xl mx-auto font-sans font-light tracking-wide">
            The exclusive gateway to premium department events. Secure your spot today.
          </p>
        </div>
      </section>

      {/* Events Listing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-10 pb-4 border-b border-opera-linen">
          <h2 className="text-3xl font-serif font-bold text-opera-indigo">Upcoming Events</h2>
          <Button variant="outline" onClick={() => navigate('/login')}>Staff Portal</Button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-opera-indigo" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <Card key={event._id} hover className="flex flex-col h-full overflow-hidden border-t-2 border-t-opera-brass">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="info">{event.department}</Badge>
                    <span className="text-2xl font-serif font-bold text-opera-burgundy">
                      ₹{event.amount}
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-opera-indigo mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 font-sans mb-6 line-clamp-3 text-sm leading-relaxed">
                    {event.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-opera-linen">
                    <Button 
                      className="w-full" 
                      onClick={() => navigate(`/register/${event._id}`)}
                    >
                      Register Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {events.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500 font-serif text-lg">
                <p>No public events available at the moment.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
