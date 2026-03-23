import axiosInstance from './axiosInstance';

const staffApi = {
  // Get dashboard metrics
  getDashboardStats: () => axiosInstance.get('/api/staff/stats').then(res => res.data),

  // Get list of assigned events
  getAssignedEvents: (params = {}) => axiosInstance.get('/api/staff/events', { params }).then(res => res.data),

  // Get specific event details
  getEventDetails: (eventId) => axiosInstance.get(`/api/staff/events/${eventId}`).then(res => res.data),

  // Update event details (venue, duration, notes)
  updateEventDetails: (eventId, details) => axiosInstance.put(`/api/staff/events/${eventId}/details`, details).then(res => res.data),

  // Upload document
  uploadDocument: (eventId, docType, formData) => axiosInstance.post(`/api/staff/events/${eventId}/upload/${docType}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data),

  // Submit to HOD
  submitEventToHOD: (eventId) => axiosInstance.put(`/api/staff/events/${eventId}/submit`).then(res => res.data)
};

export default staffApi;
