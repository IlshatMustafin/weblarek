import { IBuyer, TPayment, TFormErrors } from '../../types/index';

/**
 * Класс Buyer отвечает за хранение и валидацию данных покупателя.
 * Данные используются при оформлении заказа.
 */
export class Buyer {
  private payment: TPayment | null = null;
  private email: string  = '';
  private phone: string = '';
  private address: string = '';

  /**
   * Обновляет данные покупателя. Позволяет обновить одно или несколько полей,
   * не затрагивая остальные.
   * @param data — объект с полями для обновления (частичное обновление).
   */
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
  }

  /**
   * Возвращает все данные покупателя в виде объекта IBuyer.
   * @returns — объект с данными покупателя.
   */
  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }

  /**
   * Очищает все данные покупателя.
   */
  clear(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  /**
   * Выполняет валидацию всех полей данных покупателя.
   * Возвращает объект с сообщениями об ошибках только для невалидных полей.
   * Поле считается валидным, если оно не пустое.
   * @returns — объект, где ключи — имена полей, значения — сообщения об ошибках.
   * Если поле валидно, оно отсутствует в результате.
   */
  validate(): TFormErrors {
    const errors: TFormErrors = {};

    if (!this.payment) errors.payment = 'Не выбран способ оплаты';
    if (!this.email.trim()) errors.email = 'Укажите email';
    if (!this.phone.trim()) errors.phone = 'Укажите номер телефона';
    if (!this.address.trim()) errors.address = 'Укажите адрес доставки';

    return errors;
  }
}
