import { Input, Button, Form } from '../../components';
import { Block } from '../../core';
import { handleLinkClick, showModal } from '../../utils';
import { AuthController } from '../../controllers';


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

    const loginForm = new Form({
      className: 'form',
      loginInput,
      passwordInput,
      submitButton,
      onSubmit: async (formData) => {
        try {
          await AuthController.login(formData as any);
        } catch (error: any) {
          showModal(error.message, 'Authentication Error');
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
    
    const formElement = (this.children.loginForm as any).getFormElement();
    if (formElement) {
      const linkContainer = document.createElement('div');
      linkContainer.className = 'form__actions';
      linkContainer.innerHTML = '<a href="/sign-up">Create account</a>';
      formElement.appendChild(linkContainer);
    }
  }
}
