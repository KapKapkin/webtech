const AppState = {
    selectedItems: {},
    activeFilters: {}
};

const COMBO_OPTIONS = [
  {
    id: 'combo1',
    name: 'Комбо 1',
    dishes: [
      { type: 'soup', text: 'Суп', image: "../imgs/combo1.jpg" },
      { type: 'mainDish', text: 'Главное блюдо', image: "../imgs/combo2.jpg" },
      { type: 'appetizer', text: 'Салат', image: "../imgs/combo3.jpg" },
      { type: 'drink', text: 'Напиток', image: "../imgs/combo4.jpg" }
    ]
  },
  {
    id: 'combo2',
    name: 'Комбо 2',
    dishes: [
      { type: 'soup', text: 'Суп', image: "../imgs/combo1.jpg" },
      { type: 'mainDish', text: 'Главное блюдо', image: "../imgs/combo2.jpg" },
      { type: 'drink', text: 'Напиток', image: "../imgs/combo4.jpg" }
    ]
  },
  {
    id: 'combo3',
    name: 'Комбо 3',
    dishes: [
      { type: 'soup', text: 'Суп', image: "../imgs/combo1.jpg" },
      { type: 'appetizer', text: 'Салат', image: "../imgs/combo3.jpg" },
      { type: 'drink', text: 'Напиток', image: "../imgs/combo4.jpg" }
    ]
  },
  {
    id: 'combo4',
    name: 'Комбо 4',
    dishes: [
      { type: 'mainDish', text: 'Главное блюдо', image: "../imgs/combo2.jpg" },
      { type: 'appetizer', text: 'Салат', image: "../imgs/combo3.jpg" },
      { type: 'drink', text: 'Напиток', image: "../imgs/combo4.jpg" }
    ]
  },
  {
    id: 'combo5',
    name: 'Комбо 5',
    dishes: [
      { type: 'mainDish', text: 'Главное блюдо', image: "../imgs/combo2.jpg" },
      { type: 'drink', text: 'Напиток', image: "../imgs/combo4.jpg" }
    ]
  }
];

let MENU_CATEGORIES = {};
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api';
const API_KEY = 'b956c9fb-854c-4c30-b6bc-98f8ac8f9c3a'; // Замените на ваш ключ

function getUniqueFilters(categoryName) {
    const category = Object.values(MENU_CATEGORIES).find(c => c.name === categoryName);
    if (!category) return [];
  
    const filters = new Set();
    category.items.forEach(item => {
      item.filters.forEach(filter => filters.add(filter));
    });
    return Array.from(filters);
  }
  
  function createComboSection() {
    const comboSection = document.querySelector('.lunch-combos');
    if (!comboSection) return;
  
    comboSection.innerHTML = '';
  
    const title = document.createElement('h2');
    title.textContent = 'Доступные для заказа комбо';
    comboSection.appendChild(title);
  
    const comboGrid = document.createElement('div');
    comboGrid.className = 'combo-grid';
  
    COMBO_OPTIONS.forEach(combo => {
      const comboOption = document.createElement('div');
      comboOption.className = 'combo-option';
      comboOption.dataset.comboId = combo.id;
  
      const comboName = document.createElement('h3');
      comboName.textContent = combo.name;
      comboOption.appendChild(comboName);
  
      combo.dishes.forEach(dish => {
        const dishElement = document.createElement('div');
        dishElement.className = 'combo-dish';
  
        const img = document.createElement('img');
        img.src = dish.image;
        img.alt = dish.text;
  
        const caption = document.createElement('span');
        caption.textContent = dish.text;
  
        dishElement.appendChild(img);
        dishElement.appendChild(caption);
        comboOption.appendChild(dishElement);
      });
  
      comboGrid.appendChild(comboOption);
    });
  
    comboSection.appendChild(comboGrid);
  
    const dessertInfo = document.createElement('div');
    dessertInfo.className = 'dessert-info';
  
    const dessertText = document.createElement('p');
    dessertText.innerHTML = 'Десерт <small>(Можно добавить к любому заказу)</small>';
  
    const dessertImages = document.createElement('div');
    dessertImages.className = 'dessert-images';
  
    const img = document.createElement('img');
    img.src = "../imgs/combo5.jpg";
    img.alt = 'Десерт';
    dessertImages.appendChild(img);
  
    dessertInfo.appendChild(dessertText);
    dessertInfo.appendChild(dessertImages);
    comboSection.appendChild(dessertInfo);
  }

function generateFilters(item) {
    const filters = [];
    const typeMap = {
      'veg': 'Овощной',
      'meat': 'Мясной',
      'fish': 'Рыбный',
      'cheese': 'Сырный',
      'cold': 'Холодный',
      'hot': 'Горячий'
    };
    if (typeMap[item.kind]) filters.push(typeMap[item.kind]);
    
    const portionSize = parseInt(item.count);
    if (!isNaN(portionSize)) {
      if (portionSize >= 400) filters.push('Большая порция');
      else if (portionSize >= 300) filters.push('Средняя порция');
      else filters.push('Маленькая порция');
    }
    
    return filters;
  }

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

    
  function resetFilters(e) {
    e.preventDefault();
    const category = this.dataset.category;
    AppState.activeFilters[category] = [];
  
    document.querySelectorAll(`.filters button[data-category="${category}"]`).forEach(button => {
      button.classList.remove('active');
    });
  
    applyFilters();
  }

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

  function getCategoryTitle(category) {
    const titles = {
      'soup': 'Выберите суп',
      'main-course': 'Выберите основное блюдо',
      'salad': 'Выберите салат',
      'drink': 'Выберите напиток',
      'dessert': 'Выберите десерт'
    };
    return titles[category] || `Выберите ${category}`;
  }

// Сохранение заказа в localStorage
function saveOrderToLocalStorage() {
    const orderData = {};
    for (const [category, item] of Object.entries(AppState.selectedItems)) {
        if (item) {
            orderData[category] = item.id;
        }
    }
    localStorage.setItem('currentOrder', JSON.stringify(orderData));
}

// Загрузка заказа из localStorage
function loadOrderFromLocalStorage() {
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
        const orderData = JSON.parse(savedOrder);
        
        for (const [category, itemId] of Object.entries(orderData)) {
            for (const menuCategory of Object.values(MENU_CATEGORIES)) {
                const item = menuCategory.items.find(i => i.id == itemId);
                if (item) {
                    AppState.selectedItems[category] = item;
                    break;
                }
            }
        }
    }
}

// Обновление панели оформления
function updateCheckoutPanel() {
    const panel = document.querySelector('.checkout-panel');
    const total = calculateTotal();
    const isValid = validateOrder();
    
    if (total > 0) {
        panel.style.display = 'block';
        document.getElementById('currentTotal').textContent = `${total}₽`;
        document.getElementById('checkoutLink').style.opacity = isValid ? '1' : '0.5';
        document.getElementById('checkoutLink').style.pointerEvents = isValid ? 'auto' : 'none';
    } else {
        panel.style.display = 'none';
    }
}

// Добавление блюда в заказ
function addItemToOrder(categoryName, itemName) {
    const category = MENU_CATEGORIES[categoryName];
    if (!category) return;
    
    const item = category.items.find(i => i.name === itemName);
    if (!item) return;
    
    AppState.selectedItems[category.name] = item;
    updateSelectedItemsDisplay();
    saveOrderToLocalStorage();
    updateCheckoutPanel();
}

// Удаление блюда из заказа
function removeItem(e) {
    e.preventDefault();
    const category = this.dataset.category;
    AppState.selectedItems[category] = null;
    updateSelectedItemsDisplay();
    saveOrderToLocalStorage();
    updateCheckoutPanel();
}

// Загрузка данных меню с сервера
async function fetchMenuData() {
    try {
        const response = await fetch(`${API_URL}/dishes?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        return await response.json();
    } catch (error) {
        console.error('Ошибка при загрузке меню:', error);
        showNotification('Не удалось загрузить меню. Пожалуйста, попробуйте позже.', 'error');
        return [];
    }
}

// Инициализация приложения
async function initApp() {
    const serverData = await fetchMenuData();
    if (serverData.length > 0) {
        MENU_CATEGORIES = createCategoriesFromData(serverData);
        
        loadOrderFromLocalStorage();
        updateSelectedItemsDisplay();
        createMenu();
        setupEventListeners();
        updateCheckoutPanel();
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    document.getElementById('checkoutLink').addEventListener('click', function(e) {
        if (!validateOrder()) {
            e.preventDefault();
            showNotification('Выбранные блюда не соответствуют ни одному варианту комбо', 'invalid-combo');
        }
    });
}

// Создание категорий из данных сервера
function createCategoriesFromData(serverData) {
    const categories = {};
    
    serverData.forEach(item => {
        if (!categories[item.category]) {
            categories[item.category] = {
                name: item.category,
                title: getCategoryTitle(item.category),
                items: []
            };
            
            if (!AppState.selectedItems[item.category]) {
                AppState.selectedItems[item.category] = null;
            }
            if (!AppState.activeFilters[item.category]) {
                AppState.activeFilters[item.category] = [];
            }
        }
    });
    
    serverData.forEach(item => {
        categories[item.category].items.push({
            id : item.id,
            keyword: item.keyword,
            name: item.name,
            price: item.price,
            weight: item.count,
            filters: generateFilters(item),
            img: item.image
        });
    });
    
    return categories;
}

// Обновление отображения выбранных блюд
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

// Валидация заказа (проверка комбо)
function validateOrder() {
    const selected = AppState.selectedItems;
    const hasSoup = selected.soup !== null;
    const hasMain = selected.mainDish !== null;
    const hasSalad = selected.appetizer !== null;
    const hasDrink = selected.drink !== null;
    const hasDessert = selected.dessert !== null;

    if (!hasSoup && !hasMain && !hasSalad && !hasDrink && !hasDessert) {
        return false;
    }

    if (hasSoup && hasMain && hasSalad && hasDrink) return true;
    if (hasSoup && hasMain && hasDrink) return true;
    if (hasSoup && hasSalad && hasDrink) return true;
    if (hasMain && hasSalad && hasDrink) return true;
    if (hasMain && hasDrink) return true;
    if ((hasSoup || hasMain || hasSalad) && hasDrink && hasDessert) return true;

    return false;
}

// Показать уведомление
function showNotification(message, imageKey) {
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';

    const notification = document.createElement('div');
    notification.className = 'notification-modal';

    const notificationText = document.createElement('p');
    notificationText.textContent = message;

    const okButton = document.createElement('button');
    okButton.className = 'notification-button';
    okButton.textContent = 'ОКЕЙ';

    notification.appendChild(notificationText);
    notification.appendChild(okButton);
    overlay.appendChild(notification);

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    okButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
    });
}

function calculateTotal() {
    return Object.values(AppState.selectedItems)
      .filter(item => item !== null)
      .reduce((total, item) => total + item.price, 0);
  }

function createMenu() {
    createComboSection();
    const menuSection = document.querySelector('section.menu');
    if (!menuSection) return;
    
    menuSection.innerHTML = '';
    
    const categoryOrder = ['soup', 'main-course', 'salad', 'drink', 'dessert'];
    
    categoryOrder.forEach(categoryKey => {
      const category = MENU_CATEGORIES[categoryKey];
      if (!category) return;
      
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'menu-category';
      
      const h1 = document.createElement('h1');
      h1.textContent = category.title;
      categoryDiv.appendChild(h1);
      
      const filtersDiv = document.createElement('div');
      filtersDiv.className = 'filters';
      
      getUniqueFilters(category.name).forEach(filter => {
        const button = document.createElement('button');
        button.textContent = filter;
        button.dataset.filter = filter;
        button.dataset.category = category.name;
        button.addEventListener('click', toggleFilter);
        filtersDiv.appendChild(button);
      });
      
      const resetButton = document.createElement('button');
      resetButton.textContent = 'Сбросить фильтры';
      resetButton.className = 'reset-filter';
      resetButton.dataset.category = category.name;
      resetButton.addEventListener('click', resetFilters);
      filtersDiv.appendChild(resetButton);
      
      categoryDiv.appendChild(filtersDiv);
      
      const foodContainer = document.createElement('div');
      foodContainer.className = 'food-container';
      foodContainer.dataset.category = category.name;
      
      category.items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
          <img src="${item.img}" alt="${item.name}" onerror="this.src='../imgs/default-food.jpg'">
          <div>
            <p class="price">${item.price}₽</p>
            <p class="name">${item.name}</p>
            <p class="weight">${item.weight}</p>
            <button>Добавить</button>
          </div>
        `;
        
        card.querySelector('button').addEventListener('click', (e) => {
          e.preventDefault();
          addItemToOrder(category.name, item.name);
        });
        
        foodContainer.appendChild(card);
      });
      
      categoryDiv.appendChild(foodContainer);
      menuSection.appendChild(categoryDiv);
    });
  }

document.addEventListener('DOMContentLoaded', initApp);