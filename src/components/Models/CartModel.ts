import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

/**
 * Класс CartModel отвечает за управление корзиной покупок.
 * Хранит товары, выбранные пользователем для покупки.
 */
export class CartModel {
  private items: IProduct[] = [];
  protected events: IEvents;

  /**
   * Создает экземпляр модели корзины.
   * @param events Брокер событий для уведомления презентера об изменениях.
   */
  constructor(events: IEvents) {
    this.events = events;
  }

  /**
   * Возвращает массив товаров, находящихся в корзине.
   * @returns - массив товаров корзины.
   */
  getItems(): IProduct[] {
    return this.items;
  }

  /**
   * Добавляет товар в корзину и триггерит событие изменения.
   * @param product - товар для добавления.
   */
  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit('basket:changed'); // Уведомляем презентер об обновлении счетчика/интерфейса.
  }

  /**
   * Удаляет товар из корзины по его идентификатору.
   * @param id - идентификатор товара для удаления.
   */
  removeItem(id: string): void {
    this.items = this.items.filter(item => item.id !== id)
    this.events.emit('basket:changed'); // Уведомляем презентер.
  }

  /**
   * Полностью очищает корзину.
   */
  clear(): void {
    this.items = [];
    this.events.emit('basket:changed'); // Уведомляем презентер.
  }

  /**
   * Считает и возвращает общую стоимость всех товаров в корзине.
   * Учитывает товары с ценой null как 0.
   * @returns — общая стоимость товаров в корзине.
   */
  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  /**
   * Возвращает количество товаров в корзине.
   * @returns — количество товаров.
   */
  getItemCount(): number {
    return this.items.length;
  }

  /**
   * Проверяет наличие товара в корзине по его идентификатору.
   * @param id — идентификатор товара для проверки.
   * @returns — true, если товар есть в корзине, иначе false.
   */
  hasItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}