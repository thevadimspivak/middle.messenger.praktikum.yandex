import Handlebars from 'handlebars';
import { BaseModal } from '../base-modal';
import { ModalProps } from './types';

const template = `
<div class="modal-overlay">
  <div class="modal">
    {{#if title}}
    <h2 class="modal__title">{{title}}</h2>
    {{/if}}
    <p class="modal__message">{{message}}</p>
    <button class="modal__close">OK</button>
  </div>
</div>
`;

export class Modal extends BaseModal<ModalProps> {
  constructor(props: ModalProps) {
    const overlayCloseHandler = (e: Event) => {
      if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
        this.close();
      }
    };

    super('div', {
      ...props,
      events: {
        'click .modal__close': (e: Event) => {
          e.stopPropagation();
          this.close();
        },
        'click .modal-overlay': overlayCloseHandler,
      },
    });
  }

  protected render(): string {
    return Handlebars.compile(template)({
      title: this.props.title,
      message: this.props.message,
    });
  }
}
