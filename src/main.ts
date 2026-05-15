import './scss/styles.scss';

// ==========================================
// 1. ИМПОРТЫ МОДУЛЕЙ И КОМПОНЕНТОВ
// ==========================================
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';

// Слой данных (Model)
import { ApiService } from './components/Models/ApiService';
import { CatalogModel } from './components/Models/CatalogModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';

// Слой отображения (View)
import { Page } from './components/views/Page';
import { Header } from './components/views/Header';
import { Catalog } from './components/views/Catalog';
import { CardCatalog } from './components/views/Card/CardCatalog';
import { CardPreview } from './components/views/Card/CardPreview';
import { CardBasket } from './components/views/Card/CardBasket';
import { Modal } from './components/views/Modal';
import { Basket } from './components/views/Basket';
import { OrderForm } from './components/views/Form/OrderForm';
import { ContactsForm } from './components/views/Form/ContactsForm';
import { Success } from './components/views/Success';

// Константы и утилиты.
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IBuyer } from './types';


// ==========================================
// 2. ИНИЦИАЛИЗАЦИЯ ИНФРАСТРУКТУРЫ И МОДЕЛЕЙ
// ==========================================
const events = new EventEmitter();
const api = new Api(API_URL);
const apiService = new ApiService(api);

const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);


// ==========================================
// 3. ИНИЦИАЛИЗАЦИЯ СТАТИЧНЫХ КОМПОНЕНТОВ VIEW
// ==========================================
// Глобальные контейнеры страниц
const page = new Page(document.body);
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const catalogContainer = new Catalog(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Ссылки на HTML-шаблоны (Templates)
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Экземпляры окон
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit('preview:toggle-basket')
});
const successView = new Success(cloneTemplate(successTemplate), {
    onClick: () => events.emit('success:close')
});


// ==========================================
// 4. РЕАКТИВНЫЕ СЛУШАТЕЛИ МОДЕЛЕЙ ДАННЫХ
// ==========================================

// Событие: Изменился общий список товаров каталога
events.on('items:changed', () => {
    const products = catalogModel.getProducts();
    const cards = products.map((item) => {
        return new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        }).render(item);    
    });
    catalogContainer.render({ catalog: cards });
});

// Событие: Изменился выбранный для превью товар
events.on('preview:changed', () => {
    const item = catalogModel.getSelectedProduct();
    if (!item) return;

    const isPriceNull = item.price === null;
    const isInBasket = cartModel.hasItem(item.id);

    let btnText = 'В корзину';
    if (isPriceNull) btnText = 'Недоступно';
    else if (isInBasket) btnText = 'Удалить из корзины';

    modal.content = cardPreview.render({
        title: item.title,
        image: item.image,
        category: item.category,
        description: item.description,
        price: item.price,
        buttonText: btnText,
        buttonDisabled: isPriceNull
    });
    modal.open();
});

// Событие: Изменился состав или стоимость корзины
events.on('basket:changed', () => {
    header.counter = cartModel.getItemCount();

    const basketCards = cartModel.getItems().map((item, index) => {
        return new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket:remove', item)
        }).render({
            index: index + 1,
            title: item.title,
            price: item.price
        });
    });

    basketView.render({
        items: basketCards,
        total: cartModel.getTotalPrice()
    });
});

// Событие: Изменились данные полей или ошибки валидации покупателя
events.on('buyer:changed', () => {
    const buyerData = buyerModel.getData();    
    const errors = buyerModel.validate();
    const { payment, address, email, phone } = errors;

    const orderErrors = Object.values({ payment, address }).filter(Boolean) as string[];
    const contactsErrors = Object.values({ email, phone }).filter(Boolean) as string[];
    
    orderForm.render({
        payment: buyerData.payment,
        address: buyerData.address,
        valid: !payment && !address,
        errors: orderErrors
    });

    contactsForm.render({
        email: buyerData.email,
        phone: buyerData.phone,
        valid: !email && !phone,
        errors: contactsErrors
    });
});


// ==========================================
// 5. ОБРАБОТЧИКИ ДЕЙСТВИЙ ПОЛЬЗОВАТЕЛЯ (UI)
// ==========================================

// Пользователь выбрал карточку для детального просмотра
events.on('card:select', (item: IProduct) => {
    catalogModel.setSelectedProduct(item);
});

// Пользователь нажал по кнопке корзины в превью
events.on('preview:toggle-basket', () => {
    const item = catalogModel.getSelectedProduct();
    if (!item) return;

    if (cartModel.hasItem(item.id)) {
        cartModel.removeItem(item.id);
    } else {
        cartModel.addItem(item);
    }
    modal.close();
});

// Пользователь нажал кнопку удаления строки внутри корзины
events.on('basket:remove', (item: IProduct) => {
    cartModel.removeItem(item.id);
});

// Пользователь кликнул на иконку корзины в шапке сайта
events.on('basket:open', () => {
    modal.content = basketView.render();
    modal.open();
});

// Пользователь кликнул «Оформить» в окне корзины
events.on('order:open', () => {
    modal.content = orderForm.render();
    modal.open();
    buyerModel.setData({});
});

// Пользователь вводит символы в форму первого шага (адрес)
events.on(/^order:.*:change$/, (data: Partial<IBuyer>) => {
    buyerModel.setData(data);
});

// Пользователь переключает кнопки выбора типа оплаты
events.on('order:payment-change', (data: { target: string }) => {
    buyerModel.setData({ payment: data.target as 'card' | 'cash' });
});

// Пользователь нажал кнопку «Далее» на форме адреса
events.on('order:submit', () => {
    modal.content = contactsForm.render();
    modal.open();
});

// Пользователь вводит символы в форму второго шага (контакты)
events.on(/^contacts:.*:change$/, (data: Partial<IBuyer>) => {
    buyerModel.setData(data);
});

// Пользователь нажал кнопку «Оплатить» (Завершение заказа)
events.on('contacts:submit', () => {
    const orderData = {
        ...buyerModel.getData(),
        items: cartModel.getItems().map(item => item.id),
        total: cartModel.getTotalPrice()
    };

    apiService.placeOrder(orderData)
        .then((res) => {
            modal.content = successView.render({ total: res.total });
            modal.open();

            cartModel.clear();
            buyerModel.clear();
        })
        .catch((err) => {
            console.error('Ошибка оформления заказа:', err);
        });
});

// Пользователь закрыл финальное окно успешной оплаты
events.on('success:close', () => {
    modal.close();
});

// Глобальное управление скроллом через пассивный компонент представления Page
events.on('modal:open', () => {
    page.render({ locked: true });
});

events.on('modal:close', () => {
    page.render({ locked: false });
});


// ==========================================
// 6. ЗАПУСК И ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// ==========================================
apiService.getProducts()
    .then((data) => {
        const processedItems = data.items.map(item => ({
            ...item,
            image: CDN_URL + item.image
        }));
        catalogModel.setProducts(processedItems);
    })
    .catch((err) => {
        console.error('Критическая ошибка инициализации каталога:', err);
    });
