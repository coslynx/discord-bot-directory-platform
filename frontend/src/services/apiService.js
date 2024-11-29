import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const apiService = {
  getBots: async (searchQuery, status) => {
    const response = await axios.get(`${apiUrl}/bots`, {
      params: { searchQuery, status },
    });
    return response.data;
  },
  getBot: async (botId) => {
    const response = await axios.get(`${apiUrl}/bots/${botId}`);
    return response.data;
  },
  createBot: async (botData) => {
    const response = await axios.post(`${apiUrl}/bots`, botData);
    return response.data;
  },
  updateBot: async (botId, botData) => {
    const response = await axios.put(`${apiUrl}/bots/${botId}`, botData);
    return response.data;
  },
  deleteBot: async (botId) => {
    const response = await axios.delete(`${apiUrl}/bots/${botId}`);
    return response.data;
  },
  approveBot: async (botId) => {
    const response = await axios.put(`${apiUrl}/bots/${botId}/approve`);
    return response.data;
  },
  rejectBot: async (botId) => {
    const response = await axios.put(`${apiUrl}/bots/${botId}/reject`);
    return response.data;
  },
  getAllBots: async () => {
    const response = await axios.get(`${apiUrl}/bots/all`);
    return response.data;
  },
  getUsers: async (searchQuery, role) => {
    const response = await axios.get(`${apiUrl}/users`, {
      params: { searchQuery, role },
    });
    return response.data;
  },
  getUser: async () => {
    const response = await axios.get(`${apiUrl}/users/me`);
    return response.data;
  },
  updateUser: async (userId, userData) => {
    const response = await axios.put(`${apiUrl}/users/${userId}`, userData);
    return response.data;
  },
  deleteUser: async (userId) => {
    const response = await axios.delete(`${apiUrl}/users/${userId}`);
    return response.data;
  },
  getAllUsers: async () => {
    const response = await axios.get(`${apiUrl}/users/all`);
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await axios.put(`${apiUrl}/users/profile`, profileData);
    return response.data;
  },
  login: async (userData) => {
    const response = await axios.post(`${apiUrl}/auth/login`, userData);
    return response.data;
  },
};

export default apiService;
```