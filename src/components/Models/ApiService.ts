// services/ApiService.ts
import { IApi, IGetProductsResponse, IOrderRequest, IOrderResponse, IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';

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
    if (!apiInstance) {
      throw new Error('ApiService: apiInstance не может быть null или undefined');
    }
    this.apiInstance = apiInstance;
  }

  /**
   * Выполняет GET‑запрос к /product/ для получения списка всех товаров
   * @returns Promise с объектом, содержащим общее количество товаров и массив товаров
   */
  async getProducts(): Promise<IGetProductsResponse> {
    const data = await this.apiInstance.get<IGetProductsResponse>('/product');
    // Добавляем CDN_URL к изображениям
    return {
      total: data.total,
      items: data.items.map(item => ({
        ...item,
        image: CDN_URL + item.image
      }))
    };
  }

  /**
   * Выполняет GET‑запрос к /product/{id} для получения данных о конкретном товаре
   * @param id Уникальный идентификатор товара
   * @returns Promise с объектом товара или null, если товар не найден (404)
   */
  async getProductById(id: string): Promise<IProduct | null> {
    try {
      const item = await this.apiInstance.get<IProduct>(`/product/${id}`);
      return {
        ...item,
        image: CDN_URL + item.image
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Отправляет POST‑запрос к /order/ с данными заказа
   * @param orderData Данные заказа, включающие информацию о покупателе и заказе
   * @returns Promise с объектом подтверждения заказа (ID и сумма)
   */
  async placeOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
    return this.apiInstance.post<IOrderResponse>('/order/', orderData);
  }
}