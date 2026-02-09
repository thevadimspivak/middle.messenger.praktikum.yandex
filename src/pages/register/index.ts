import {
  Input, Button, PhoneInput,
} from '../../components';
import { Block } from '../../core';
import { getFormValues, handleLinkClick, showModal } from '../../utils';
import { getErrorMessage } from '../../utils/errorHandler';
import { AuthController } from '../../controllers';
import type { SignUpFormData } from '../../api/types';
import { Routes } from '../../router';

const template = `
<main class="page">
  <div class="card">
    <h1 class="card__title">Registration</h1>
    <form class="form">
      <div class="form__inputs"></div>
      <div class="form__actions">
        <a href="${Routes.Login}">Sign in</a>
      </div>
    </form>
  </div>
</main>
`;

export class RegisterPage extends Block {
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

    const handleSubmit = async (event: Event) => {
      event.preventDefault();
      const form = (event.target as HTMLFormElement);
      const formData = getFormValues<SignUpFormData>(form);

      try {
        await AuthController.signup(formData);
      } catch (error: unknown) {
        showModal(getErrorMessage(error), 'Registration Error');
      }
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
        'click a': handleLinkClick,
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
  }
}
