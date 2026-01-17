import Handlebars from 'handlebars';
import '../../styles/main.scss';
import { Input } from '../../components/input';
import { Button } from '../../components/button';

const template = `
<div class="page">
  <div class="card">
    <h1 class="card__title">Sign In</h1>
    <form class="form">
      {{{loginInput}}}
      {{{passwordInput}}}
      <div class="form__actions">
        {{{submitButton}}}
        <a href="/register.html">Create account</a>
      </div>
    </form>
  </div>
</div>
`;

function LoginPage(): string {
  return Handlebars.compile(template)({
    loginInput: Input({
      name: 'login',
      label: 'Login',
      type: 'text',
      placeholder: 'Enter your login',
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
      text: 'Sign in',
    }),
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = LoginPage();
  }
});
