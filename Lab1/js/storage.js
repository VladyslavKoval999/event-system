const STORAGE_KEY = 'lab1_favorites';

export const storageService = {
    // Отримати масив ID
    getFavorites() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Помилка читання localStorage:", error);
            return [];
        }
    },

    // Зберегти масив
    saveFavorites(ids) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
        } catch (error) {
            console.error("Помилка запису в localStorage (можливо переповнення):", error);
        }
    },

    // Додати або видалити ID
    toggleFavorite(id) {
        const current = this.getFavorites();
        const index = current.indexOf(id);
        
        if (index === -1) {
            current.push(id);
        } else {
            current.splice(index, 1);
        }
        
        this.saveFavorites(current);
        return current;
    }
};