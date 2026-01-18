import Handlebars from 'handlebars';

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

export function Input(props: any): string {
  return Handlebars.compile(template)(props);
}
