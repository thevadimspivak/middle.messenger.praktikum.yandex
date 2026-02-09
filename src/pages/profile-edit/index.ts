import {
  Avatar, Input, Button, PhoneInput,
} from '../../components';
import { Block } from '../../core';
import {
  getFormValues, handleLinkClick, showModal, getUserAvatarUrl, connect,
} from '../../utils';
import { UserController } from '../../controllers';
import router from '../../router';

const template = `
<main class="profile">
  <aside class="profile__sidebar">
    <a href="/settings" class="profile__back">←</a>
  </aside>
  <div class="profile__content">
    <div class="profile__avatar">
      <input type="file" id="avatarInput" accept="image/*" style="display: none;" />
    </div>
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
      value: '',
    });

    const loginInput = new Input({
      name: 'login',
      label: 'Login',
      type: 'text',
      value: '',
    });

    const firstNameInput = new Input({
      name: 'first_name',
      label: 'First name',
      type: 'text',
      value: '',
    });

    const secondNameInput = new Input({
      name: 'second_name',
      label: 'Last name',
      type: 'text',
      value: '',
    });

    const displayNameInput = new Input({
      name: 'display_name',
      label: 'Display name',
      type: 'text',
      value: '',
    });

    const phoneInput = new PhoneInput({
      name: 'phone',
      label: 'Phone',
      value: '',
    });

    const submitButton = new Button({
      type: 'primary',
      buttonType: 'submit',
      text: 'Save',
    });

    const handleSubmit = async (event: Event) => {
      event.preventDefault();
      const form = (event.target as HTMLFormElement);
      const formData = getFormValues(form);

      try {
        await UserController.updateProfile(formData as any);
        router.go('/settings');
      } catch (error: any) {
        showModal(error.message, 'Error');
      }
    };

    const handleAvatarClick = () => {
      const input = document.getElementById('avatarInput') as HTMLInputElement;
      if (input) {
        input.click();
      }
    };

    const handleAvatarChange = async (e: Event) => {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0];

      if (!file) {
        return;
      }

      const formData = new FormData();
      formData.append('avatar', file);

      try {
        await UserController.updateAvatar(formData);
      } catch (error: any) {
        showModal(error.message, 'Error');
      }
    };

    super('div', {
      avatar,
      emailInput,
      loginInput,
      firstNameInput,
      secondNameInput,
      displayNameInput,
      phoneInput,
      submitButton,
      events: {
        'submit .profile-form': handleSubmit,
        'click a': handleLinkClick,
        'click .profile__avatar': handleAvatarClick,
        'change #avatarInput': handleAvatarChange,
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
      'displayNameInput',
      'phoneInput',
    ]);

    this.mountComponent('.profile-form__actions', 'submitButton');

    if (!UserController.getUser()) {
      UserController.fetchUser();
    } else {
      this.updateFromUser(UserController.getUser());
    }
  }

  protected componentDidUpdate(oldProps: any, newProps: any): boolean {
    if (oldProps.user !== newProps.user && newProps.user) {
      this.updateFromUser(newProps.user);
    }
    return false;
  }

  private updateFromUser(user: any) {
    (this.children.avatar as any).setProps({ src: getUserAvatarUrl(user.avatar) });

    (this.children.emailInput as any).setProps({ value: user.email });
    (this.children.loginInput as any).setProps({ value: user.login });
    (this.children.firstNameInput as any).setProps({ value: user.first_name });
    (this.children.secondNameInput as any).setProps({ value: user.second_name });
    (this.children.displayNameInput as any).setProps({ value: user.display_name });
    (this.children.phoneInput as any).setProps({ value: user.phone });
  }
}

export default connect((state) => ({ user: state.user }))(ProfileEditPage as any);
