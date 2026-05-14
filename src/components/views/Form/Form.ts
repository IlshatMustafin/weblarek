import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import { IFormState } from '../../../types';

/**
 * Базовый класс для управления состоянием форм, валидацией и вводом данных
 */
export class Form<T> extends Component<IFormState & T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;
    protected events: IEvents;

    /**
     * @param container Элемент формы HTMLFormElement
     * @param events Брокер событий
     */
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container);
        this.events = events;

        // Поиск обязательных элементов управления по ТЗ
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        // Слушатель изменения данных: делегирование на всю форму по ТЗ
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const fieldName = target.name;
            const value = target.value;
            // Динамически генерируем событие изменения конкретного поля
            this.events.emit(`${container.name}:${fieldName}:change`, {
                [fieldName]: value    
            });
        });

        // Слушатель отправки формы
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${container.name}:submit`);
        });
    }

    /**
     * Сеттер для управления доступностью кнопки отправки
     */
    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    /**
     * Сеттер для вывода массива текстовых ошибок валидации под полями
     */
    set errors(value: string[]) {
        this.errorsElement.textContent = value.join(', ');
    }

    /**
     * Очистка полей ввода формы
     */
    clear(): void {
        (this.container as HTMLFormElement).reset();
    }
}
