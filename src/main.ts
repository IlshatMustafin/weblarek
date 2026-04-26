import './scss/styles.scss';

import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';
// Импорты для работы с API
import { Api } from './components/base/Api';
import { ApiService } from './components/Models/ApiService';
// Импортируем настройки из констант
import { API_URL } from './utils/constants';


// Создаём экземпляры классов-моделей данных
const catalogModel = new Catalog();
const cartModel = new Cart();
const buyerModel = new Buyer();

// 1. Тестируем Catalog
console.log('1. Загрузка товаров в каталог из apiProducts.items...');
catalogModel.setProducts(apiProducts.items);
console.log('Массив товаров из каталога:', catalogModel.getProducts());
console.log('\n2. Поиск товаров по ID в каталоге...');
const product1 = catalogModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('Товар 1:', product1);
console.log('\n3. Установка выбранных товаров для подробного отображения...');
if (product1) {
  catalogModel.setSelectedProduct(product1);
  console.log('Выбранный товар 1:', catalogModel.getSelectedProduct());
}

// 2. Тестируем Cart
if (product1) cartModel.addItem(product1);
console.log('Товары в корзине после добавления:', cartModel.getItems());
console.log('Количество товаров в корзине:', cartModel.getItemCount());
console.log('Общая стоимость корзины:', cartModel.getTotalPrice());
console.log('Товар 1 в корзине:', cartModel.hasItem('854cef69-976d-4c2a-a18c-2aa45046c390'));
if (product1) cartModel.removeItem(product1);
console.log('Товары в корзине после удаления Товар 1:', cartModel.getItems());
console.log('Количество товаров в корзине:', cartModel.getItemCount());
if (product1) cartModel.addItem(product1);
console.log('Товары в корзине после добавления:', cartModel.getItems());
cartModel.clear();
console.log('Корзина после очистки:', cartModel.getItems());

// 3. Тестируем Bayer
console.log('1. Установка данных покупателя...');
buyerModel.setData({
  payment: 'card',
  email: 'iltafi@yandex.ru',
  phone: '+7 (999) 123-45-67',
  address: 'г. Н, ул. Широкая, д. 6'
});
console.log('Данные покупателя после установки:', buyerModel.getData());
console.log('Ошибки валидации (полные данные):', buyerModel.validate());
console.log('\n2. Валидация с неполными данными...');
buyerModel.clear();
buyerModel.setData({ email: 'test@example.com' });
console.log('Ошибки валидации (неполные данные):', buyerModel.validate());

// 4. Тестируем Api
console.log('--- ЗАГРУЗКА ДАННЫХ С СЕРВЕРА ---');

// Инициализация API‑экземпляра с использованием константы API_URL
const apiInstance = new Api(API_URL);

// Создание сервиса для работы с API
const apiService = new ApiService(apiInstance);

async function loadRealProductsFromServer() {
  try {
    console.log(`Запрос к серверу: ${API_URL}`);

    // Выполняем запрос к серверу через ApiService
    const productsResponse = await apiService.getProducts();

    // Сохраняем массив товаров (с уже пропатченными картинками) в модель
    catalogModel.setProducts(productsResponse.items);

    console.log('Данные успешно загружены и сохранены в модель.');
    console.log('Пример пути изображения первого товара:', catalogModel.getProducts()[0]?.image);

    // Вывод в консоль для проверки (первые 6 товара)
    catalogModel.getProducts().slice(0, 6).forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} — ${product.price ?? 'Бесценно'}`);
    });

  } catch (error) {
    console.error('Ошибка при загрузке данных с сервера:', error);
  }
}

// Запускаем загрузку
loadRealProductsFromServer();