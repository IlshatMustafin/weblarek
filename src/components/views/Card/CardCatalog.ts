import { ensureElement } from '../../../utils/utils';
import { categoryMap } from '../../../utils/constants';
import { Card } from './Card';
import { ICardActions, ICatalogCard } from '../../../types';

type CategoryKey = keyof typeof categoryMap;

export class CardCatalog extends Card<ICatalogCard> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        this.categoryElement.className = 'card__category';
        
        // Маппинг категорий.
        const modifier = categoryMap[value as CategoryKey] || 'card__category_other';
        this.categoryElement.classList.add(modifier);
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.title);
    }
}
