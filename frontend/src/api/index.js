import axios from 'axios';

// Base URL jahan par hamara backend run ho raha hai
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Upload image API call
export const uploadFile = (formData) => {
  return API.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const fetchFiles = () => {
  return API.get('/files');
};

export const deleteFile = (id) => {
  return API.delete(`/files/${id}`);
};
