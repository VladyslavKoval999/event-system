import { apiService } from './api.js';
import { storageService } from './storage.js';
import { uiService } from './dom.js';
import { debounce } from './utils.js';

// Стан додатка
const state = {
    page: 1,
    limit: 9,
    isLoading: false,
    hasMore: true,
    favorites: []
};

// Ініціалізація при запуску
async function init() {
    // Зчитуємо збережені лайки
    state.favorites = storageService.getFavorites();
    uiService.updateFavCount(state.favorites.length);
    
    // Вантажимо першу сторінку
    await loadMoreEvents();
    
    // Infinite Scroll
    window.addEventListener('scroll', debounce(handleScroll, 200));
}

// Функція завантаження даних
async function loadMoreEvents() {
    if (state.isLoading || !state.hasMore) return;

    state.isLoading = true;
    uiService.toggleLoader(true);

    try {
        // Штучна затримка, щоб побачити спінер
        await new Promise(r => setTimeout(r, 800)); 

        const events = await apiService.fetchEvents(state.page, state.limit);

        if (events.length === 0) {
            state.hasMore = false; // Дані закінчились
            console.log("Більше подій немає");
            return;
        }

        uiService.appendCards(events, state.favorites, handleFavoriteToggle);
        state.page++; // Готуємось до наступної сторінки

    } catch (error) {
        console.error(error);
        uiService.showError("Помилка мережі! Перевірте інтернет.");
    } finally {
        state.isLoading = false;
        uiService.toggleLoader(false);
    }
}

// Клік по кнопці "В обране"
function handleFavoriteToggle(id, btnElement) {
    const updatedFavs = storageService.toggleFavorite(id);
    state.favorites = updatedFavs;
    
    // Оновлюємо вигляд кнопки
    const isFav = updatedFavs.includes(id);
    btnElement.textContent = isFav ? '❤️ У вибраному' : '🤍 Додати в обране';
    btnElement.className = isFav ? 'active' : '';
    
    uiService.updateFavCount(updatedFavs.length);
}

// Перевірка скролу
function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
    // Якщо до низу сторінки залишилось менше 100 пікселів
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMoreEvents();
    }
}

// Запускаємо додаток
init();