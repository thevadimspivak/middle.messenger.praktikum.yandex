import Handlebars from 'handlebars';
import '../../styles/main.scss';
import { Input } from '../../components/input';
import { Button } from '../../components/button';

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
    emailInput: Input({
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
    }),
    loginInput: Input({
      name: 'login',
      label: 'Login',
      type: 'text',
      placeholder: 'Enter your login',
    }),
    firstNameInput: Input({
      name: 'first_name',
      label: 'First name',
      type: 'text',
      placeholder: 'Enter your first name',
    }),
    secondNameInput: Input({
      name: 'second_name',
      label: 'Last name',
      type: 'text',
      placeholder: 'Enter your last name',
    }),
    phoneInput: Input({
      name: 'phone',
      label: 'Phone',
      type: 'tel',
      placeholder: '+7 (999) 999-99-99',
    }),
    passwordInput: Input({
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
    }),
    submitButton: Button({
      type: 'primary',
      buttonType: 'submit',
      text: 'Register',
    }),
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = RegisterPage();
  }
});
