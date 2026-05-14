import './scss/styles.scss';

// Базовые компоненты
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';

// Сервис и Модели данных (Model)
import { ApiService } from './components/Models/ApiService';
import { CatalogModel } from './components/Models/CatalogModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';

// Компоненты отображения (View)
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

// Константы и утилиты
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IBuyer } from './types';

// --- Инициализация инфраструктуры приложения ---
const events = new EventEmitter();
const api = new Api(API_URL);
const apiService = new ApiService(api);

// --- Инициализация моделей данных (Model) ---
const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// --- Инициализация глобальных контейнеров и View ---
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const catalogContainer = new Catalog(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Инициализация темплейтов из HTML
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Создание экземпляров модальных компонентов View
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);

// --- ОБРАБОТЧИКИ СОБЫТИЙ МОДЕЛЕЙ ДАННЫХ (Реактивный рендер) ---

// 1. Изменение каталога товаров — отрисовка главной страницы
events.on('items:changed', (products: IProduct[]) => {
    const cards = products.map((item) => {
        return new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => {
                catalogModel.setSelectedProduct(item);
                // По ТЗ: при нажатии на карточку открывается модальное окно с превью
                const preview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
                    onClick: () => {
                        if (cartModel.hasItem(item.id)) {
                            cartModel.removeItem(item.id);
                        } else {
                            cartModel.addItem(item);
                        }
                        // По ТЗ: после нажатия кнопки покупки/удаления окно закрывается
                        modal.close();
                    }
                });

                modal.content = preview.render({
                    title: item.title,
                    image: item.image,
                    category: item.category,
                    description: item.description,
                    price: item.price,
                    isInBasket: cartModel.hasItem(item.id)
                });
                modal.open();
            }
        }).render(item);
    });

    catalogContainer.render({ catalog: cards });
});

// 2. Изменение содержимого корзины — обновление счетчика и состава
events.on('basket:changed', () => {
    // Обновляем счетчик в хедере по ТЗ
    header.counter = cartModel.getItemCount();

    // Перерисовываем элементы внутри корзины
    const basketCards = cartModel.getItems().map((item, index) => {
        return new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => cartModel.removeItem(item.id)
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

// 3. Изменение ошибок валидации данных покупателя
events.on('buyer:form-errors', (errors: Record<string, string>) => {
    const { payment, address, email, phone } = errors;
    
    // Валидация первого шага
    orderForm.render({
        valid: !payment && !address,
        errors: Object.values({ payment, address }).filter(Boolean)
    });

    // Валидация второго шага
    contactsForm.render({
        valid: !email && !phone,
        errors: Object.values({ email, phone }).filter(Boolean)
    });
});


// --- ОБРАБОТЧИКИ ДЕЙСТВИЙ ПОЛЬЗОВАТЕЛЯ (View) ---

// Открытие корзины по клику в хедере
events.on('basket:open', () => {
    modal.content = basketView.render();
    modal.open();
});

// Переход к первому шагу оформления заказа
events.on('order:open', () => {
    buyerModel.clear(); // Сбрасываем старые данные
    modal.content = orderForm.render({
        payment: null,
        address: '',
        valid: false,
        errors: []
    });
    modal.open();
});

// Изменение полей в формах
events.on(/^order:.*:change$/, (data: Partial<IBuyer>) => {
    buyerModel.setData(data);
    buyerModel.validate();
});

events.on(/^contacts:.*:change$/, (data: Partial<IBuyer>) => {
    buyerModel.setData(data);
    buyerModel.validate();
});

// Клик по кнопкам выбора оплаты в OrderForm
events.on('order:payment-change', (data: { target: string }) => {
    buyerModel.setData({ payment: data.target as 'card' | 'cash' });
    buyerModel.validate();
});

// Отправка первого шага формы -> Переход к контактам
events.on('order:submit', () => {
    modal.content = contactsForm.render({
        email: '',
        phone: '',
        valid: false,
        errors: []
    });
    modal.open();
});

// Отправка второго шага формы -> Передача заказа на сервер по ТЗ
events.on('contacts:submit', () => {
    const orderData = {
        ...buyerModel.getData(),
        items: cartModel.getItems().map(item => item.id),
        total: cartModel.getTotalPrice()
    };

    apiService.placeOrder(orderData)
        .then((res) => {
            // ТЗ шаг 2: появляется сообщение об успехе, очищается корзина и модель
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => modal.close()
            });

            modal.content = success.render({ total: res.total });
            modal.open();

            cartModel.clear();
            buyerModel.clear();
        })
        .catch((err) => {
            console.error('Ошибка оформления заказа:', err);
        });
});

// Требование ТЗ ко всем страницам: блокировка/разблокировка скролла
events.on('modal:open', () => {
    document.body.classList.add('page__wrapper_locked'); // Твой CSS-класс для блокировки скролла
});

events.on('modal:close', () => {
    document.body.classList.remove('page__wrapper_locked');
});


// --- СТАРТ ПРИЛОЖЕНИЯ (Запрос данных с сервера) ---
apiService.getProducts()
    .then((data) => {
        // Добавляем CDN_URL к изображениям товаров в презентере, как требует ТЗ
        const processedItems = data.items.map(item => ({
            ...item,
            image: CDN_URL + item.image
        }));
        
        // Передаем очищенные данные в модель, это автоматически вызовет событие items:changed
        catalogModel.setProducts(processedItems);
    })
    .catch((err) => {
        console.error('Критическая ошибка инициализации каталога:', err);
    });
