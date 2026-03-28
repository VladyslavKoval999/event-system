import axios from 'axios';
import coursesData from '../data/courses.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Базовий URL для зовнішнього API
const EXTERNAL_API = `${import.meta.env.VITE_API_URL}/users`;

export const fetchCourses = async () => {
  await delay(500);
  return coursesData;
};

export const fetchCourseById = async (id) => {
  await delay(300);
  return coursesData.find(c => c.id === Number(id));
};

// Функція для імпорту сутностей із зовнішнього АРІ [cite: 16]
export const importExternalParticipants = async () => {
  const response = await axios.get(EXTERNAL_API);
  // Мапимо дані під наш формат
  return response.data.map(user => ({
    id: `ext-${user.id}`,
    name: user.name,
    email: user.email.toLowerCase()
  }));
};

export const fetchParticipants = async (eventId, page = 1) => {
  await delay(800);
  const MOCK_PARTICIPANTS = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    name: `Учасник ${i + 1}`,
    email: `student${i + 1}@art.com`
  }));
  const start = (page - 1) * 15;
  return MOCK_PARTICIPANTS.slice(start, start + 15);
};

export const registerUser = async (data) => {
  await delay(1000);
  console.log("Дані успішно отримано сервером:", data);
  return { success: true };
};