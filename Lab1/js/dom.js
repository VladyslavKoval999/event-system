export const uiService = {
    listElement: document.getElementById('app'),
    loaderElement: document.getElementById('loader'),
    errorElement: document.getElementById('error-msg'),
    favCountElement: document.getElementById('fav-count'),

    // Створення однієї картки
    createCard(event, isFavorite, onToggle) {
        const card = document.createElement('article');
        card.className = 'card';
        
        const btnText = isFavorite ? '❤️ У вибраному' : '🤍 Додати в обране';
        const btnClass = isFavorite ? 'active' : '';

        card.innerHTML = `
            <h3>Подія #${event.id}</h3>
            <h4>${event.title.slice(0, 20)}...</h4>
            <p>${event.body.slice(0, 100)}...</p>
        `;

        const btn = document.createElement('button');
        btn.textContent = btnText;
        btn.className = btnClass;
        // При кліку викликаємо функцію, яку передали з app.js
        btn.onclick = () => onToggle(event.id, btn);

        card.appendChild(btn);
        return card;
    },

    // Рендер списку карток
    appendCards(events, favorites, onToggleHandler) {
        const fragment = document.createDocumentFragment();
        events.forEach(event => {
            const isFav = favorites.includes(event.id);
            const card = this.createCard(event, isFav, onToggleHandler);
            fragment.appendChild(card);
        });
        this.listElement.appendChild(fragment);
    },

    updateFavCount(count) {
        this.favCountElement.textContent = count;
    },

    toggleLoader(show) {
        show ? this.loaderElement.classList.remove('hidden') 
             : this.loaderElement.classList.add('hidden');
    },

    showError(message) {
        this.errorElement.textContent = message;
        this.errorElement.classList.remove('hidden');
        // Приховуємо помилку через 4 секунди
        setTimeout(() => this.errorElement.classList.add('hidden'), 4000);
    }
};