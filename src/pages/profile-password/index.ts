import { Avatar, Input, Button } from '../../components';
import { Block, BlockProps } from '../../core';
import {
  getFormValues, validatePasswordMatch, handleLinkClick, showModal, getUserAvatarUrl, connect,
} from '../../utils';
import { getErrorMessage } from '../../utils/errorHandler';
import { UserController } from '../../controllers';
import router, { Routes } from '../../router';
import type { User } from '../../api/types';

const template = `
<main class="profile">
  <aside class="profile__sidebar">
    <a href="${Routes.Settings}" class="profile__back">←</a>
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

interface ProfilePasswordPageProps extends BlockProps {
  user?: User | null;
}

class ProfilePasswordPage extends Block<ProfilePasswordPageProps> {
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

    const handleSubmit = async (event: SubmitEvent) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const formData = getFormValues(form);

      const passwordMatchError = validatePasswordMatch(
        formData.newPassword,
        formData.newPassword_confirm,
      );

      if (passwordMatchError) {
        const confirmInput = form.querySelector<HTMLInputElement>('[name="newPassword_confirm"]');
        const errorSpan = confirmInput?.parentElement?.querySelector<HTMLElement>('.form__error');
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
        router.go(Routes.Settings);
      } catch (error: unknown) {
        showModal(getErrorMessage(error), 'Error');
      }
    };

    const handlePasswordInput = () => {
      const form = this.element?.querySelector<HTMLFormElement>('.profile-form');
      const confirmInput = form?.querySelector<HTMLInputElement>('[name="newPassword_confirm"]');
      const errorSpan = confirmInput?.parentElement?.querySelector<HTMLElement>('.form__error');
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
        this.getChild<Avatar>('avatar').setProps({ src: getUserAvatarUrl(user.avatar) });
      }
    }
  }

  protected componentDidUpdate(
    oldProps: ProfilePasswordPageProps,
    newProps: ProfilePasswordPageProps,
  ): boolean {
    if (oldProps.user !== newProps.user && newProps.user) {
      this.getChild<Avatar>('avatar').setProps({ src: getUserAvatarUrl(newProps.user.avatar) });
    }
    return true;
  }
}

export default connect((state) => ({ user: state.user }))(ProfilePasswordPage);
