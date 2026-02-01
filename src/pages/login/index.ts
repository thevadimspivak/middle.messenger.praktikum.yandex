import '../../styles/main.scss';
import { Input, Button } from '../../components';
import { Block } from '../../core';
import { render, getFormValues, setupFormValidation } from '../../utils';

const template = `
<main class="page">
  <div class="card">
    <h1 class="card__title">Sign In</h1>
    <form class="form">
      <div class="form__inputs"></div>
      <div class="form__actions">
        <a href="/register.html">Create account</a>
      </div>
    </form>
  </div>
</main>
`;

class LoginPage extends Block {
  constructor() {
    const loginInput = new Input({
      name: 'login',
      label: 'Login',
      type: 'text',
      placeholder: 'Enter your login',
    });

    const passwordInput = new Input({
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
    });

    const submitButton = new Button({
      type: 'primary',
      buttonType: 'submit',
      text: 'Sign in',
    });

    const handleSubmit = (event: Event) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const formData = getFormValues(form);
      console.log('Login form data:', formData);
    };

    super('div', {
      loginInput,
      passwordInput,
      submitButton,
      events: {
        'submit .form': handleSubmit,
      },
    });
  }

  protected render(): string {
    return template;
  }

  protected componentDidMount(): void {
    this.mountComponents('.form__inputs', [
      'loginInput',
      'passwordInput',
    ]);

    const actionsContainer = this.element?.querySelector('.form__actions');
    if (actionsContainer && this.children.submitButton) {
      const buttonContent = this.children.submitButton.getContent();
      if (buttonContent) {
        actionsContainer.insertBefore(buttonContent, actionsContainer.firstChild);
        this.children.submitButton.dispatchComponentDidMount();
      }
    }

    const form = this.element?.querySelector('.form') as HTMLFormElement;
    if (form) {
      setupFormValidation(form);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const page = new LoginPage();
  render('#app', page);
});
