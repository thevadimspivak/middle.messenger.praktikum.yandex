import Handlebars from 'handlebars';
import '../../styles/main.scss';
import { Avatar, Input, Button } from '../../components';
import { getFormValues, setupFormValidation, validatePasswordMatch } from '../../utils';

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
    avatar: new Avatar().getContent()?.outerHTML || '',
    oldPasswordInput: new Input({
      name: 'oldPassword',
      label: 'Current password',
      type: 'password',
      placeholder: 'Enter current password',
    }).getContent()?.outerHTML || '',
    newPasswordInput: new Input({
      name: 'newPassword',
      label: 'New password',
      type: 'password',
      placeholder: 'Enter new password',
    }).getContent()?.outerHTML || '',
    confirmPasswordInput: new Input({
      name: 'newPassword_confirm',
      label: 'Confirm new password',
      type: 'password',
      placeholder: 'Confirm new password',
    }).getContent()?.outerHTML || '',
    submitButton: new Button({
      type: 'primary',
      buttonType: 'submit',
      text: 'Save',
    }).getContent()?.outerHTML || '',
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = ProfilePasswordPage();

    const form = app.querySelector('.profile-form') as HTMLFormElement;
    if (form) {
      setupFormValidation(form);

      const newPasswordInput = form.querySelector('[name="newPassword"]') as HTMLInputElement;
      const confirmPasswordInput = form.querySelector('[name="newPassword_confirm"]') as HTMLInputElement;

      [newPasswordInput, confirmPasswordInput].forEach((input) => {
        input?.addEventListener('input', () => {
          const errorSpan = confirmPasswordInput?.parentElement?.querySelector('.form__error') as HTMLElement;
          if (errorSpan && errorSpan.textContent === 'Passwords do not match') {
            errorSpan.textContent = '';
            errorSpan.style.display = 'none';
          }
        });
      });

      form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = getFormValues(form);

        const passwordMatchError = validatePasswordMatch(
          formData.newPassword,
          formData.newPassword_confirm,
        );

        if (passwordMatchError) {
          const errorSpan = confirmPasswordInput?.parentElement?.querySelector('.form__error') as HTMLElement;
          if (errorSpan) {
            errorSpan.textContent = passwordMatchError;
            errorSpan.style.display = 'block';
          }
          return;
        }

        console.log('Change password form data:', formData);
      });
    }
  }
});
