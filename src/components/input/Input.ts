import { Block } from '../../core';
import Handlebars from 'handlebars';
import type { InputProps } from './types';

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
  <span class="form__error">{{error}}</span>
</div>
`;

export class Input extends Block<InputProps> {
  constructor(props: InputProps) {
    super('div', props);
  }

  protected render(): string {
    return Handlebars.compile(template)({
      name: this.props.name,
      label: this.props.label,
      type: this.props.type || 'text',
      placeholder: this.props.placeholder || '',
      value: this.props.value || '',
      error: this.props.error || '',
    });
  }
}
