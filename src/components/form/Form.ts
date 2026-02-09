import { Block } from '../../core';
import type { FormProps, Validatable } from './types';
import { getFormValues } from '../../utils';

const template = `
<form class="{{className}}">
  <div class="form__content"></div>
</form>
`;

export class Form<T = Record<string, string>> extends Block<FormProps<T>> {
  constructor(props: FormProps<T>) {
    const handleSubmit = (event: Event) => {
      event.preventDefault();

      let hasErrors = false;
      Object.values(this.children).forEach((child) => {
        if (typeof (child as Validatable).validate === 'function') {
          const error = (child as Validatable).validate?.();
          if (error) {
            hasErrors = true;
          }
        }
      });

      if (hasErrors) {
        return;
      }

      const form = event.target as HTMLFormElement;
      const formData = getFormValues(form) as T;

      if (this.props.onSubmit) {
        this.props.onSubmit(formData);
      }
    };

    super('div', {
      ...props,
      events: {
        submit: handleSubmit,
        ...props.events,
      },
    });
  }

  protected render(): string {
    return template
      .replace('{{className}}', this.props.className || 'form');
  }

  protected componentDidMount(): void {
    const content = this.element?.querySelector('.form__content');
    if (content) {
      Object.keys(this.children).forEach((key) => {
        const child = this.children[key];
        const childContent = child?.getContent();
        if (childContent) {
          content.appendChild(childContent);
          child.dispatchComponentDidMount();
        }
      });
    }
  }

  public getFormElement(): HTMLFormElement | null {
    return this.element?.querySelector('form') || null;
  }
}
