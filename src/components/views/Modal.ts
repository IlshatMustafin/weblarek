import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IModalContent {
    content: HTMLElement;
}

/**
 * Класс Modal является универсальным контейнером для отображения любого 
 * динамического контента внутри модального окна.
 */
export class Modal extends Component<IModalContent> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;
    protected events: IEvents;

    /**
     * @param container Корневой элемент разметки модального окна (.modal).
     * @param events Брокер событий для уведомления презентера.
     */
    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        // Поиск элементов управления внутри модального окна.
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);

        // Событие закрытия по клику на крестик.
        this.closeButton.addEventListener('click', () => this.close());

        // Закрытие по клику вне модального окна (на оверлей).
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        });

        // Предотвращаем закрытие при клике внутри самого контента окна.
        const modalContainer = ensureElement<HTMLElement>('.modal__container', this.container);
        modalContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    /**
     * Заменяет текущее содержимое модального окна новым элементом.
     */
    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
    }

    /**
     * Открывает модальное окно и блокирует скролл страницы.
     */
    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    /**
     * Закрывает модальное окно и восстанавливает скролл страницы.
     */
    close(): void {
        this.container.classList.remove('modal_active');
        this.contentElement.innerHTML = ''; // Очищаем контент при закрытии.
        this.events.emit('modal:close');
    }
}
