import { Component } from '../base/Component';
import { IPage } from '../../types'; 

/**
 * Класс Page отвечает за глобальное управление состоянием всей страницы (слой View).
 * Инкапсулирует работу со стилями обертки и блокировкой скролла.
 */
export class Page extends Component<IPage> {
    /**
     * @param container Корневой элемент страницы.
     */
    constructor(container: HTMLElement) {
        super(container);
    }

    /**
     * Сеттер для блокировки или разблокировки прокрутки.
     */
    set locked(value: boolean) {
        if (value) {
            this.container.classList.add('page__wrapper_locked');
        } else {
            this.container.classList.remove('page__wrapper_locked');
        }
    }
}
