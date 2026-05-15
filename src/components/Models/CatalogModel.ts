import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

/**
 * Класс CatalogModel отвечает за хранение и управление товарами в каталоге.
 */
export class CatalogModel {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;
  protected events: IEvents;

   /**
   * Создает экземпляр модели каталога
   * @param events Брокер событий для уведомления презентера об изменениях
   */
  constructor(events: IEvents) {
    this.events = events;
  }
  
  /**
   * Сохраняет массив товаров в модели и инициирует событие обновления.
   * @param products — массив товаров для сохранения.
   */
  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit('items:changed'); // исправление от 14.05 - Только событие.
  }

  /**
   * Возвращает массив всех товаров из каталога.
   * @returns — массив товаров.
   */
  getProducts(): IProduct[] {
    return this.products;
  }

  /**
   * Находит и возвращает товар по его идентификатору.
   * @param id — идентификатор товара.
   * @returns — найденный товар или undefined, если не найден.
   */
  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }

  /**
   * Сохраняет товар для подробного отображения.
   * @param product — товар, который нужно отобразить.
   */
  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit('preview:changed'); // исправление от 14.05 - Только событие.
  }

  /**
   * Возвращает товар, выбранный для подробного отображения.
   * @returns — выбранный товар или null, если ни один не выбран.
   */
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}