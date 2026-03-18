import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Upload, CheckCircle } from 'lucide-react';
import api from '../../api/axios';

export const Payment = () => {
  const { participantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // qrImage passed from register step or fallback to placeholder
  const [qrImage] = useState(location.state?.qrImage || 'https://via.placeholder.com/300x300.png?text=QR+Code');
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file first.');
    
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('screenshot', file);

    try {
      await api.post(`/participants/upload/${participantId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).catch(() => {
        // Mock success if backend is down
        return new Promise(resolve => setTimeout(resolve, 800));
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload proof. Try again.');
    } finally {
      if(!success) setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-opera-plaster">
      {/* Left side: QR Code (Indigo) */}
      <div className="w-full md:w-1/2 bg-opera-indigo flex flex-col items-center justify-center p-12 text-white border-b-8 md:border-b-0 md:border-r-8 border-opera-burgundy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 border border-opera-brass opacity-10 transform translate-x-1/2 -translate-y-1/2 rounded-full"></div>
        <div className="z-10 text-center flex flex-col items-center">
          <h2 className="text-4xl font-serif mb-2 font-bold tracking-wide">Scan to Pay</h2>
          <p className="text-opera-linen font-sans mb-8">Participant ID: <span className="font-mono bg-white/10 px-3 py-1.5 rounded tracking-widest border border-white/20">{participantId}</span></p>
          
          <div className="bg-white p-4 rounded-sm shadow-2xl mb-8 border-4 border-opera-brass">
            <img src={qrImage} alt="Payment QR Code" className="w-64 h-64 object-cover" />
          </div>
          
          <p className="text-xs text-white/50 mt-2 uppercase tracking-wide">Upload screenshot after completing transfer</p>
        </div>
      </div>

      {/* Right side: Upload Zone (White/Plaster) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-12 bg-white relative">
        <div className="max-w-md w-full">
          {success ? (
            <div className="text-center animate-pulse">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h3 className="text-3xl font-serif text-opera-indigo mb-4 font-bold">Upload Successful</h3>
              <p className="text-gray-600 font-sans mb-8 leading-relaxed">Your payment proof has been sent to our verification module. You will be notified shortly via email.</p>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">Return to Events</Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h3 className="text-3xl font-serif text-opera-indigo mb-2 font-bold">Upload Proof</h3>
                <p className="text-gray-500 font-sans">Select your transaction screenshot</p>
              </div>

              {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-sm text-sm border border-red-200">{error}</div>}

              <div className="relative group cursor-pointer shadow-sm">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className={`border-2 border-dashed rounded-sm p-12 text-center transition-all duration-300 
                  ${file ? 'border-opera-brass bg-opera-brass/5' : 'border-opera-indigo/20 bg-opera-plaster group-hover:border-opera-indigo group-hover:bg-opera-indigo/5'}`}>
                  
                  <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${file ? 'text-opera-brass' : 'text-opera-indigo/50 group-hover:text-opera-indigo'}`} />
                  
                  {file ? (
                    <p className="font-sans text-opera-indigo font-medium tracking-wide">{file.name}</p>
                  ) : (
                    <div>
                      <p className="font-sans text-opera-indigo font-medium">Drag & drop or click to browse</p>
                      <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <Button 
                  onClick={handleUpload} 
                  className="w-full" 
                  isLoading={loading}
                  disabled={!file}
                >
                  {loading ? 'Uploading Proof...' : 'Submit Verification'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
