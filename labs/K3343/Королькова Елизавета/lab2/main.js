// js/main.js

// Общие функции для всего сайта
document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация всех компонентов
    initFilterButtons();
    initFavorites();
    initGallery();
    initFormValidation();
    
    // Загрузка данных пользователя если он залогинен
    loadUserData();
});

// Фильтрация объектов (для страницы поиска)
function initFilterButtons() {
    const filterBtn = document.getElementById('applyFilters');
    if (filterBtn) {
        filterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Собираем значения фильтров
            const filters = {
                type: document.getElementById('filterType')?.value || 'all',
                priceFrom: document.getElementById('priceFrom')?.value || 0,
                priceTo: document.getElementById('priceTo')?.value || 1000000,
                location: document.getElementById('location')?.value || 'all',
                rooms: document.getElementById('rooms')?.value || 'all'
            };
            
        
            console.log('Применены фильтры:', filters);
            
            // Показываем уведомление
            showNotification('Фильтры применены', 'success');
            
            filterProperties(filters);
        });
    }
}

// Функция фильтрации карточек на странице
function filterProperties(filters) {
    const cards = document.querySelectorAll('.property-card');
    if (!cards.length) return;
    
    cards.forEach(card => {
        let show = true;
        
        // Пример фильтрации по цене (нужно добавить data-атрибуты в карточки)
        const price = parseInt(card.dataset.price || '0');
        if (filters.priceFrom && price < parseInt(filters.priceFrom)) show = false;
        if (filters.priceTo && price > parseInt(filters.priceTo)) show = false;
        
        // По типу
        const type = card.dataset.type || '';
        if (filters.type !== 'all' && filters.type !== type) show = false;
        
        card.style.display = show ? 'block' : 'none';
    });
}

// Избранное
function initFavorites() {
    const favBtns = document.querySelectorAll('.favorite-btn');
    favBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.classList.remove('bi-heart');
                icon.classList.add('bi-heart-fill');
                icon.style.color = '#dc3545';
                showNotification('Добавлено в избранное');
            } else {
                icon.classList.remove('bi-heart-fill');
                icon.classList.add('bi-heart');
                icon.style.color = '';
                showNotification('Удалено из избранного');
            }
        });
    });
}

function initGallery() {
    const mainImage = document.getElementById('mainPropertyImage');
    const thumbs = document.querySelectorAll('.gallery-thumb');
    
    if (mainImage && thumbs.length) {
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').src;
                mainImage.src = imgSrc;
                
                thumbs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

// Валидация форм
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const inputs = this.querySelectorAll('input[required], select[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                }
                
                // Валидация email
                if (input.type === 'email' && input.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        input.classList.add('is-invalid');
                        isValid = false;
                    }
                }
                
                // Валидация пароля
                if (input.type === 'password' && input.value && input.value.length < 6) {
                    input.classList.add('is-invalid');
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Здесь отправка формы
                showNotification('Форма успешно отправлена!', 'success');
                
                // Перенаправление в зависимости от формы
                if (form.id === 'loginForm') {
                    setTimeout(() => window.location.href = 'profile.html', 1500);
                } else if (form.id === 'registerForm') {
                    setTimeout(() => window.location.href = 'profile.html', 1500);
                }
            }
        });
    });
}

// Загрузка данных пользователя
function loadUserData() {
    // Проверяем, есть ли сохраненный пользователь в localStorage
    const user = localStorage.getItem('harmonyUser');
    
    if (user) {
        const userData = JSON.parse(user);
        
        // Обновляем UI для залогиненного пользователя
        updateUIForLoggedInUser(userData);
    }
}

// Обновление UI для залогиненного пользователя
function updateUIForLoggedInUser(userData) {
    const loginBtns = document.querySelectorAll('.login-btn, .register-btn');
    const userMenu = document.querySelectorAll('.user-menu');
    
    loginBtns.forEach(btn => btn.style.display = 'none');
    userMenu.forEach(menu => menu.style.display = 'flex');
    
    // Обновляем имя пользователя если есть
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => {
        el.textContent = userData.name || 'Пользователь';
    });
}

// Показать уведомление
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 50px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .is-invalid {
        border-color: #dc3545 !important;
    }
    
    .favorite-btn.active i {
        color: #dc3545;
    }
`;
document.head.appendChild(style);