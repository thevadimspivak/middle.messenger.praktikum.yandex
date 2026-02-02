import '../../styles/main.scss';
import { Block } from '../../core';
import { render } from '../../utils';

const template = `
<main class="error-page">
  <h1 class="error-page__code">500</h1>
  <p class="error-page__message">Something went wrong</p>
  <a href="/index.html" class="error-page__link">Back to chats</a>
</main>
`;

class Error500Page extends Block {
  constructor() {
    super('div');
  }

  protected render(): string {
    return template;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const page = new Error500Page();
  render('#app', page);
});
