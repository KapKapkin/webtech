const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api';
const API_KEY = 'b956c9fb-854c-4c30-b6bc-98f8ac8f9c3a'; // Замените на реальный ключ

let currentOrders = [];
let currentOrderId = null;
let menuItems = []; 

document.addEventListener('DOMContentLoaded', async () => {
    loadMenuItems();
    await loadOrders();
    setupEventListeners();
});

async function loadMenuItems() {
    try {
        const response = await fetch(`${API_URL}/dishes?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Ошибка загрузки меню');
        const data = await response.json();
        menuItems = Array.isArray(data) ? data : []; // Гарантируем, что menuItems - массив
        console.log(menuItems);
    } catch (error) {
        console.error('Ошибка загрузки меню:', error);
        showNotification('Не удалось загрузить данные меню', 'error');
        menuItems = []; // Устанавливаем пустой массив при ошибке
    }
}

function getDishName(id) {
    if (!Array.isArray(menuItems)) 
        {return 'Неизвестно'};
    const item = menuItems.find(item => item.id == id); // Используем == вместо === для Number/String
    return item ? item.name : 'Неизвестно';
}

function getDishPrice(id) {
    if (!Array.isArray(menuItems)) return 0;
    const item = menuItems.find(item => item.id == id);
    return item ? item.price : 0;
}

async function loadOrders() {
    // try {
        const response = await fetch(`${API_URL}/orders?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Ошибка загрузки заказов');
        
        currentOrders = await response.json();
        currentOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        renderOrders();
    // } catch (error) {
    //     console.error('Ошибка:', error);
    //     showNotification('Не удалось загрузить заказы', 'error');
    // }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

function renderOrders() {
    const tableBody = document.getElementById('ordersTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = currentOrders.length === 0 
        ? '<tr><td colspan="6" style="text-align: center;">У вас пока нет заказов</td></tr>'
        : currentOrders.map((order, index) => createOrderRow(order, index)).join('');
}

function getDishInfo(id) {
    if (!id || !Array.isArray(menuItems)) return null;
    const item = menuItems.find(item => Number(item.id) == Number(id));
    return item ? { name: item.name, price: item.price } : null;
}

function createOrderRow(order, index) {
    const dishes = [
        getDishInfo(order.main_course_id),
        getDishInfo(order.drink_id),
        order.salad_id ? getDishInfo(order.salad_id) : null,
        order.soup_id ? getDishInfo(order.soup_id) : null,
        order.dessert_id ? getDishInfo(order.dessert_id) : null
    ].filter(Boolean);

    const totalPrice = dishes.reduce((sum, dish) => sum + (dish?.price || 0), 0);
    
    const deliveryTime = order.delivery_type === 'now' 
        ? '<span class="delivery-time-now">с 7:00 до 23:00</span>'
        : formatTime(order.delivery_time);

        return `
        <tr>
            <td>${order.id || index + 1}</td>
            <td>${formatDate(order.created_at)}</td>
            <td>${dishes.map(d => d.name).join(', ')}</td>
            <td>${totalPrice}₽</td>
            <td>${deliveryTime}</td>
            <td>
                <div class="order-actions">
                    <button class="action-btn view-btn" data-id="${order.id}" title="Просмотр">
                        <i class="bi bi-eye-fill"></i>
                    </button>
                    <button class="action-btn edit-btn" data-id="${order.id}" title="Редактировать">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${order.id}" title="Удалить">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function setupEventListeners() {
    // Кнопки в списке заказов
    document.addEventListener('click', (e) => {
        if (e.target.closest('.view-btn')) {
            const orderId = e.target.closest('.view-btn').dataset.id;
            showOrderDetails(orderId);
        } else if (e.target.closest('.edit-btn')) {
            const orderId = e.target.closest('.edit-btn').dataset.id;
            openEditModal(orderId);
        } else if (e.target.closest('.delete-btn')) {
            const orderId = e.target.closest('.delete-btn').dataset.id;
            openDeleteModal(orderId);
        }
    });

    // Модальные окна
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    // Кнопка ОК в просмотре
    document.querySelector('.btn-ok').addEventListener('click', () => {
        document.getElementById('viewModal').style.display = 'none';
    });

    // Кнопки в редактировании
    document.querySelector('.btn-cancel').addEventListener('click', () => {
        document.getElementById('editModal').style.display = 'none';
    });

    document.querySelector('.btn-save').addEventListener('click', async () => {
        await updateOrder();
    });

    // Радио-кнопки доставки
    document.querySelectorAll('input[name="editDeliveryType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('editTimeSelect').style.display = 
                this.value === 'by_time' ? 'block' : 'none';
        });
    });

    // Кнопки в удалении
    document.querySelector('.modal-actions .btn-cancel').addEventListener('click', () => {
        document.getElementById('deleteModal').style.display = 'none';
    });

    document.querySelector('.btn-confirm').addEventListener('click', async () => {
        await deleteOrder();
    });
}

async function showOrderDetails(orderId) {
    const order = currentOrders.find(o => o.id == orderId);
    if (!order) return;

    // Получаем данные о блюдах
    const mainDish = menuItems.find(item => item.id === order.main_course_id);
    const drink = menuItems.find(item => item.id === order.drink_id);
    const salad = order.salad_id ? menuItems.find(item => item.id === order.salad_id) : null;
    const soup = order.soup_id ? menuItems.find(item => item.id === order.soup_id) : null;
    const dessert = order.dessert_id ? menuItems.find(item => item.id === order.dessert_id) : null;

    // Формируем список блюд с ценами
    let dishesList = '';
    if (mainDish) dishesList += `${mainDish.name} (${mainDish.price}₽)<br>`;
    if (drink) dishesList += `${drink.name} (${drink.price}₽)<br>`;
    if (salad) dishesList += `${salad.name} (${salad.price}₽)<br>`;
    if (soup) dishesList += `${soup.name} (${soup.price}₽)<br>`;
    if (dessert) dishesList += `${dessert.name} (${dessert.price}₽)<br>`;

    const deliveryTime = order.delivery_type === 'by_time' 
        ? formatTime(order.delivery_time) 
        : 'Как можно скорее';

    const totalPrice = calculateOrderTotal(order);

    document.getElementById('orderDetails').innerHTML = `
        <h2>Просмотр заказа</h2>
        <p><strong>Дата оформления:</strong> ${formatDateTime(order.created_at)}</p>
        
        <h3>Доставка</h3>
        <p><strong>Имя получателя:</strong> ${order.full_name}</p>
        <p><strong>Адрес доставки:</strong> ${order.delivery_address}</p>
        <p><strong>Время доставки:</strong> ${deliveryTime}</p>
        <p><strong>Телефон:</strong> ${order.phone}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        
        ${order.comment ? `<p><strong>Комментарий:</strong> ${order.comment}</p>` : ''}
        
        <h3>Состав заказа</h3>
        ${dishesList}
        
        <p><strong>Стоимость:</strong> ${totalPrice}₽</p>
    `;

    document.getElementById('viewModal').style.display = 'block';
}

function openEditModal(orderId) {
    const order = currentOrders.find(o => o.id == orderId);
    if (!order) return;

    currentOrderId = orderId;

    document.getElementById('editOrderId').value = orderId;
    document.getElementById('editFullName').value = order.full_name;
    document.getElementById('editEmail').value = order.email;
    document.getElementById('editPhone').value = order.phone;
    document.getElementById('editAddress').value = order.delivery_address;
    document.getElementById('editComment').value = order.comment || '';

    document.querySelector(`input[name="editDeliveryType"][value="${order.delivery_type}"]`).checked = true;
    
    if (order.delivery_type === 'by_time') {
        document.getElementById('editDeliveryTime').value = order.delivery_time.substring(0, 5);
        document.getElementById('editTimeSelect').style.display = 'block';
    } else {
        document.getElementById('editTimeSelect').style.display = 'none';
    }

    document.getElementById('editModal').style.display = 'block';
}

async function updateOrder() {
    const orderId = document.getElementById('editOrderId').value;
    const deliveryType = document.querySelector('input[name="editDeliveryType"]:checked').value;

    const orderData = {
        full_name: document.getElementById('editFullName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        delivery_address: document.getElementById('editAddress').value,
        delivery_type: deliveryType,
        comment: document.getElementById('editComment').value
    };

    if (deliveryType === 'by_time') {
        orderData.delivery_time = document.getElementById('editDeliveryTime').value + ':00';
    }

    try {
        const response = await fetch(`${API_URL}/orders/${orderId}?api_key=${API_KEY}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка обновления заказа');
        }

        document.getElementById('editModal').style.display = 'none';
        showNotification('Заказ успешно изменён', 'success');
        await loadOrders();
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification(error.message || 'Не удалось изменить заказ', 'error');
    }
}

function openDeleteModal(orderId) {
    currentOrderId = orderId;
    document.getElementById('deleteModal').style.display = 'block';
}

async function deleteOrder() {
    try {
        const response = await fetch(`${API_URL}/orders/${currentOrderId}?api_key=${API_KEY}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка удаления заказа');
        }

        document.getElementById('deleteModal').style.display = 'none';
        showNotification('Заказ успешно удалён', 'success');
        await loadOrders();
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification(error.message || 'Не удалось удалить заказ', 'error');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('ru-RU');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function calculateOrderTotal(order) {
    let total = 0;
    
    if (order.main_course_id) {
        const item = menuItems.find(d => d.id === order.main_course_id);
        if (item) total += item.price;
    }
    if (order.drink_id) {
        const item = menuItems.find(d => d.id === order.drink_id);
        if (item) total += item.price;
    }
    if (order.salad_id) {
        const item = menuItems.find(d => d.id === order.salad_id);
        if (item) total += item.price;
    }
    if (order.soup_id) {
        const item = menuItems.find(d => d.id === order.soup_id);
        if (item) total += item.price;
    }
    if (order.dessert_id) {
        const item = menuItems.find(d => d.id === order.dessert_id);
        if (item) total += item.price;
    }
    
    return total;
}