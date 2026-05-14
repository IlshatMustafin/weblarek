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

    /**
     * @param container Элемент формы оформления заказа.
     * @param events Брокер событий.
     */
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        // Находим альтернативные кнопки выбора оплаты.
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);

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
     * Сеттер для принудительной установки адреса в инпут (например, при очистке).
     */
    set address(value: string) {
        const input = this.container.querySelector('input[name="address"]') as HTMLInputElement;
        if (input) {
            input.value = value;
        }
    }
}
