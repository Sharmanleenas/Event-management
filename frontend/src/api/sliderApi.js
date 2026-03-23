import axiosInstance from './axiosInstance';

const sliderApi = {
  getAll: (activeOnly = false) =>
    axiosInstance.get(`/api/sliders${activeOnly ? '?active=true' : ''}`).then(r => r.data),

  upload: (formData) =>
    axiosInstance.post('/api/sliders/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data),

  update: (id, payload) =>
    axiosInstance.put(`/api/sliders/${id}`, payload).then(r => r.data),

  remove: (id) =>
    axiosInstance.delete(`/api/sliders/${id}`).then(r => r.data),
};

export default sliderApi;
