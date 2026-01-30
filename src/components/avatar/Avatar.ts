import { Block } from '../../core';
import Handlebars from 'handlebars';
import type { AvatarProps } from './types';

const template = `
<div class="avatar {{#if size}}avatar--{{size}}{{/if}}">
  {{#if src}}
    <img class="avatar__image" src="{{src}}" alt="Avatar" />
  {{else}}
    <svg class="avatar__icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  {{/if}}
</div>
`;

export class Avatar extends Block<AvatarProps> {
  constructor(props: AvatarProps = {}) {
    super('div', props);
  }

  protected render(): string {
    return Handlebars.compile(template)({
      src: this.props.src || '',
      size: this.props.size || '',
    });
  }
}
