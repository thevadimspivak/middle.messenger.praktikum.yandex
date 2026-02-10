import {
  Avatar, Input, Button, PhoneInput,
} from '../../components';
import { Block, BlockProps } from '../../core';
import {
  getFormValues, handleLinkClick, showModal, getUserAvatarUrl, connect,
} from '../../utils';
import { getErrorMessage } from '../../utils/errorHandler';
import { UserController } from '../../controllers';
import router, { Routes } from '../../router';
import type { User, UpdateProfileFormData } from '../../api/types';

const template = `
<main class="profile">
  <aside class="profile__sidebar">
    <a href="${Routes.Settings}" class="profile__back">←</a>
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

interface ProfileEditPageProps extends BlockProps {
  user?: User | null;
}

class ProfileEditPage extends Block<ProfileEditPageProps> {
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

    const handleSubmit = async (event: SubmitEvent) => {
      event.preventDefault();
      const form = (event.target as HTMLFormElement);
      const formData = getFormValues<UpdateProfileFormData>(form);

      try {
        await UserController.updateProfile(formData);
        router.go(Routes.Settings);
      } catch (error: unknown) {
        showModal(getErrorMessage(error), 'Error');
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
      } catch (error: unknown) {
        showModal(getErrorMessage(error), 'Error');
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

  protected componentDidUpdate(
    oldProps: ProfileEditPageProps,
    newProps: ProfileEditPageProps,
  ): boolean {
    if (oldProps.user !== newProps.user && newProps.user) {
      this.updateFromUser(newProps.user);
    }
    return false;
  }

  private updateFromUser(user: User) {
    this.getChild<Avatar>('avatar').setProps({ src: getUserAvatarUrl(user.avatar) });

    this.getChild<Input>('emailInput').setProps({ value: user.email });
    this.getChild<Input>('loginInput').setProps({ value: user.login });
    this.getChild<Input>('firstNameInput').setProps({ value: user.first_name });
    this.getChild<Input>('secondNameInput').setProps({ value: user.second_name });
    this.getChild<Input>('displayNameInput').setProps({ value: user.display_name });
    this.getChild<PhoneInput>('phoneInput').setProps({ value: user.phone });
  }
}

export default connect((state) => ({ user: state.user }))(ProfileEditPage);
