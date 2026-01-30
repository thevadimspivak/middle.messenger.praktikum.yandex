import Handlebars from 'handlebars';
import '../../styles/main.scss';
import { Avatar } from '../../components';

const template = `
<main class="profile">
  <aside class="profile__sidebar">
    <a href="/index.html" class="profile__back">←</a>
  </aside>
  <div class="profile__content">
    <div class="profile__avatar">
      {{{avatar}}}
    </div>
    <h1 class="profile__name">{{displayName}}</h1>
    <div class="profile__info">
      {{#each fields}}
      <div class="profile__row">
        <span class="profile__label">{{label}}</span>
        <span class="profile__value">{{value}}</span>
      </div>
      {{/each}}
    </div>
    <nav class="profile__actions">
      <a href="/profile-edit.html" class="profile__link">Edit profile</a>
      <a href="/profile-password.html" class="profile__link">Change password</a>
      <a href="/login.html" class="profile__link profile__link--danger">Log out</a>
    </nav>
  </div>
</main>
`;

function ProfilePage(): string {
  const fields = [
    { label: 'Email', value: 'ivan@mail.com' },
    { label: 'Login', value: 'ivanivanov' },
    { label: 'First name', value: 'Ivan' },
    { label: 'Last name', value: 'Ivanov' },
    { label: 'Phone', value: '+7 (999) 999-99-99' },
  ];

  return Handlebars.compile(template)({
    avatar: new Avatar().getContent()?.outerHTML || '',
    displayName: 'Ivan',
    fields,
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = ProfilePage();
  }
});
