import { Block } from '../../core';
import { handleLinkClick } from '../../utils';
import { Routes } from '../../router';

const template = `
<main class="error-page">
  <h1 class="error-page__code">500</h1>
  <p class="error-page__message">Something went wrong</p>
  <a href="${Routes.Messenger}" class="error-page__link">Back to chats</a>
</main>
`;

export class Error500Page extends Block {
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
