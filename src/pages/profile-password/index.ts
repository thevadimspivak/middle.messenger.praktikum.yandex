import { Avatar, Input, Button } from '../../components';
import { Block } from '../../core';
import {
  getFormValues, validatePasswordMatch, handleLinkClick, showModal, getUserAvatarUrl, connect,
} from '../../utils';
import { UserController } from '../../controllers';
import router from '../../router';


const template = `
<main class="profile">
  <aside class="profile__sidebar">
    <a href="/settings" class="profile__back">←</a>
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

class ProfilePasswordPage extends Block {
  constructor() {
    const avatar = new Avatar();

    const oldPasswordInput = new Input({
      name: 'oldPassword',
      label: 'Current password',
      type: 'password',
      placeholder: 'Enter current password',
    });

    const newPasswordInput = new Input({
      name: 'newPassword',
      label: 'New password',
      type: 'password',
      placeholder: 'Enter new password',
    });

    const confirmPasswordInput = new Input({
      name: 'newPassword_confirm',
      label: 'Confirm new password',
      type: 'password',
      placeholder: 'Confirm new password',
    });

    const submitButton = new Button({
      type: 'primary',
      buttonType: 'submit',
      text: 'Save',
    });

    const handleSubmit = async (event: Event) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const formData = getFormValues(form);

      const passwordMatchError = validatePasswordMatch(
        formData.newPassword,
        formData.newPassword_confirm,
      );

      if (passwordMatchError) {
        const confirmInput = form.querySelector('[name="newPassword_confirm"]') as HTMLInputElement;
        const errorSpan = confirmInput?.parentElement?.querySelector('.form__error') as HTMLElement;
        if (errorSpan) {
          errorSpan.textContent = passwordMatchError;
          errorSpan.style.display = 'block';
        }
        return;
      }

      try {
        await UserController.updatePassword({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        });
        router.go('/settings');
      } catch (error: any) {
        showModal(error.message, 'Error');
      }
    };

    const handlePasswordInput = () => {
      const form = this.element?.querySelector('.profile-form') as HTMLFormElement;
      const confirmInput = form?.querySelector('[name="newPassword_confirm"]') as HTMLInputElement;
      const errorSpan = confirmInput?.parentElement?.querySelector('.form__error') as HTMLElement;
      if (errorSpan && errorSpan.textContent === 'Passwords do not match') {
        errorSpan.textContent = '';
        errorSpan.style.display = 'none';
      }
    };

    super('div', {
      avatar,
      oldPasswordInput,
      newPasswordInput,
      confirmPasswordInput,
      submitButton,
      events: {
        'submit .profile-form': handleSubmit,
        'input [name="newPassword"]': handlePasswordInput,
        'input [name="newPassword_confirm"]': handlePasswordInput,
        'click a': handleLinkClick,
      },
    });
  }

  protected render(): string {
    return template;
  }

  protected componentDidMount(): void {
    this.mountComponent('.profile__avatar', 'avatar');

    this.mountComponents('.profile-form__inputs', [
      'oldPasswordInput',
      'newPasswordInput',
      'confirmPasswordInput',
    ]);

    this.mountComponent('.profile-form__actions', 'submitButton');
    
    if (!UserController.getUser()) {
      UserController.fetchUser();
    } else {
      const user = UserController.getUser();
      if (user) {
        (this.children.avatar as any).setProps({ src: getUserAvatarUrl(user.avatar) });
      }
    }
  }

  protected componentDidUpdate(oldProps: any, newProps: any): boolean {
    if (oldProps.user !== newProps.user && newProps.user) {
      (this.children.avatar as any).setProps({ src: getUserAvatarUrl(newProps.user.avatar) });
    }
    return true;
  }
}

export default connect((state) => ({ user: state.user }))(ProfilePasswordPage as any);
