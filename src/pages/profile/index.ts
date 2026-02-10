import Handlebars from 'handlebars';
import { Avatar } from '../../components';
import { Block, BlockProps } from '../../core';
import {
  handleLinkClick, showModal, getUserAvatarUrl, getUserDisplayName, getUserFields, connect,
} from '../../utils';
import { getErrorMessage } from '../../utils/errorHandler';
import UserAPI from '../../api/UserAPI';
import { UserController, AuthController } from '../../controllers';
import type { User } from '../../api/types';
import { Routes } from '../../router';

const template = `
<main class="profile">
  <aside class="profile__sidebar">
    <a href="${Routes.Messenger}" class="profile__back">←</a>
  </aside>
  <div class="profile__content">
    {{{avatar}}}
    <div style="display: none;">
      <input type="file" id="avatarInput" accept="image/*" />
    </div>
    <h1 class="profile__name">{{displayName}}</h1>
    <div class="profile__info">
      {{#each fields}}
      <div class="profile__row">
        <span class="profile__label">{{label}}</span>
        <span class="profile__value">{{value}}</span>
      </div>
      {{/each}}
    </div>
    <nav class="profile__actions">
      <a href="${Routes.ProfileEdit}" class="profile__link">Edit profile</a>
      <a href="${Routes.ProfilePassword}" class="profile__link">Change password</a>
      <button class="profile__link profile__link--danger profile__logout">Log out</button>
    </nav>
  </div>
</main>
`;

interface ProfilePageProps extends BlockProps {
  displayName?: string;
  fields?: Array<{ label: string; value: string }>;
  user?: User | null;
}

class ProfilePage extends Block<ProfilePageProps> {
  constructor() {
    const avatar = new Avatar();

    const handleLogout = async (e: MouseEvent) => {
      e.preventDefault();
      try {
        await AuthController.logout();
      } catch (error: unknown) {
        showModal(getErrorMessage(error), 'Error');
      }
    };

    const handleAvatarClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.avatar')) {
        const input = document.getElementById('avatarInput') as HTMLInputElement;
        if (input) {
          input.click();
        }
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
        await UserAPI.updateAvatar(formData);
        UserController.fetchUser();
        showModal('Avatar updated successfully', 'Success');
      } catch (error: unknown) {
        showModal(getErrorMessage(error), 'Error');
      }
    };

    super('div', {
      avatar,
      displayName: '',
      fields: [],
      events: {
        'click a': handleLinkClick,
        'click .profile__logout': handleLogout,
        click: handleAvatarClick,
        'change #avatarInput': handleAvatarChange,
      },
    });
  }

  protected render(): string {
    const avatarHtml = this.children.avatar ? this.children.avatar.getContent()?.outerHTML || '' : '';

    return Handlebars.compile(template)({
      avatar: avatarHtml,
      displayName: this.props.displayName || '',
      fields: this.props.fields || [],
    });
  }

  protected componentDidMount(): void {
    if (!UserController.getUser()) {
      UserController.fetchUser();
    } else {
      this.updateFromUser(UserController.getUser());
    }
  }

  protected componentDidUpdate(oldProps: ProfilePageProps, newProps: ProfilePageProps): boolean {
    if (oldProps.user !== newProps.user && newProps.user) {
      this.updateFromUser(newProps.user);
    }
    return true;
  }

  private updateFromUser(user: User) {
    this.getChild<Avatar>('avatar').setProps({ src: getUserAvatarUrl(user.avatar) });

    this.setProps({
      displayName: getUserDisplayName(user),
      fields: getUserFields(user),
    });
  }
}

export default connect((state) => ({ user: state.user }))(ProfilePage);
