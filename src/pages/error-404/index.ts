import Handlebars from 'handlebars';
import '../../styles/main.scss';

const template = `
<div class="error-page">
  <h1 class="error-page__code">404</h1>
  <p class="error-page__message">Page not found</p>
  <a href="/index.html" class="error-page__link">Back to chats</a>
</div>
`;

function Error404Page(): string {
  return Handlebars.compile(template)({});
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = Error404Page();
  }
});
