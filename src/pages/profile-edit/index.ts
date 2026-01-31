import '../../styles/main.scss';
import {
  Avatar, Input, Button, PhoneInput,
} from '../../components';
import { Block } from '../../core';
import { render } from '../../utils';
import { getFormValues, setupFormValidation } from '../../utils';

const template = `
<main class="profile">
  <aside class="profile__sidebar">
    <a href="/profile.html" class="profile__back">←</a>
  </aside>
  <div class="profile__content">
    <div class="profile__avatar"></div>
    <form class="profile-form">
      <div class="profile-form__inputs"></div>
      <div class="profile-form__actions"></div>
    </form>
  </div>
</main>
`;

class ProfileEditPage extends Block {
  constructor() {
    const avatar = new Avatar();

    const emailInput = new Input({
      name: 'email',
      label: 'Email',
      type: 'email',
      value: 'ivan@mail.com',
    });

    const loginInput = new Input({
      name: 'login',
      label: 'Login',
      type: 'text',
      value: 'ivanivanov',
    });

    const firstNameInput = new Input({
      name: 'first_name',
      label: 'First name',
      type: 'text',
      value: 'Ivan',
    });

    const secondNameInput = new Input({
      name: 'second_name',
      label: 'Last name',
      type: 'text',
      value: 'Ivanov',
    });

    const phoneInput = new PhoneInput({
      name: 'phone',
      label: 'Phone',
      value: '+7 (999) 999-99-99',
    });

    const submitButton = new Button({
      type: 'primary',
      buttonType: 'submit',
      text: 'Save',
    });

    const handleSubmit = (event: Event) => {
      event.preventDefault();
      const form = (event.target as HTMLFormElement);
      const formData = getFormValues(form);
      console.log('Profile edit form data:', formData);
    };

    super('div', {
      avatar,
      emailInput,
      loginInput,
      firstNameInput,
      secondNameInput,
      phoneInput,
      submitButton,
      events: {
        'submit .profile-form': handleSubmit,
      },
    });
  }

  protected render(): string {
    return template;
  }

  protected componentDidMount(): void {
    this.mountComponent('.profile__avatar', 'avatar');

    this.mountComponents('.profile-form__inputs', [
      'emailInput',
      'loginInput',
      'firstNameInput',
      'secondNameInput',
      'phoneInput',
    ]);

    this.mountComponent('.profile-form__actions', 'submitButton');

    const form = this.element?.querySelector('.profile-form') as HTMLFormElement;
    if (form) {
      setupFormValidation(form);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const page = new ProfileEditPage();
  render('#app', page);
});
