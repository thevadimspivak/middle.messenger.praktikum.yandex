import Handlebars from 'handlebars';
import '../../styles/main.scss';

const template = `
<div class="error-page">
  <h1 class="error-page__code">500</h1>
  <p class="error-page__message">Something went wrong</p>
  <a href="/index.html" class="error-page__link">Back to chats</a>
</div>
`;

function Error500Page(): string {
  return Handlebars.compile(template)({});
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = Error500Page();
  }
});
