const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const apiService = {
    // Асинхронний запит з імітацією пагінації
    async fetchEvents(page = 1, limit = 9) {
        try {
            const response = await fetch(`${BASE_URL}/posts?_page=${page}&_limit=${limit}`);

            // Перевірка статус-коду
            if (!response.ok) {
                throw new Error(`HTTP помилка! Статус: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            // Прокидаємо помилку далі
            throw error;
        }
    }
};