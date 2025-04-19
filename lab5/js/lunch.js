// Объект с категориями и блюдами
const MENU_CATEGORIES = {
    SOUPS: {
        name: 'soups',
        title: 'Выберите суп',
        items: [
            { 
                id: 'gaspacho',
                name: 'Гаспачо', 
                price: 195, 
                weight: '350 г',
                filters: ['Холодный', 'Овощной', 'Средняя порция'],
                img: '../imgs/soup1.jpg'
            },
            { 
                id: 'mushroom-soup',
                name: 'Грибной суп-пюре', 
                price: 185, 
                weight: '330 г',
                filters: ['Горячий', 'Грибной', 'Средняя порция'],
                img: '../imgs/soup2.jpg'
            },
            { 
                id: 'norwegian-soup',
                name: 'Норвежский суп', 
                price: 270, 
                weight: '330 г',
                filters: ['Горячий', 'Рыбный', 'Большая порция'],
                img: '../imgs/soup3.jpg'
            },
            { 
                id: 'tomato-soup',
                name: 'Томатный суп', 
                price: 220, 
                weight: '350 г',
                filters: ['Горячий', 'Овощной', 'Средняя порция'],
                img: '../imgs/soup4.jpg'
            }
        ]
    },
    APPETIZERS: {
        name: 'appetizers',
        title: 'Выберите закуску',
        items: [
            { 
                id: 'bruschetta',
                name: 'Брускетта', 
                price: 180, 
                weight: '200 г',
                filters: ['Холодная', 'Овощная', 'Итальянская кухня'],
                img: '../imgs/appetizer1.jpg'
            },
            { 
                id: 'spring-rolls',
                name: 'Спринг-роллы', 
                price: 220, 
                weight: '250 г',
                filters: ['Холодная', 'Овощная', 'Азиатская кухня'],
                img: '../imgs/appetizer2.jpg'
            },
            { 
                id: 'cheese-plate',
                name: 'Сырная тарелка', 
                price: 280, 
                weight: '300 г',
                filters: ['Холодная', 'Сырная', 'Французская кухня'],
                img: '../imgs/appetizer3.jpg'
            }
        ]
    },
    MAIN_DISHES: {
        name: 'mainDishes',
        title: 'Выберите главное блюдо',
        items: [
            { 
                id: 'lasagna',
                name: 'Лазанья', 
                price: 300, 
                weight: '350 г',
                filters: ['Горячее', 'Мясное', 'Итальянская кухня', 'Большая порция'],
                img: '../imgs/bludo1.jpg'
            },
            { 
                id: 'shashlik',
                name: 'Шашлык', 
                price: 325, 
                weight: '330 г',
                filters: ['Горячее', 'Мясное', 'Кавказская кухня', 'Большая порция'],
                img: '../imgs/bludo2.jpg'
            },
            { 
                id: 'grechka',
                name: 'Гречка с котлетой', 
                price: 270, 
                weight: '330 г',
                filters: ['Горячее', 'Мясное', 'Русская кухня', 'Средняя порция'],
                img: '../imgs/bludo3.jpg'
            }
        ]
    },
    DESSERTS: {
        name: 'desserts',
        title: 'Выберите десерт',
        items: [
            { 
                id: 'donat_small',
                name: 'Пончики', 
                price: 200, 
                weight: '3 шт',
                filters: ['Холодный', 'Кофейный', "Маленькая порция", 'Итальянская кухня'],
                img: '../imgs/desert1.jpg'
            },
            { 
                id: 'donat_medium',
                name: 'Пончики', 
                price: 300, 
                weight: '5 шт',
                filters: ['Холодный', 'Кофейный', "Средняя порция", 'Итальянская кухня'],
                img: '../imgs/desert2.jpg'
            },
            { 
                id: 'donat_small',
                name: 'Пончики', 
                price: 400, 
                weight: '8 шт',
                filters: ['Холодный', 'Кофейный', "Большая порция", 'Итальянская кухня'],
                img: '../imgs/desert3.jpg'
            }
        ]
    },
    DRINKS: {
        name: 'drinks',
        title: 'Выберите напиток',
        items: [
            { 
                id: 'juice',
                name: 'Сок', 
                price: 300, 
                weight: '400 мл',
                filters: ['Холодный', 'Фруктовый'],
                img: '../imgs/drink1.jpg'
            },
            { 
                id: 'cappuccino',
                name: 'Капучино', 
                price: 325, 
                weight: '300 мл',
                filters: ['Горячий', 'Кофе'],
                img: '../imgs/drink2.jpg'
            },
            { 
                id: 'water',
                name: 'Вода', 
                price: 40, 
                weight: '300 мл',
                filters: ['Холодный', 'Без добавок'],
                img: '../imgs/drink3.jpg'
            }
        ]
    }
};

// Состояние приложения
const AppState = {
    selectedItems: {
        soup: null,
        appetizer: null,
        mainDish: null,
        dessert: null,
        drink: null
    },
    activeFilters: {
        soups: [],
        appetizers: [],
        mainDishes: [],
        desserts: [],
        drinks: []
    }
};

// Функция переключения фильтра
function toggleFilter() {
    const filter = this.dataset.filter;
    const category = this.dataset.category;
    
    if (AppState.activeFilters[category].includes(filter)) {
        AppState.activeFilters[category] = AppState.activeFilters[category].filter(f => f !== filter);
        this.classList.remove('active');
    } else {
        AppState.activeFilters[category].push(filter);
        this.classList.add('active');
    }
    
    applyFilters();
}

// Функция сброса фильтров
function resetFilters(e) {
    e.preventDefault();
    const category = this.dataset.category;
    AppState.activeFilters[category] = [];
    
    document.querySelectorAll(`.filters button[data-category="${category}"]`).forEach(button => {
        button.classList.remove('active');
    });
    
    applyFilters();
}

// Функция применения фильтров
function applyFilters() {
    Object.values(MENU_CATEGORIES).forEach(category => {
        const cards = document.querySelectorAll(`.food-container[data-category="${category.name}"] .card`);
        
        cards.forEach((card, index) => {
            const item = category.items[index];
            const matchesFilters = AppState.activeFilters[category.name].length === 0 || 
                AppState.activeFilters[category.name].every(filter => item.filters.includes(filter));
            
            card.style.display = matchesFilters ? 'flex' : 'none';
        });
    });
}

// Функция добавления блюда в заказ
function addItemToOrder(categoryTitle, itemName) {
    const category = Object.values(MENU_CATEGORIES).find(c => c.title === categoryTitle);
    if (!category) return;
    
    const item = category.items.find(i => i.name === itemName);
    if (!item) return;
    
    let categoryType;
    if (categoryTitle.includes('суп')) categoryType = 'soup';
    else if (categoryTitle.includes('закуск')) categoryType = 'appetizer';
    else if (categoryTitle.includes('главное')) categoryType = 'mainDish';
    else if (categoryTitle.includes('десерт')) categoryType = 'dessert';
    else if (categoryTitle.includes('напиток')) categoryType = 'drink';
    else return;
    
    AppState.selectedItems[categoryType] = item;
    updateSelectedItemsDisplay();
}

// Функция обновления отображения выбранных блюд
function updateSelectedItemsDisplay() {
    const container = document.getElementById('selectedItems');
    container.innerHTML = '';
    
    let total = 0;
    let hasItems = false;
    
    for (const [category, item] of Object.entries(AppState.selectedItems)) {
        if (item) {
            hasItems = true;
            total += item.price;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'selected-item';
            
            const img = document.createElement('img');
            img.src = item.img;
            img.alt = item.name;
            img.width = 50;
            img.height = 50;
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'item-info';
            
            const name = document.createElement('span');
            name.className = 'item-name';
            name.textContent = item.name;
            
            const price = document.createElement('span');
            price.className = 'item-price';
            price.textContent = `${item.price}₽`;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-item';
            removeBtn.textContent = '×';
            removeBtn.dataset.category = category;
            removeBtn.addEventListener('click', removeItem);
            
            infoDiv.appendChild(name);
            infoDiv.appendChild(price);
            itemDiv.appendChild(img);
            itemDiv.appendChild(infoDiv);
            itemDiv.appendChild(removeBtn);
            container.appendChild(itemDiv);
        }
    }
    
    if (!hasItems) {
        container.innerHTML = '<p>Выберите блюда из меню выше</p>';
    }
    
    document.getElementById('totalAmount').textContent = `${total}₽`;
}

// Функция удаления блюда из заказа
function removeItem(e) {
    e.preventDefault();
    const category = this.dataset.category;
    AppState.selectedItems[category] = null;
    updateSelectedItemsDisplay();
}

function getUniqueFilters(categoryName) {
    const category = Object.values(MENU_CATEGORIES).find(c => c.name === categoryName);
    if (!category) return [];
    
    const filters = new Set();
    category.items.forEach(item => {
        item.filters.forEach(filter => filters.add(filter));
    });
    return Array.from(filters);
}

// Функция создания меню
function createMenu() {
    const menuSection = document.querySelector('section.menu');
    if (!menuSection) return;
    
    // Очищаем секцию меню
    menuSection.innerHTML = '';
    
    // Добавляем каждую категорию в секцию меню
    Object.values(MENU_CATEGORIES).forEach(category => {
        // Создаем контейнер для категории
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'menu-category';
        
        // Добавляем заголовок категории
        const h1 = document.createElement('h1');
        h1.textContent = category.title;
        categoryDiv.appendChild(h1);
        
        // Добавляем контейнер для фильтров
        const filtersDiv = document.createElement('div');
        filtersDiv.className = 'filters';
        
        // Добавляем кнопки фильтров
        getUniqueFilters(category.name).forEach(filter => {
            const button = document.createElement('button');
            button.textContent = filter;
            button.dataset.filter = filter;
            button.dataset.category = category.name;
            button.addEventListener('click', toggleFilter);
            filtersDiv.appendChild(button);
        });
        
        // Добавляем кнопку сброса фильтров
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Сбросить фильтры';
        resetButton.className = 'reset-filter';
        resetButton.dataset.category = category.name;
        resetButton.addEventListener('click', resetFilters);
        filtersDiv.appendChild(resetButton);
        
        categoryDiv.appendChild(filtersDiv);
        
        // Добавляем контейнер для карточек
        const foodContainer = document.createElement('div');
        foodContainer.className = 'food-container';
        foodContainer.dataset.category = category.name;
        
        // Добавляем карточки блюд
        category.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            
            card.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div>
                    <p class="price">${item.price}₽</p>
                    <p class="name">${item.name}</p>
                    <p class="weight">${item.weight}</p>
                    <button>Добавить</button>
                </div>
            `;
            
            // Добавляем обработчик на кнопку
            card.querySelector('button').addEventListener('click', (e) => {
                e.preventDefault();
                addItemToOrder(category.title, item.name);
            });
            
            foodContainer.appendChild(card);
        });
        
        categoryDiv.appendChild(foodContainer);
        menuSection.appendChild(categoryDiv);
    });
}

// Остальные функции (toggleFilter, resetFilters, applyFilters, 
// addItemToOrder, removeItem, updateSelectedItemsDisplay) остаются без изменений

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    createMenu();
    
    // Обработчик для радиокнопок доставки
    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('timeSelect').style.display = 
                this.value === 'scheduled' ? 'block' : 'none';
        });
    });
});