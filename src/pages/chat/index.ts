import Handlebars from 'handlebars';
import '../../styles/main.scss';

const template = `
<main class="chat">
  <aside class="chat__sidebar">
    <div class="chat__header">
      <a href="/profile.html" class="chat__profile-link">Profile →</a>
    </div>
    <div class="chat__search">
      <input type="text" class="chat__search-input" placeholder="Search" />
    </div>
    <ul class="chat__list">
      {{#each chats}}
      <li class="chat__item {{#if active}}chat__item--active{{/if}}">
        {{{avatar}}}
        <div class="chat__item-info">
          <div class="chat__item-header">
            <span class="chat__item-name">{{name}}</span>
            <span class="chat__item-time">{{time}}</span>
          </div>
          <p class="chat__item-message">{{lastMessage}}</p>
        </div>
        {{#if unread}}
        <span class="chat__item-badge">{{unread}}</span>
        {{/if}}
      </li>
      {{/each}}
    </ul>
  </aside>
  <div class="chat__main">
    <div class="chat__empty">
      <p>Select a chat to start messaging</p>
    </div>
  </div>
</main>
`;

function ChatPage(): string {
  const chats: any[] = [];

  return Handlebars.compile(template)({ chats });
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = ChatPage();
  }
});
