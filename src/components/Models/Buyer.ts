import { IBuyer, TPayment } from '../../types/index';

/**
 * Класс Buyer отвечает за хранение и валидацию данных покупателя.
 * Данные используются при оформлении заказа.
 */
export class Buyer {
  private _payment: TPayment | null = null;
  private _email: string | null = null;
  private _phone: string | null = null;
  private _address: string | null = null;

  /**
   * Обновляет данные покупателя. Позволяет обновить одно или несколько полей,
   * не затрагивая остальные.
   * @param data — объект с полями для обновления (частичное обновление).
   */
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.email !== undefined) this._email = data.email;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.address !== undefined) this._address = data.address;
  }

  /**
   * Возвращает все данные покупателя в виде объекта IBuyer.
   * Поля с null-значениями преобразуются в пустые строки для удобства использования.
   * @returns — объект с данными покупателя.
   */
  getData(): IBuyer {
    return {
      payment: this._payment || '',
      email: this._email || '',
      phone: this._phone || '',
      address: this._address || ''
    };
  }

  /**
   * Очищает все данные покупателя, устанавливая поля в null.
   */
  clear(): void {
    this._payment = null;
    this._email = null;
    this._phone = null;
    this._address = null;
  }

  /**
   * Выполняет валидацию всех полей данных покупателя.
   * Возвращает объект с сообщениями об ошибках только для невалидных полей.
   * Поле считается валидным, если оно не пустое.
   * @returns — объект, где ключи — имена полей, значения — сообщения об ошибках.
   * Если поле валидно, оно отсутствует в результате.
   */
  validate(): { [key in keyof IBuyer]?: string } {
    const errors: { [key in keyof IBuyer]?: string } = {};

    if (!this._payment) errors.payment = 'Не выбран способ оплаты';
    if (!this._email) errors.email = 'Укажите email';
    if (!this._phone) errors.phone = 'Укажите номер телефона';
    if (!this._address) errors.address = 'Укажите адрес доставки';

    return errors;
  }
}
