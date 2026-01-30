import Handlebars from 'handlebars';
import '../../styles/main.scss';
import {
  Avatar, Input, Button, PhoneInput, setupPhoneMask,
} from '../../components';
import { getFormValues, setupFormValidation } from '../../utils';

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
    avatar: new Avatar().getContent()?.outerHTML || '',
    emailInput: new Input({
      name: 'email',
      label: 'Email',
      type: 'email',
      value: 'ivan@mail.com',
    }).getContent()?.outerHTML || '',
    loginInput: new Input({
      name: 'login',
      label: 'Login',
      type: 'text',
      value: 'ivanivanov',
    }).getContent()?.outerHTML || '',
    firstNameInput: new Input({
      name: 'first_name',
      label: 'First name',
      type: 'text',
      value: 'Ivan',
    }).getContent()?.outerHTML || '',
    secondNameInput: new Input({
      name: 'second_name',
      label: 'Last name',
      type: 'text',
      value: 'Ivanov',
    }).getContent()?.outerHTML || '',
    phoneInput: new PhoneInput({
      name: 'phone',
      label: 'Phone',
      value: '+7 (999) 999-99-99',
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
    app.innerHTML = ProfileEditPage();

    const form = app.querySelector('.profile-form') as HTMLFormElement;
    if (form) {
      setupFormValidation(form);

      const phoneInput = form.querySelector('[name="phone"]') as HTMLInputElement;
      if (phoneInput) {
        setupPhoneMask(phoneInput);
      }

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = getFormValues(form);
        console.log('Profile edit form data:', formData);
      });
    }
  }
});
