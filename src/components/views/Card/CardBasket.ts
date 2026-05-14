import { ensureElement } from '../../../utils/utils';
import { Card } from './Card';
import { ICardActions, IBasketCard } from '../../../types';

export class CardBasket extends Card<IBasketCard> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        // Вешаем коллбэк удаления строки на крестик/корзину
        if (actions?.onClick) {
            this.deleteButton.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}
