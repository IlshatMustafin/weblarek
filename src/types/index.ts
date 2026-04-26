export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

/**
 * Тип, определяющий допустимые способы оплаты.
 * 'card' — оплата банковской картой
 * 'cash' — оплата наличными при получении
 * '' — способ оплаты ещё не выбран (начальное состояние)
 */
export type TPayment = 'card' | 'cash' | '';

/**
 * Интерфейс товара в каталоге
 */
export interface IProduct {
    id: string; // уникальный идентификатор товара
    description: string; // подробное описание товара
    image: string; // URL изображения товара
    title: string; // название товара
    category: string; // категория товара
    price: number | null; // цена товара (может быть null, если цена не указана)
}

/**
 * Интерфейс данных покупателя для оформления заказа
 */
export interface IBuyer {
    payment: TPayment; // выбранный способ оплаты
    email: string; // электронная почта покупателя
    phone: string; // номер телефона покупателя
    address: string; // адрес доставки
}

/**
 * Ответ сервера на запрос списка товаров
 */
export interface IGetProductsResponse {
  total: number;        // общее количество товаров на сервере
  items: IProduct[];   // массив товаров
}

/**
 * Запрос на создание заказа
 * Объединяет данные покупателя с информацией о заказе
 */
export type IOrderRequest = IBuyer & {
  items: string[];      // массив ID товаров из корзины
  total: number;       // итоговая сумма заказа
};

/**
 * Ответ сервера на создание заказа
 */
export interface IOrderResponse {
  id: string;          // ID созданного заказа
  total: number;       // подтверждённая сумма заказа
}