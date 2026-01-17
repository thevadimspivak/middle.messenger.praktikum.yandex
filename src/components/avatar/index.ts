import Handlebars from 'handlebars';

const template = `
<div class="avatar">
  {{#if src}}
    <img class="avatar__image" src="{{src}}" alt="Avatar" />
  {{else}}
    <svg class="avatar__icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  {{/if}}
</div>
`;

export function Avatar(props: any = {}): string {
  return Handlebars.compile(template)(props);
}
