import Handlebars from 'handlebars';
import '../../styles/main.scss';
import {
  Input, Button, PhoneInput, setupPhoneMask,
} from '../../components';
import { getFormValues, setupFormValidation } from '../../utils';

const template = `
<main class="page">
  <div class="card">
    <h1 class="card__title">Registration</h1>
    <form class="form">
      {{{emailInput}}}
      {{{loginInput}}}
      {{{firstNameInput}}}
      {{{secondNameInput}}}
      {{{phoneInput}}}
      {{{passwordInput}}}
      <div class="form__actions">
        {{{submitButton}}}
        <a href="/login.html">Sign in</a>
      </div>
    </form>
  </div>
</main>
`;

function RegisterPage(): string {
  return Handlebars.compile(template)({
    emailInput: new Input({
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
    }).getContent()?.outerHTML || '',
    loginInput: new Input({
      name: 'login',
      label: 'Login',
      type: 'text',
      placeholder: 'Enter your login',
    }).getContent()?.outerHTML || '',
    firstNameInput: new Input({
      name: 'first_name',
      label: 'First name',
      type: 'text',
      placeholder: 'Enter your first name',
    }).getContent()?.outerHTML || '',
    secondNameInput: new Input({
      name: 'second_name',
      label: 'Last name',
      type: 'text',
      placeholder: 'Enter your last name',
    }).getContent()?.outerHTML || '',
    phoneInput: new PhoneInput({
      name: 'phone',
      label: 'Phone',
    }).getContent()?.outerHTML || '',
    passwordInput: new Input({
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
    }).getContent()?.outerHTML || '',
    submitButton: new Button({
      type: 'primary',
      buttonType: 'submit',
      text: 'Register',
    }).getContent()?.outerHTML || '',
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = RegisterPage();

    const form = app.querySelector('.form') as HTMLFormElement;
    if (form) {
      setupFormValidation(form);

      const phoneInput = form.querySelector('[name="phone"]') as HTMLInputElement;
      if (phoneInput) {
        setupPhoneMask(phoneInput);
      }

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = getFormValues(form);
        console.log('Register form data:', formData);
      });
    }
  }
});
