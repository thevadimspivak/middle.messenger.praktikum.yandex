import Handlebars from 'handlebars';
import '../../styles/main.scss';
import { Input, Button } from '../../components';
import { getFormValues, setupFormValidation } from '../../utils';

const template = `
<main class="page">
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
</main>
`;

class LoginPage {
  private loginInput: Input;
  private passwordInput: Input;
  private submitButton: Button;

  constructor() {
    this.loginInput = new Input({
      name: 'login',
      label: 'Login',
      type: 'text',
      placeholder: 'Enter your login',
    });

    this.passwordInput = new Input({
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
    });

    this.submitButton = new Button({
      type: 'primary',
      buttonType: 'submit',
      text: 'Sign in',
    });
  }

  render(): string {
    return Handlebars.compile(template)({
      loginInput: this.loginInput.getContent()?.outerHTML || '',
      passwordInput: this.passwordInput.getContent()?.outerHTML || '',
      submitButton: this.submitButton.getContent()?.outerHTML || '',
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    const loginPage = new LoginPage();
    app.innerHTML = loginPage.render();

    const form = app.querySelector('.form') as HTMLFormElement;
    if (form) {
      setupFormValidation(form);

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = getFormValues(form);
        console.log('Login form data:', formData);
      });
    }
  }
});
