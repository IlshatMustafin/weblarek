import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    protected counterElement: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected events: IEvents;

    /**
     * Создает экземпляр панели хедера
     * @param container Корневой DOM-элемент хедера страницы
     * @param events Брокер событий для генерации клика по корзине
     */
    constructor(container: HTMLElement, events: IEvents) {
        // Первым делом передаем контейнер в базовый абстрактный класс Component
        super(container);
        this.events = events;

        // Безопасный поиск элементов внутри контейнера хедера
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

        // Инициализация события открытия корзины по ТЗ
        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');    
        });    
    }

    /**
     * Динамически обновляет значение счетчика товаров в корзине
     */
    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}