import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { ISuccess, ICardActions } from '../../types';

/**
 * Класс Success отвечает за отображение финального окна успешного оформления заказа.
 * Управляет выводом подтверждённой списанной суммы и кнопкой закрытия.
 */
export class Success extends Component<ISuccess> {
    protected totalDescription: HTMLElement;
    protected closeButton: HTMLButtonElement;

    /**
     * @param container Склонированный элемент шаблона успешного заказа (.order-success)
     * @param actions Объект с коллбэком для обработки закрытия окна по паттерну учителя
     */
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        // Поиск элементов разметки согласно документации
        this.totalDescription = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        // Все слушатели устанавливаются один раз в конструкторе по ТЗ
        if (actions?.onClick) {
            this.closeButton.addEventListener('click', actions.onClick);
        }
    }

    /**
     * Сеттер для отображения текста со списанной стоимостью товаров по ТЗ
     */
    set total(value: number) {
        this.totalDescription.textContent = `Списано ${value} синериумов`;
    }
}
