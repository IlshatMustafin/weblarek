import { ensureElement } from '../../../utils/utils';
import { Form } from './Form';
import { IEvents } from '../../base/Events';
import { IOrderForm } from '../../../types';

/**
 * Класс формы первого шага заказа (выбор оплаты и ввод адреса).
 */
export class OrderForm extends Form<IOrderForm> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    /**
     * @param container Элемент формы оформления заказа.
     * @param events Брокер событий.
     */
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        // Находим альтернативные кнопки выбора оплаты.
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container); // исправление от 14.05 + Находим инпут.

        // Слушатели клика устанавливаются один раз в конструкторе.
        this.cardButton.addEventListener('click', () => {
            this.events.emit('order:payment-change', { target: 'card' });
        });

        this.cashButton.addEventListener('click', () => {
            this.events.emit('order:payment-change', { target: 'cash' });
        });
    }

    /**
     * Сеттер для переключения модификатора активного способа оплаты.
     */
    set payment(value: string | null) {
        // Сбрасываем активный класс с обеих кнопок
        this.cardButton.classList.remove('button_alt-active');
        this.cashButton.classList.remove('button_alt-active');

        // Добавляем модификатор 'button_alt-active' выбранной кнопке.
        if (value === 'card') {
            this.cardButton.classList.add('button_alt-active');
        } else if (value === 'cash') {
            this.cashButton.classList.add('button_alt-active');
        }
    }

    /**
     * Сеттер установки адреса в инпут.
     */
    set address(value: string) {
        this.addressInput.value = value; // исправление от 14.05 + Запись.
    }
}
