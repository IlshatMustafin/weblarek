import { ensureElement } from '../../../utils/utils';
import { Form } from './Form';
import { IEvents } from '../../base/Events';
import { IContactsForm } from '../../../types';

/**
 * Класс формы контактных данных пользователя перед отправкой на сервер.
 */
export class ContactsForm extends Form<IContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    /**
     * @param container Элемент формы контактов.
     * @param events Брокер событий.
     */
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        // исправление от 14.05 + Находим инпуты.
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    }

    set email(value: string) {
        this.emailInput.value = value; // исправление от 14.05 + Записываем.
    }

    set phone(value: string) {
        this.phoneInput.value = value; // исправление от 14.05 + Записываем.
    }
}
