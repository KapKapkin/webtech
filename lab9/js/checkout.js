// Обновленный checkout.js
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api';
const API_KEY = 'b956c9fb-854c-4c30-b6bc-98f8ac8f9c3a'; // Замените на реальный ключ

let MENU_ITEMS = [];

document.addEventListener('DOMContentLoaded', async () => {
    MENU_ITEMS = await loadDishes();
    const order = loadOrderFromStorage();
    renderOrder(order, MENU_ITEMS);
    setupEventListeners();
});

async function loadDishes() {
    try {
        const response = await fetch(`${API_URL}/dishes?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Ошибка загрузки меню');
        return await response.json();
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('Не удалось загрузить меню', 'error');
        return [];
    }
}

function loadOrderFromStorage() {
    const order = localStorage.getItem('currentOrder');
    return order ? JSON.parse(order) : {
        soup: null,
        mainDish: null,
        salad: null,
        drink: null,
        dessert: null
    };
}

function renderOrder(order, dishes) {
    const orderItemsContainer = document.getElementById('orderItems');
    const selectedItemsList = document.getElementById('selectedItemsList');
    
    orderItemsContainer.innerHTML = '';
    selectedItemsList.innerHTML = '';
    
    let total = 0;
    let hasItems = false;

    for (const [category, itemId] of Object.entries(order)) {
        if (itemId) {
            const item = dishes.find(d => d.id === itemId);
            if (item) {
                hasItems = true;
                total += item.price;
                renderOrderItem(orderItemsContainer, item, category);
                renderSelectedItem(selectedItemsList, item, category);
            }
        } else {
            renderEmptySelectedItem(selectedItemsList, category);
        }
    }

    if (!hasItems) {
        orderItemsContainer.innerHTML = `
            <p>Ничего не выбрано. Чтобы добавить блюда в заказ, 
            перейдите на страницу <a href="lunch.html">Собрать ланч</a>.</p>
        `;
    }

    document.getElementById('totalAmount').textContent = `${total}₽`;
}

function renderOrderItem(container, item, category) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" onerror="this.src='../imgs/default-food.jpg'">
        <div>
            <p class="price">${item.price}₽</p>
            <p class="name">${item.name}</p>
            <p class="weight">${item.count}</p>
            <button class="remove-btn" data-category="${category}" data-id="${item.keyword}">Удалить</button>
        </div>
    `;
    container.appendChild(card);
}

function renderSelectedItem(container, item, category) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'selected-item';
    itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" width="50" height="50">
        <div class="item-info">
            <span class="item-name">${item.name}</span>
            <span class="item-price">${item.price}₽</span>
        </div>
    `;
    container.appendChild(itemDiv);
}

function renderEmptySelectedItem(container, category) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'selected-item';
    const name = getCategoryName(category);
    itemDiv.innerHTML = `
        <div class="item-info">
            <span class="item-name">${name}</span>
            <span class="item-price">Не выбрано</span>
        </div>
    `;
    container.appendChild(itemDiv);
}

function getCategoryName(category) {
    const names = {
        'soup': 'Суп',
        'main-course': 'Главное блюдо',
        'salad': 'Салат',
        'drink': 'Напиток',
        'dessert': 'Десерт'
    };
    return names[category] || category;
}

function setupEventListeners() {
    // Исправленный обработчик удаления
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const category = e.target.dataset.category;
            const order = loadOrderFromStorage();
            order[category] = null;
            localStorage.setItem('currentOrder', JSON.stringify(order));
            
            // Немедленное обновление интерфейса без повторной загрузки
            renderOrder(order, MENU_ITEMS);
        }
    });

    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitOrder();
    });

    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('timeSelect').style.display = 
                this.value === 'by_time' ? 'block' : 'none';
        });
    });
}

async function submitOrder() {
    const order = loadOrderFromStorage();
    const formData = new FormData(document.getElementById('orderForm'));
    
    if (!validateOrderCombo(order)) {
        showNotification('Выбранные блюда не соответствуют ни одному варианту комбо', 'error');
        return;
    }

    const orderData = {
        full_name: formData.get('name'),
        email: formData.get('email'),
        subscribe: formData.get('subscribe') ? 1 : 0,
        phone: formData.get('phone'),
        delivery_address: formData.get('address'),
        delivery_type: formData.get('delivery'),
        comment: formData.get('comment'),
        soup_id: order.soup || null,
        main_course_id: order["main-course"] || null,
        salad_id: order.salad || null,
        drink_id: order.drink || null,
        dessert_id: order.dessert || null
    };

    if (orderData.delivery_type === 'by_time') {
        orderData.delivery_time = formData.get('deliveryTime');
    }

    try {
        console.log(orderData);
        const response = await fetch(`${API_URL}/orders?api_key=${API_KEY}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка оформления заказа');
        }

        localStorage.removeItem('currentOrder');
        showNotification('Заказ успешно оформлен!', 'success');
        setTimeout(() => window.location.href = 'lunch.html', 2000);
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification(error.message || 'Не удалось оформить заказ', 'error');
    }
}

function validateOrderCombo(order) {
    console.log(order);
    const hasSoup = !!order.soup;
    const hasMain = !!order["main-course"];
    const hasSalad = !!order.salad;
    const hasDrink = !!order.drink;
    const hasDessert = !!order.dessert;
    console.log(hasSoup, hasMain, hasSalad, hasDrink, hasDessert);  

    if (hasSoup && hasMain && hasSalad && hasDrink) return true;
    if (hasSoup && hasMain && hasDrink) return true;
    if (hasSoup && hasSalad && hasDrink) return true;
    if (hasMain && hasSalad && hasDrink) return true;
    if (hasMain && hasDrink) return true;
    if ((hasSoup || hasMain || hasSalad) && hasDrink && hasDessert) return true;

    return false;
}

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