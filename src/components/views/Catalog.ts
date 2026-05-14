import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { ICatalog } from '../../types';

/**
 * Класс Отвечает за отображение каталога карточек на главной странице.
 * Является контейнером, в который динамически подставляются элементы карточек.
 */
export class Catalog extends Component<ICatalog> {
    protected catalogContainer: HTMLElement;

    /**
     * @param container Корневой элемент-контейнер галереи (.gallery).
     */
    constructor(container: HTMLElement) {
        super(container);

        // Если в шаблоне есть внутренняя обертка, ищем её.
        this.catalogContainer = this.container;
    }

    /**
     * Заменяет всё содержимое контейнера переданным массивом элементов карточек.
     */
    set catalog(items: HTMLElement[]) {
        this.catalogContainer.replaceChildren(...items);
    }
}
