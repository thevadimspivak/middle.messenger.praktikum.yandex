import Handlebars from 'handlebars';
import '../../styles/main.scss';
import { Avatar } from '../../components/avatar';
import { Input } from '../../components/input';
import { Button } from '../../components/button';

const template = `
<main class="profile">
  <aside class="profile__sidebar">
    <a href="/profile.html" class="profile__back">←</a>
  </aside>
  <div class="profile__content">
    <div class="profile__avatar">
      {{{avatar}}}
    </div>
    <form class="profile-form">
      {{{emailInput}}}
      {{{loginInput}}}
      {{{firstNameInput}}}
      {{{secondNameInput}}}
      {{{phoneInput}}}
      <div class="profile-form__actions">
        {{{submitButton}}}
      </div>
    </form>
  </div>
</main>
`;

function ProfileEditPage(): string {
  return Handlebars.compile(template)({
    avatar: Avatar(),
    emailInput: Input({
      name: 'email',
      label: 'Email',
      type: 'email',
      value: 'ivan@mail.com',
    }),
    loginInput: Input({
      name: 'login',
      label: 'Login',
      type: 'text',
      value: 'ivanivanov',
    }),
    firstNameInput: Input({
      name: 'first_name',
      label: 'First name',
      type: 'text',
      value: 'Ivan',
    }),
    secondNameInput: Input({
      name: 'second_name',
      label: 'Last name',
      type: 'text',
      value: 'Ivanov',
    }),
    phoneInput: Input({
      name: 'phone',
      label: 'Phone',
      type: 'tel',
      value: '+7 (999) 999-99-99',
    }),
    submitButton: Button({
      type: 'primary',
      buttonType: 'submit',
      text: 'Save',
    }),
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = ProfileEditPage();
  }
});
