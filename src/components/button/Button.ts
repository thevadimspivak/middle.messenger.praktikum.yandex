import Handlebars from 'handlebars';
import { Block } from '../../core';
import type { ButtonProps } from './types';

const template = `
  <button class="button button--{{type}}" type="{{buttonType}}">
    {{text}}
  </button>
`;

export class Button extends Block<ButtonProps> {
  constructor(props: ButtonProps) {
    super('div', props);
  }

  protected render(): string {
    return Handlebars.compile(template)({
      text: this.props.text,
      type: this.props.type || 'primary',
      buttonType: this.props.buttonType || 'button',
    });
  }
}
