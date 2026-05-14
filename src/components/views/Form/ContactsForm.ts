import { Form } from './Form';
import { IEvents } from '../../base/Events';
import { IContactsForm } from '../../../types';

/**
 * Класс формы контактных данных пользователя перед отправкой на сервер.
 */
export class ContactsForm extends Form<IContactsForm> {
    /**
     * @param container Элемент формы контактов.
     * @param events Брокер событий.
     */
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        // Конструктор делегирует всю работу по поиску и навешиванию инпутов родителю Form.
    }

    set email(value: string) {
        const input = this.container.querySelector('input[name="email"]') as HTMLInputElement;
        if (input) {
            input.value = value;
        }
    }

    set phone(value: string) {
        const input = this.container.querySelector('input[name="phone"]') as HTMLInputElement;
        if (input) {
            input.value = value;
        }
    }
}
