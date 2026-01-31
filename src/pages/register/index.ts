import '../../styles/main.scss';
import {
  Input, Button, PhoneInput,
} from '../../components';
import { Block } from '../../core';
import { render, getFormValues, setupFormValidation } from '../../utils';

const template = `
<main class="page">
  <div class="card">
    <h1 class="card__title">Registration</h1>
    <form class="form">
      <div class="form__inputs"></div>
      <div class="form__actions">
        <a href="/login.html">Sign in</a>
      </div>
    </form>
  </div>
</main>
`;

class RegisterPage extends Block {
  constructor() {
    const emailInput = new Input({
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
    });

    const loginInput = new Input({
      name: 'login',
      label: 'Login',
      type: 'text',
      placeholder: 'Enter your login',
    });

    const firstNameInput = new Input({
      name: 'first_name',
      label: 'First name',
      type: 'text',
      placeholder: 'Enter your first name',
    });

    const secondNameInput = new Input({
      name: 'second_name',
      label: 'Last name',
      type: 'text',
      placeholder: 'Enter your last name',
    });

    const phoneInput = new PhoneInput({
      name: 'phone',
      label: 'Phone',
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
      text: 'Register',
    });

    const handleSubmit = (event: Event) => {
      event.preventDefault();
      const form = (event.target as HTMLFormElement);
      const formData = getFormValues(form);
      console.log('Register form data:', formData);
    };

    super('div', {
      emailInput,
      loginInput,
      firstNameInput,
      secondNameInput,
      phoneInput,
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
      'emailInput',
      'loginInput',
      'firstNameInput',
      'secondNameInput',
      'phoneInput',
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
  const page = new RegisterPage();
  render('#app', page);
});
