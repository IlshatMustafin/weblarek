import { IApi, IGetProductsResponse, IOrderRequest, IOrderResponse } from '../../types';
/**
 * Сервис для взаимодействия с API сервера «Веб‑ларёк»
 */
export class ApiService {
  private apiInstance: IApi;

  /**
   * Создаёт экземпляр сервиса для взаимодействия с API
   * @param apiInstance Экземпляр класса `Api`, предоставляющий методы `get` и `post`
   */
  constructor(apiInstance: IApi) {
    this.apiInstance = apiInstance;
  }

  /**
   * Выполняет GET‑запрос к /product для получения списка всех товаров
   * @returns Promise с объектом, полученным от сервера (общее количество и массив товаров)
   */
  async getProducts(): Promise<IGetProductsResponse> {
    return this.apiInstance.get<IGetProductsResponse>('/product');
  }

  /**
   * Отправляет POST‑запрос к /order с данными заказа
   * @param orderData Комбинация данных покупателя (IBuyer) и информации о заказе (items, total)
   * @returns Promise с объектом подтверждения заказа (ID и сумма)
   */
  async placeOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
    return this.apiInstance.post<IOrderResponse>('/order', orderData);
  }
}