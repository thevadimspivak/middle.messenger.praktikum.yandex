import { Block } from '../../core';
import { handleLinkClick } from '../../utils';
import { Routes } from '../../router';

const template = `
<main class="error-page">
  <h1 class="error-page__code">404</h1>
  <p class="error-page__message">Page not found</p>
  <a href="${Routes.Messenger}" class="error-page__link">Back to chats</a>
</main>
`;

export class Error404Page extends Block {
  constructor() {
    super('div', {
      events: {
        'click a': handleLinkClick,
      },
    });
  }

  protected render(): string {
    return template;
  }
}
