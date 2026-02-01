import '../../styles/main.scss';
import { Block } from '../../core';
import { render } from '../../utils';

const template = `
<main class="error-page">
  <h1 class="error-page__code">404</h1>
  <p class="error-page__message">Page not found</p>
  <a href="/index.html" class="error-page__link">Back to chats</a>
</main>
`;

class Error404Page extends Block {
  constructor() {
    super('div');
  }

  protected render(): string {
    return template;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const page = new Error404Page();
  render('#app', page);
});
