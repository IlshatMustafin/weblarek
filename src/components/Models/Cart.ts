import { IProduct } from '../../types/index';

/**
 * Класс Cart отвечает за управление корзиной покупок.
 * Хранит товары, выбранные пользователем для покупки.
 */
export class Cart {
  private _items: IProduct[] = [];

  /**
   * Возвращает массив товаров, находящихся в корзине.
   * @returns — массив товаров корзины.
   */
  getItems(): IProduct[] {
    return this._items;
  }

  /**
   * Добавляет товар в корзину.
   * @param product — товар для добавления.
   */
  addItem(product: IProduct): void {
    this._items.push(product);
  }

  /**
   * Удаляет товар из корзины. Удаляет первое вхождение товара с совпадающим id.
   * @param product — товар для удаления.
   */
  removeItem(product: IProduct): void {
    const index = this._items.findIndex(item => item.id === product.id);
    if (index !== -1) {
      this._items.splice(index, 1);
    }
  }

  /**
   * Полностью очищает корзину.
   */
  clear(): void {
    this._items = [];
  }

  /**
   * Считает и возвращает общую стоимость всех товаров в корзине.
   * Учитывает только товары с указанной ценой (не null).
   * @returns — общая стоимость товаров в корзине.
   */
  getTotalPrice(): number {
    return this._items.reduce((total, product) => {
      return product.price !== null ? total + product.price : total;
    }, 0);
  }

  /**
   * Возвращает количество товаров в корзине (с учётом дубликатов).
   * @returns — количество товаров.
   */
  getItemCount(): number {
    return this._items.length;
  }

  /**
   * Проверяет наличие товара в корзине по его идентификатору.
   * @param id — идентификатор товара для проверки.
   * @returns — true, если товар есть в корзине, иначе false.
   */
  hasItem(id: string): boolean {
    return this._items.some(item => item.id === id);
  }
}
