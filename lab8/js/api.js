// filepath: /lab6/lab6/js/api.js

const API_BASE_URL = 'https://api.example.com/orders';

async function fetchDishes() {
    try {
        const response = await fetch(`${API_BASE_URL}/dishes`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching dishes:', error);
        throw error;
    }
}

async function submitOrder(orderData) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error submitting order:', error);
        throw error;
    }
}