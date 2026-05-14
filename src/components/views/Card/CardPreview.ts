import { ensureElement } from '../../../utils/utils';
import { categoryMap } from '../../../utils/constants';
import { Card } from './Card';
import { ICardActions, ICardPreview } from '../../../types';

type CategoryKey = keyof typeof categoryMap;

export class CardPreview extends Card<ICardPreview> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected actionButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.actionButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        // Вешаем коллбэк на кнопку действия по ТЗ
        if (actions?.onClick) {
            this.actionButton.addEventListener('click', actions.onClick);
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.title);
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        this.categoryElement.className = 'card__category';
        const modifier = categoryMap[value as CategoryKey] || 'card__category_other';
        this.categoryElement.classList.add(modifier);
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set price(value: number | null) {
        if (value === null) {
            this.priceElement.textContent = 'Бесценно';
            this.actionButton.disabled = true;
            this.actionButton.textContent = 'Недоступно'; // Требование ТЗ
        } else {
            this.priceElement.textContent = `${value} синериумов`;
            this.actionButton.disabled = false;
        }
    }

    set isInBasket(value: boolean) {
        if (this.actionButton.textContent === 'Недоступно') return;
        this.actionButton.textContent = value ? 'Удалить из корзины' : 'В корзину';
    }
}
