import axios from 'axios';

// Base URL jahan par hamara backend run ho raha hai
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Upload image API call
export const uploadImage = (formData) => {
  return API.post('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const  fetchImages = () => {
  return API.get('/images');
};

export const deleteImage = (id) => {
  return API.delete(`/images/${id}`);
};
