import Handlebars from 'handlebars';
import { Block } from '../../core';
import type { PhoneInputProps } from './types';
import { validateField } from '../../utils/validation';

const template = `
<div class="form__group">
  <label class="form__label" for="{{name}}">{{label}}</label>
  <input
    class="form__input phone-input__field"
    type="tel"
    id="{{name}}"
    name="{{name}}"
    placeholder="+7 (999) 999-99-99"
    {{#if value}}value="{{value}}"{{/if}}
  />
  <span class="form__error"></span>
</div>
`;

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');

  const normalizedDigits = digits.startsWith('8') ? `7${digits.slice(1)}` : digits;

  if (normalizedDigits.length === 0) return '';
  if (normalizedDigits.length <= 1) return `+${normalizedDigits}`;
  if (normalizedDigits.length <= 4) return `+${normalizedDigits[0]} (${normalizedDigits.slice(1)}`;
  if (normalizedDigits.length <= 7) return `+${normalizedDigits[0]} (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4)}`;
  if (normalizedDigits.length <= 9) return `+${normalizedDigits[0]} (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4, 7)}-${normalizedDigits.slice(7)}`;
  return `+${normalizedDigits[0]} (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4, 7)}-${normalizedDigits.slice(7, 9)}-${normalizedDigits.slice(9, 11)}`;
}

export class PhoneInput extends Block<PhoneInputProps> {
  constructor(props: PhoneInputProps) {
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const cursorPosition = target.selectionStart || 0;
      const oldLength = target.value.length;

      const newValue = formatPhoneNumber(target.value);
      target.value = newValue;

      const newLength = target.value.length;
      const diff = newLength - oldLength;

      target.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
    };

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
        'input .phone-input__field': handleInput,
        'blur .phone-input__field': handleBlur,
        'focus .phone-input__field': handleFocus,
        ...props.events,
      },
    });
  }

  private showError(message?: string): void {
    const errorElement = this.element?.querySelector<HTMLSpanElement>('.form__error');
    const inputElement = this.element?.querySelector<HTMLInputElement>('.phone-input__field');

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
    const errorElement = this.element?.querySelector<HTMLSpanElement>('.form__error');
    const inputElement = this.element?.querySelector<HTMLInputElement>('.phone-input__field');

    inputElement?.classList.remove('form__input--error');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  public getValue(): string {
    const input = this.element?.querySelector<HTMLInputElement>('.phone-input__field');
    return input?.value || '';
  }

  public validate(): string | null {
    const input = this.element?.querySelector<HTMLInputElement>('.phone-input__field');
    if (!input) return null;

    const error = validateField(input.name, input.value);
    this.showError(error || undefined);

    return error;
  }

  protected render(): string {
    return Handlebars.compile(template)({
      name: this.props.name,
      label: this.props.label,
      value: this.props.value || '+7',
    });
  }

  protected componentDidMount(): void {
    const input = this.element?.querySelector('input');
    if (input && (!input.value || input.value === '')) {
      input.value = '+7';
    }
  }
}
