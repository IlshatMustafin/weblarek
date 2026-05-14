import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IBasketView } from '../../types';

/**
 * Класс Basket отвечает за отображение содержимого корзины в модальном окне.
 * Управляет списком товаров, суммарной стоимостью и блокировкой кнопки оформления.
 */
export class Basket extends Component<IBasketView> {
    protected basketList: HTMLElement;
    protected totalPriceElement: HTMLElement;
    protected orderButton: HTMLButtonElement;
    protected events: IEvents;

    /**
     * @param container Склонированный элемент шаблона корзины (.basket)
     * @param events Брокер событий
     */
    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        // Поиск обязательных элементов управления по ТЗ
        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalPriceElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        // Все слушатели устанавливаются один раз в конструкторе по ТЗ
        this.orderButton.addEventListener('click', () => {
            // О действиях пользователя класс уведомляет через брокер событий
            this.events.emit('order:open');
        });
    }

    /**
     * Принимает массив готовых DOM-элементов карточек для корзины.
     * Реализует логику проверки на пустоту согласно ТЗ.
     */
    set items(cards: HTMLElement[]) {
        if (cards.length > 0) {
            // Если товары есть — динамически подставляем их элементы по ТЗ
            this.basketList.replaceChildren(...cards);
            this.orderButton.removeAttribute('disabled'); // Активируем кнопку по ТЗ
        } else {
            // Требование ТЗ: если товаров нет — выводится надпись «Корзина пуста»
            const emptyNotice = document.createElement('p');
            emptyNotice.className = 'basket__empty';
            emptyNotice.textContent = 'Корзина пуста';
            
            this.basketList.replaceChildren(emptyNotice);
            this.orderButton.setAttribute('disabled', 'true'); // Деактивируем кнопку по ТЗ
        }
    }

    /**
     * Динамически устанавливает значение итоговой стоимости товаров
     */
    set total(value: number) {
        this.totalPriceElement.textContent = `${value} синериумов`;
    }
}
