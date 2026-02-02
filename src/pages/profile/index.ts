import Handlebars from 'handlebars';
import '../../styles/main.scss';
import { Avatar } from '../../components';
import { Block, BlockProps } from '../../core';
import { render } from '../../utils';

const template = `
<main class="profile">
  <aside class="profile__sidebar">
    <a href="/index.html" class="profile__back">←</a>
  </aside>
  <div class="profile__content">
    <div class="profile__avatar"></div>
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
      <a href="/profile-edit.html" class="profile__link">Edit profile</a>
      <a href="/profile-password.html" class="profile__link">Change password</a>
      <a href="/login.html" class="profile__link profile__link--danger">Log out</a>
    </nav>
  </div>
</main>
`;

interface ProfilePageProps extends BlockProps {
  displayName?: string;
  fields?: Array<{ label: string; value: string }>;
}

class ProfilePage extends Block<ProfilePageProps> {
  constructor(props?: ProfilePageProps) {
    const avatar = new Avatar();

    const defaultProps = {
      displayName: 'Ivan',
      fields: [
        { label: 'Email', value: 'ivan@mail.com' },
        { label: 'Login', value: 'ivanivanov' },
        { label: 'First name', value: 'Ivan' },
        { label: 'Last name', value: 'Ivanov' },
        { label: 'Phone', value: '+7 (999) 999-99-99' },
      ],
      ...props,
    };

    super('div', {
      avatar,
      ...defaultProps,
    });
  }

  protected render(): string {
    return Handlebars.compile(template)({
      displayName: this.props.displayName,
      fields: this.props.fields,
    });
  }

  protected componentDidMount(): void {
    this.mountComponent('.profile__avatar', 'avatar');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const page = new ProfilePage();
  render('#app', page);
});
