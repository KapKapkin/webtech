class Category {
    constructor(name, keyword) {
        this.name = name;
        this.keyword = keyword;
    }
}

class Dish {
    constructor(keyword, name, price, category, count, image) {
        this.name = name;
        this.category = category;
        this.price = price;
        this.keyword = keyword;
        this.count = count;
        this.image = image;
    }
}


const categories = [new Category("Суп", "soup"), new Category("Главное блюдо", "main"), new Category("Напиток", "drink")];

const dishes = [
    new Dish(
        'gazpacho',
        'Гаспачо',
        195,
        categories[0],
        '350 г',
        '../imgs/soup1.jpg'
    ),
    new Dish(
        'mushroom_soup',
        'Грибной суп-пюре',
        185,
        categories[0],
        '330 г',
        '../imgs/soup2.jpg'
    ),
    new Dish(
        'norwegian_soup',
        'Норвежский суп',
        270,
        categories[0],
        '330 г',
        '../imgs/soup3.jpg'
    ),
    new Dish(
        'lasagna',
        'Лазанья',
        300,
        categories[1],
        '350 г',
        '../imgs/bludo1.jpg'
    ),
    new Dish(
        'shashlik',
        'Шашлык',
        325,
        categories[1],
        '330 г',
        '../imgs/bludo2.jpg'
    ),
    new Dish(
        'buckwheat_cutlet',
        'Гречка с котлетой',
        270,
        categories[1],
        '330 г',
        '../imgs/bludo3.jpg'
    ),
    new Dish(
        'juice',
        'Сок',
        300,
        categories[2],
        '400 мл',
        '../imgs/drink1.jpg'
    ),
    new Dish(
        'cappuccino',
        'Капучино',
        325,
        categories[2],
        '300 мл',
        '../imgs/drink2.jpg'
    ),
    new Dish(
        'water',
        'Вода',
        40,
        categories[2],
        '300 мл',
        '../imgs/drink3.jpg'
    )
]

const cart = function () {
    const out = {}
    categories.forEach(cat => {
        out[cat.keyword] = null;
    })
    return out;
}()

function printCart() {
    var count = 0;
    for (const [key, value] of Object.entries(cart)) {
        if (value != null) {
            count++;
        }
    }
    const cart_container = document.getElementById("cart-conteiner");
    cart_container.innerHTML = " ";
    var total_price = 0;

    if (count == 0) {
        const par = document.createElement("p");
        par.textContent = "Вы пока ничего не выбрали.";
        cart_container.appendChild(par);
    } else {
        for (var cat of Object.entries(categories)) {
            cat = cat[1];
            const h = document.createElement("h2");
            const p = document.createElement("p");
            h.innerHTML = cat.name;

            var dish = cart[cat.keyword];

            if (dish != null) {
                p.textContent = `${dish.name} ${dish.price}₽`;
                total_price += dish.price;

            } else {
                p.textContent = "Не выбран";
            }

            cart_container.appendChild(h);
            cart_container.appendChild(p);

        }
        const h = document.createElement("h2");
        h.innerHTML = `Стоимость заказа ${total_price}₽`
        cart_container.appendChild(h);
    }
}

function addToCart(e) {
    for (const [key, value] of Object.entries(cart)) {

        if (key == e.category.keyword) {
            cart[key] = e;
            break;
        }
    }
    console.log(cart);
    printCart();
}

function createCategoires(categories) {
    const mainContainer = document.getElementById('food-main');

    categories.forEach(cat => {
        const heading = document.createElement('h1');
        heading.textContent = `Выберите ${cat.name}`;
        mainContainer.appendChild(heading);

        const foodContainer = document.createElement('div');
        foodContainer.className = 'food-container';
        foodContainer.id = `container-${cat.keyword}`;
        mainContainer.appendChild(foodContainer);
    })
}

function createFoodSection(data) {
    data.forEach((dish) => {
        const foodContainer = document.getElementById(`container-${dish.category.keyword}`);
        const card = document.createElement('div');
        card.className = 'card';
        card.id = `card-${dish.keyword}`
        card.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}">
            <div>
                <p class="price">${dish.price}₽</p>
                <p class="name">${dish.name}</p>
                <p class="weight">${dish.count}</p>
                <button>Добавить</button>
            </div>
        `;

        foodContainer.appendChild(card);
    });
}

function addEventListeners() {
    dishes.forEach(dish => { 
        document.getElementById(`card-${dish.keyword}`).getElementsByTagName(`button`)[0].addEventListener("click", function (event) { addToCart(dish) }, false)
    })

}

window.onload = function () {
    
    
    createCategoires(categories);
    createFoodSection(dishes);
    printCart();

    addEventListeners();
}


