import { Input, Button, Form } from '../../components';
import { Block } from '../../core';
import { handleLinkClick, showModal } from '../../utils';
import { getErrorMessage } from '../../utils/errorHandler';
import { AuthController } from '../../controllers';
import type { LoginFormData } from '../../api/types';
import { Routes } from '../../router';

const template = `
<main class="page">
  <div class="card">
    <h1 class="card__title">Sign In</h1>
    <div class="card__form"></div>
  </div>
</main>
`;

export class LoginPage extends Block {
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

    const loginForm = new Form<LoginFormData>({
      className: 'form',
      loginInput,
      passwordInput,
      submitButton,
      onSubmit: async (formData) => {
        try {
          await AuthController.login(formData);
        } catch (error: unknown) {
          showModal(getErrorMessage(error), 'Authentication Error');
        }
      },
    });

    super('div', {
      loginForm,
      events: {
        'click a': handleLinkClick,
      },
    });
  }

  protected render(): string {
    return template;
  }

  protected componentDidMount(): void {
    this.mountComponent('.card__form', 'loginForm');

    const formElement = this.getChild<Form<LoginFormData>>('loginForm').getFormElement();
    if (formElement) {
      const linkContainer = document.createElement('div');
      linkContainer.className = 'form__actions';
      linkContainer.innerHTML = `<a href="${Routes.SignUp}">Create account</a>`;
      formElement.appendChild(linkContainer);
    }
  }
}
