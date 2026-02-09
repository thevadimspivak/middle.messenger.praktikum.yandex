import Handlebars from 'handlebars';
import { BaseModal, BaseModalProps } from '../base-modal';
import { trim } from '../../utils';

interface PromptModalProps extends BaseModalProps {
  title: string;
  placeholder: string;
  onSubmit: (value: string) => void;
}

const template = `
<div class="modal-overlay">
  <div class="modal">
    <h2 class="modal__title">{{title}}</h2>
    <input 
      type="text" 
      class="modal__input" 
      placeholder="{{placeholder}}"
      name="promptInput"
    />
    <div class="modal__buttons">
      <button class="modal__submit">Submit</button>
      <button class="modal__cancel">Cancel</button>
    </div>
  </div>
</div>
`;

export class PromptModal extends BaseModal<PromptModalProps> {
  constructor(props: PromptModalProps) {
    const overlayCloseHandler = (e: Event) => {
      if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
        this.close();
      }
    };

    super('div', {
      ...props,
      events: {
        'click .modal__submit': (e: Event) => {
          e.stopPropagation();
          this.handleSubmit();
        },
        'click .modal__cancel': (e: Event) => {
          e.stopPropagation();
          this.close();
        },
        'click .modal-overlay': overlayCloseHandler,
        'keydown .modal__input': (e: Event) => {
          const keyEvent = e as KeyboardEvent;
          if (keyEvent.key === 'Enter') {
            keyEvent.preventDefault();
            this.handleSubmit();
          }
        },
      },
    });
  }

  handleSubmit() {
    const input = this.element?.querySelector('.modal__input') as HTMLInputElement;
    const value = input?.value ? trim(input.value) : '';
    
    if (value && this.props.onSubmit) {
      this.props.onSubmit(value);
      this.close();
    }
  }

  protected render(): string {
    return Handlebars.compile(template)({
      title: this.props.title,
      placeholder: this.props.placeholder,
    });
  }

  show() {
    super.show();
    setTimeout(() => {
      const input = this.element?.querySelector('.modal__input') as HTMLInputElement;
      input?.focus();
    }, 100);
  }
}
