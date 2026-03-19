import axiosInstance from './axiosInstance';

export const getPublicEvents = async () => {
  const response = await axiosInstance.get('/api/events/public');
  return response.data;
};

export const getEventDetails = async (id) => {
  const response = await axiosInstance.get(`/api/events/details/${id}`);
  return response.data;
};

export const getPendingEvents = async () => {
  const response = await axiosInstance.get('/api/events/pending');
  return response.data;
};

export const createEvent = async (eventData) => {
  // Use FormData if there's an image upload
  const response = await axiosInstance.post('/api/events/create', eventData);
  return response.data;
};

export const approveEvent = async (id) => {
  const response = await axiosInstance.put(`/api/events/approve/${id}`);
  return response.data;
};

export const rejectEvent = async (id, reason) => {
  const response = await axiosInstance.put(`/api/events/reject/${id}`, { reason });
  return response.data;
};

export const markEventComplete = async (id) => {
  const response = await axiosInstance.put(`/api/events/complete/${id}`);
  return response.data;
};
