import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import EventCard from '../../components/iqac/EventCard';
import IQACForm from '../../components/iqac/IQACForm';
import ReportPreview from '../../components/iqac/ReportPreview';
import EditPanel from '../../components/iqac/EditPanel';
import ExportButton from '../../components/iqac/ExportButton';
import HeroHeader from '../../components/iqac/HeroHeader';
import StatsCards from '../../components/iqac/StatsCards';
import SearchBar from '../../components/iqac/SearchBar';
import '../../styles/dashboard.css';
import '../../styles/iqac_dashboard.css';

const IQACReport = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [headerData, setHeaderData] = useState(null);
  const [view, setView] = useState('selection'); // selection, split
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery, deptFilter]);

  const fetchEvents = async () => {
    try {
      const { data } = await axiosInstance.get('/api/events/my-events');
      setEvents(data);
    } catch (err) {
      toast.error('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events.filter(ev => 
      ev.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (deptFilter !== 'All') {
      filtered = filtered.filter(ev => ev.department === deptFilter);
    }

    setFilteredEvents(filtered);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setView('split');
  };

  const handleReportGenerated = (report, meta) => {
    setGeneratedReport(report);
    setHeaderData(meta);
  };

  // Derived stats
  const totalEventsCount = events.length;
  const reportsGeneratedCount = events.filter(e => e.iqacStatus === 'Completed' || e.isReportGenerated).length;
  const pendingReportsCount = totalEventsCount - reportsGeneratedCount;

  if (loading) return <Loader />;

  if (view === 'selection') {
    return (
      <div className="iqac-dashboard-container">
        <HeroHeader />
        
        <StatsCards 
          totalEvents={totalEventsCount} 
          reportsGenerated={reportsGeneratedCount} 
          pendingReports={pendingReportsCount} 
        />

        <SearchBar 
          onSearch={setSearchQuery} 
          onFilter={setDeptFilter} 
          selectedDept={deptFilter} 
        />

        {filteredEvents.length > 0 ? (
          <div className="event-grid-new">
            {filteredEvents.map(event => (
              <EventCard 
                key={event._id} 
                event={event} 
                onClick={() => handleSelectEvent(event)} 
              />
            ))}
          </div>
        ) : (
          <div className="empty-state-container anim-fade-in-up">
            <div className="empty-illustration">📅</div>
            <h3>No events available</h3>
            <p>We couldn't find any events matching your criteria. Try adjusting your search or filters.</p>
            <button className="btn-generate-premium" onClick={() => {
              setSearchQuery('');
              setDeptFilter('All');
            }}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    );
  }

  if (generatedReport) {
    return (
      <div className="refinement-stage-layout anim-fade-in">
        <div className="iqac-top-bar" style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 1000 }}>
            <button className="btn-back" onClick={() => setGeneratedReport(null)}>← Back to Editor</button>
        </div>

        <div className="report-scroll-column">
             <ReportPreview 
                report={generatedReport} 
                headerData={headerData || selectedEvent} 
            />
        </div>

        <div className="refinement-sticky-sidebar">
            <EditPanel 
                report={generatedReport} 
                onUpdate={setGeneratedReport} 
            />
            <div style={{ marginTop: '1.5rem' }}>
                <ExportButton 
                    report={generatedReport} 
                    headerData={headerData || selectedEvent} 
                />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="iqac-editor-container anim-fade-in">
        <div className="iqac-top-bar" style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 1000 }}>
            <button className="btn-back" onClick={() => setView('selection')}>← Back to Events</button>
        </div>

        {/* Left Side: Editor */}
        <IQACForm 
            selectedEvent={selectedEvent} 
            onGenerate={handleReportGenerated} 
        />
        
        {/* Right Side: Live Preview */}
        <div className="live-preview-panel">
            <div className="preview-scroll-wrapper" style={{ width: '100%' }}>
                <ReportPreview 
                    report={generatedReport} 
                    headerData={headerData || selectedEvent} 
                />
            </div>
        </div>
    </div>
  );
};

export default IQACReport;
