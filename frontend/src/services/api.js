import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const familyTreeAPI = {
  // Получить все дерево
  getTree: () => api.get('/tree/'),

  // Получить всех людей
  getPersons: () => api.get('/persons/'),

  // Создать человека
  createPerson: (personData) => api.post('/persons/', personData),

  // Получить человека по ID
  getPerson: (id) => api.get(`/persons/${id}`),

  // Получить детей человека
  getChildren: (id) => api.get(`/persons/${id}/children`),
};