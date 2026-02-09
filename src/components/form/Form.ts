import { Block } from '../../core';
import type { FormProps } from './types';
import { getFormValues } from '../../utils';

const template = `
<form class="{{className}}">
  <div class="form__content"></div>
</form>
`;

export class Form extends Block<FormProps> {
  constructor(props: FormProps) {
    const handleSubmit = (event: Event) => {
      event.preventDefault();

      let hasErrors = false;
      Object.values(this.children).forEach((child: any) => {
        if (typeof child.validate === 'function') {
          const error = child.validate();
          if (error) {
            hasErrors = true;
          }
        }
      });

      if (hasErrors) {
        return;
      }

      const form = event.target as HTMLFormElement;
      const formData = getFormValues(form);

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
