export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

/**
 * Тип, определяющий допустимые способы оплаты.
 * 'card' — оплата банковской картой.
 * 'cash' — оплата наличными при получении.
 */
export type TPayment = 'card' | 'cash';

/**
 * Интерфейс товара в каталоге.
 */
export interface IProduct {
    id: string; // уникальный идентификатор товара.
    description: string; // подробное описание товара.
    image: string; // URL изображения товара.
    title: string; // название товара.
    category: string; // категория товара.
    price: number | null; // цена товара (может быть null, если цена не указана).
}

/**
 * Ошибки валидации данных покупателя.
 */
export type TFormErrors = Partial<Record<keyof IBuyer, string>>;

/**
 * Интерфейс данных покупателя для оформления заказа.
 */
export interface IBuyer {
    payment: TPayment | null; // выбранный способ оплаты.
    email: string; // электронная почта покупателя.
    phone: string; // номер телефона покупателя.
    address: string; // адрес доставки.
}

/**
 * Ответ сервера на запрос списка товаров.
 */
export interface IGetProductsResponse {
  total: number;        // общее количество товаров на сервере.
  items: IProduct[];   // массив товаров.
}

/**
 * Запрос на создание заказа.
 * Объединяет данные покупателя с информацией о заказе.
 */
export type IOrderRequest = IBuyer & {
  items: string[];      // массив ID товаров из корзины.
  total: number;       // итоговая сумма заказа.
};

/**
 * Ответ сервера на создание заказа.
 */
export interface IOrderResponse {
  id: string;          // ID созданного заказа.
  total: number;       // подтверждённая сумма заказа.
}

// Интерфейсы для рендера
/**
 * Данные для отображения верхней панели хедера.
 */
export interface IHeader {
    counter: number; // Значение счетчика товаров в корзине.
}

/**
 * Данные для контейнера галереи каталога.
 */
export interface ICatalog {
    catalog: HTMLElement[]; // Массив готовых DOM-элементов карточек.
}

/**
 * Базовые данные для любой карточки товара.
 */
export interface ICard {
    id: string;
    title: string;
    price: number | null;
}

/**
 * Данные карточки товара для каталога.
 */
export interface ICatalogCard extends ICard {
    image: string;
    category: string;
}

/**
 * Данные элемента товара внутри корзины.
 */
export interface IBasketCard extends ICard {
    index: number;
}

/**
 * Данные для подробного просмотра товара в модальном окне.
 */
export interface ICardPreview extends ICard { // исправление от 14.05 + расширение.
    image: string;
    category: string;
    description: string;
    buttonText: string;
    buttonDisabled: boolean;
}

/**
 * Данные для модального окна-оболочки.
 */
export interface IModalContent {
    content: HTMLElement; // Элемент, который будет размещен внутри модального окна.
}

/**
 * Данные для отображения корзины.
 */
export interface IBasketView {
    items: HTMLElement[]; // Массив отрисованных строк товаров BasketCard.
    total: number;        // Итоговая стоимость.
}

/**
 * Базовое состояние для валидации любой формы.
 */
export interface IFormState {
    valid: boolean;   // Флаг доступности кнопки отправки.
    errors: string[]; // Массив текстовых сообщений об ошибках под полями.
}

/**
 * Данные формы первого шага (выбор оплаты и адрес).
 */
export interface IOrderForm {
    payment: TPayment | null;
    address: string;
}

/**
 * Данные формы второго шага (контакты пользователя).
 */
export interface IContactsForm {
    email: string;
    phone: string;
}

/**
 * Данные окна успешного оформления заказа.
 */
export interface ISuccess {
    total: number; // Списанная стоимость товаров.
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface IPage {
    locked: boolean;
}
