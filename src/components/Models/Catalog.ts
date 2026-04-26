import { IProduct } from '../../types/index';

/**
 * Класс Catalog отвечает за хранение и управление товарами в каталоге.
 */
export class Catalog {
  private _products: IProduct[] = [];
  private _selectedProduct: IProduct | null = null;

  /**
   * Сохраняет массив товаров в модели.
   * @param products — массив товаров для сохранения.
   */
  setProducts(products: IProduct[]): void {
    this._products = products;
  }

  /**
   * Возвращает массив всех товаров из каталога.
   * @returns — массив товаров.
   */
  getProducts(): IProduct[] {
    return this._products;
  }

  /**
   * Находит и возвращает товар по его идентификатору.
   * @param id — идентификатор товара.
   * @returns — найденный товар или undefined, если не найден.
   */
  getProductById(id: string): IProduct | undefined {
    return this._products.find(product => product.id === id);
  }

  /**
   * Сохраняет товар для подробного отображения.
   * @param product — товар, который нужно отобразить.
   */
  setSelectedProduct(product: IProduct): void {
    this._selectedProduct = product;
  }

  /**
   * Возвращает товар, выбранный для подробного отображения.
   * @returns — выбранный товар или null, если ни один не выбран.
   */
  getSelectedProduct(): IProduct | null {
    return this._selectedProduct;
  }
}
