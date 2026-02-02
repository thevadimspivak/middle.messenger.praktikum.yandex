import Handlebars from 'handlebars';
import { Block } from '../../core';
import type { InputProps } from './types';
import { validateField } from '../../utils/validation';

const template = `
<div class="form__group">
  <label class="form__label" for="{{name}}">{{label}}</label>
  <input 
    class="form__input" 
    type="{{type}}" 
    id="{{name}}" 
    name="{{name}}" 
    placeholder="{{placeholder}}"
    {{#if value}}value="{{value}}"{{/if}}
  />
  <span class="form__error"></span>
</div>
`;

export class Input extends Block<InputProps> {
  constructor(props: InputProps) {
    const handleBlur = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const error = validateField(input.name, input.value);
      this.showError(error || undefined);
    };

    const handleFocus = () => {
      this.hideError();
    };

    super('div', {
      ...props,
      events: {
        'blur .form__input': handleBlur,
        'focus .form__input': handleFocus,
        ...props.events,
      },
    });
  }

  private showError(message?: string): void {
    const errorElement = this.element?.querySelector('.form__error') as HTMLSpanElement;
    const inputElement = this.element?.querySelector('.form__input') as HTMLInputElement;

    if (message) {
      inputElement?.classList.add('form__input--error');
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
      }
    } else {
      this.hideError();
    }
  }

  private hideError(): void {
    const errorElement = this.element?.querySelector('.form__error') as HTMLSpanElement;
    const inputElement = this.element?.querySelector('.form__input') as HTMLInputElement;

    inputElement?.classList.remove('form__input--error');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  public getValue(): string {
    const input = this.element?.querySelector('.form__input') as HTMLInputElement;
    return input?.value || '';
  }

  public validate(): string | null {
    const input = this.element?.querySelector('.form__input') as HTMLInputElement;
    if (!input) return null;

    const error = validateField(input.name, input.value);
    this.showError(error || undefined);

    return error;
  }

  protected render(): string {
    return Handlebars.compile(template)({
      name: this.props.name,
      label: this.props.label,
      type: this.props.type || 'text',
      placeholder: this.props.placeholder || '',
      value: this.props.value || '',
    });
  }
}
