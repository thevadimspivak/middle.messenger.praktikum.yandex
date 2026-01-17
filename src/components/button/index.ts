import Handlebars from 'handlebars';

const template = `<button class="button button--{{type}}" type="{{buttonType}}">{{text}}</button>`;

export function Button(props: any): string {
  return Handlebars.compile(template)(props);
}
