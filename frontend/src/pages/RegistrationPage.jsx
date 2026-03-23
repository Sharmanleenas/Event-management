import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import { getEventDetails } from '../api/eventsApi';
import { registerParticipant, uploadPaymentScreenshot } from '../api/participantsApi';
import CollegeTypeToggle from '../components/CollegeTypeToggle';
import Loader from '../components/Loader';
import '../styles/registration.css';

const RegistrationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [participantId, setParticipantId] = useState(null);
  const [mongoId, setMongoId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    department: '',
    email: '',
    phone: '',
    collegeType: 'internal',
    collegeName: '',
    selectedGames: [],
    screenshot: null
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventDetails(id);
        setEvent(data);
      } catch (err) {
        toast.error('Failed to load event details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Auto-detect internal students via email domain
  const isAutoDetectedInternal = formData.email.toLowerCase().endsWith('@shctpt.edu');

  useEffect(() => {
    if (isAutoDetectedInternal && formData.collegeType !== 'internal') {
      setFormData(prev => ({ ...prev, collegeType: 'internal' }));
    }
  }, [isAutoDetectedInternal]);

  // Computed price from event data
  const computedPrice = formData.collegeType === 'internal'
    ? (event?.internalPrice || 0)
    : (event?.externalPrice || 0);

  const toggleGame = (gameName) => {
    setFormData(prev => {
      const selected = prev.selectedGames.includes(gameName)
        ? prev.selectedGames.filter(g => g !== gameName)
        : [...prev.selectedGames, gameName];
      
      if (selected.length > (event?.maxGamesPerParticipant || 3)) {
        toast.warning(`You can only select up to ${event.maxGamesPerParticipant} games`);
        return prev;
      }
      return { ...prev, selectedGames: selected };
    });
  };

  const handleCollegeTypeChange = (type) => {
    setFormData(prev => ({ ...prev, collegeType: type }));
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!formData.name || !formData.department || !formData.email || !formData.phone) {
        return toast.error('Please fill all required fields');
      }
      if (formData.collegeType === 'internal' && !formData.rollNo) {
        return toast.error('Roll Number is required for internal students');
      }
      if (formData.collegeType === 'external' && !formData.collegeName) {
        return toast.error('College Name is required for external students');
      }
      setStep(2);
    } else if (step === 2) {
      if (formData.selectedGames.length === 0) {
        return toast.error('Please select at least one game');
      }
      setSubmitting(true);
      try {
        const response = await registerParticipant({
          eventId: id,
          name: formData.name,
          registerNumber: formData.rollNo?.toUpperCase() || '',
          department: formData.department,
          email: formData.email,
          phone: formData.phone,
          collegeType: isAutoDetectedInternal ? 'internal' : formData.collegeType,
          college: formData.collegeType === 'external' ? formData.collegeName : 'Sacred Heart College',
          selectedGames: formData.selectedGames
        });
        setParticipantId(response.participantId);
        setMongoId(response._id);
        setStep(3);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Registration failed');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const onDrop = (acceptedFiles) => {
    setFormData(prev => ({ ...prev, screenshot: acceptedFiles[0] }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    multiple: false
  });

  const handleSubmitFinal = async () => {
    if (!formData.screenshot) return toast.error('Please upload payment proof');
    setSubmitting(true);
    try {
      await uploadPaymentScreenshot(mongoId, formData.screenshot);
      setStep(4);
      toast.success('Registration and payment submitted successfully!');
    } catch (err) {
      toast.error('Failed to upload screenshot');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (!event) {
    return (
      <div className="container text-center" style={{ padding: '100px 20px' }}>
        <h2 style={{ color: 'var(--brass)', marginBottom: '20px' }}>Event Not Found</h2>
        <p style={{ color: '#888', marginBottom: '30px' }}>The registration link may be invalid or the event has been removed.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Return to Events</button>
      </div>
    );
  }

  return (
    <div className="registration-page container">
      <div className="registration-container card">
        <div className="progress-stepper">
          {[1, 2, 3].map(i => (
            <div key={i} className={`step-circle ${step >= i ? 'active' : ''} ${step > i ? 'complete' : ''}`}>
              {step > i ? '✓' : i}
              <span className="step-label">{i === 1 ? 'Details' : i === 2 ? 'Games' : 'Payment'}</span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="form-step">
            {/* Section Header with Toggle */}
            <div className="step-header-row">
              <h2>Participant Details</h2>
              <CollegeTypeToggle
                value={formData.collegeType}
                onChange={handleCollegeTypeChange}
                isAutoDetected={isAutoDetectedInternal}
                internalPrice={event?.internalPrice || 0}
                externalPrice={event?.externalPrice || 0}
              />
            </div>

            <div className="registration-form">
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="As per college records" />
              </div>

              {/* Roll Number — required for internal, optional for external */}
              {formData.collegeType === 'internal' && (
                <div className="form-group cond-field-enter">
                  <label>Roll Number <span className="required-dot">*</span></label>
                  <input name="rollNo" value={formData.rollNo} onChange={handleChange} placeholder="e.g. 21UCO001" style={{ textTransform: 'uppercase' }} required />
                </div>
              )}

              {/* College Name — required for external */}
              {formData.collegeType === 'external' && !isAutoDetectedInternal && (
                <div className="form-group cond-field-enter">
                  <label>College Name <span className="required-dot">*</span></label>
                  <input name="collegeName" value={formData.collegeName} onChange={handleChange} placeholder="Enter your college name" required />
                </div>
              )}

              <div className="form-group">
                <label>Department</label>
                <select name="department" value={formData.department} onChange={handleChange}>
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Commerce">Commerce</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="college-id@shctpt.edu" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit number" />
                </div>
              </div>

              {/* Fee Display */}
              <div className="fee-display-bar">
                <span>Registration Fee:</span>
                <strong>₹{computedPrice}</strong>
                {formData.collegeType === 'internal' && event?.externalPrice > event?.internalPrice && (
                  <span className="discount-badge">Discount Applied 🎉</span>
                )}
                {formData.collegeType === 'external' && (
                  <span className="standard-badge">Standard Fee</span>
                )}
              </div>
              <p className="fee-warning">⚠️ Amount is auto-calculated and cannot be changed.</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h2>Select Games</h2>
            <p className="step-desc">Pick up to {event?.maxGamesPerParticipant || 3} events you want to participate in.</p>
            <div className="games-grid">
              {event?.games?.length > 0 ? (
                event.games.map((game, i) => (
                  <div 
                    key={i} 
                    className={`game-selection-card ${formData.selectedGames.includes(game.name) ? 'selected' : ''}`}
                    onClick={() => toggleGame(game.name)}
                  >
                    <div className="game-check"></div>
                    <h4>{game.name}</h4>
                    <p className="game-cat badge badge-brass">{game.category}</p>
                    <div className="game-slots-remaining">
                      Slots: {(game.participantLimit || 0) - (game.currentRegistrations || 0)} left
                    </div>
                  </div>
                ))
              ) : (
                <p>No games registered for this event yet.</p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h2>Payment Verification</h2>

            {/* College Type Badge */}
            <div className="payment-type-badge" style={{ textAlign: 'center', marginBottom: '1rem' }}>
              {formData.collegeType === 'internal' ? (
                <span className="badge badge-success" style={{ fontSize: '0.9rem', padding: '6px 16px' }}>🎉 Internal Student — Discount Applied</span>
              ) : (
                <span className="badge badge-brass" style={{ fontSize: '0.9rem', padding: '6px 16px' }}>Standard Fee — External Student</span>
              )}
            </div>

            <div className="payment-layout">
              <div className="qr-section">
                <QRCodeSVG 
                  value={`upi://pay?pa=${event?.upiId || 'shc@upi'}&pn=SHCEvent&am=${computedPrice}&cu=INR`} 
                  size={200}
                />
                <p className="upi-id">{event?.upiId || 'shc@upi'}</p>
                <p className="payment-amount">Pay: ₹{computedPrice}</p>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Scan QR with any UPI app to pay</p>
              </div>
              
              <div className="upload-section">
                <h3>Upload Screenshot</h3>
                <div {...getRootProps()} className="dropzone">
                  <input {...getInputProps()} />
                  {formData.screenshot ? (
                    <div className="preview">
                      <p>File: {formData.screenshot.name}</p>
                      <button className="change-btn">Change File</button>
                    </div>
                  ) : (
                    <p>Drag & drop screenshot here, or click to select</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="success-step">
            <div className="success-icon">🏆</div>
            <h2>Registration Successful!</h2>
            <p>Your registration is pending payment verification by the Event Leader.</p>
            <div className="id-box monospace">
              PARTICIPANT ID: {participantId}
            </div>
            <button className="btn-primary" onClick={() => navigate('/')}>Return Home</button>
          </div>
        )}

        {step < 4 && (
          <div className="registration-footer">
            {step > 1 && step < 3 && <button onClick={() => setStep(step - 1)} className="btn-secondary">Back</button>}
            <button 
              onClick={step === 3 ? handleSubmitFinal : handleNext} 
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Processing...' : step === 3 ? 'Complete Registration' : 'Next Step →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationPage;
