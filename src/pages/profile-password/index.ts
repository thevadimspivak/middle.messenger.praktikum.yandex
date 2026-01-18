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
      {{{oldPasswordInput}}}
      {{{newPasswordInput}}}
      {{{confirmPasswordInput}}}
      <div class="profile-form__actions">
        {{{submitButton}}}
      </div>
    </form>
  </div>
</main>
`;

function ProfilePasswordPage(): string {
  return Handlebars.compile(template)({
    avatar: Avatar(),
    oldPasswordInput: Input({
      name: 'oldPassword',
      label: 'Current password',
      type: 'password',
      placeholder: 'Enter current password',
    }),
    newPasswordInput: Input({
      name: 'newPassword',
      label: 'New password',
      type: 'password',
      placeholder: 'Enter new password',
    }),
    confirmPasswordInput: Input({
      name: 'newPassword_confirm',
      label: 'Confirm new password',
      type: 'password',
      placeholder: 'Confirm new password',
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
    app.innerHTML = ProfilePasswordPage();
  }
});
