import Handlebars from 'handlebars';
import { BaseModal, BaseModalProps } from '../base-modal';
import { Avatar } from '../avatar';
import { API_CONFIG } from '../../config';

interface ChatUser {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  avatar: string | null;
  role: string;
}

interface ChatInfoModalProps extends BaseModalProps {
  chatTitle: string;
  users: ChatUser[];
}

const template = `
<div class="modal-overlay">
  <div class="modal modal--wide">
    <h2 class="modal__title">{{chatTitle}}</h2>
    <div class="chat-info">
      <h3 class="chat-info__subtitle">Members ({{usersCount}})</h3>
      <ul class="chat-info__users">
        {{#each users}}
        <li class="chat-info__user">
          {{{avatar}}}
          <div class="chat-info__user-info">
            <div class="chat-info__user-name">
              {{#if display_name}}
                {{display_name}}
              {{else}}
                {{first_name}} {{second_name}}
              {{/if}}
            </div>
            <div class="chat-info__user-login">@{{login}}</div>
          </div>
          {{#if isAdmin}}
          <span class="chat-info__user-role">Admin</span>
          {{/if}}
        </li>
        {{/each}}
      </ul>
    </div>
    <div class="modal__buttons">
      <button class="modal__cancel">Close</button>
    </div>
  </div>
</div>
`;

export class ChatInfoModal extends BaseModal<ChatInfoModalProps> {
  constructor(props: ChatInfoModalProps) {
    const overlayCloseHandler = (e: Event) => {
      if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
        this.close();
      }
    };

    super('div', {
      ...props,
      events: {
        'click .modal__cancel': (e: Event) => {
          e.stopPropagation();
          this.close();
        },
        'click .modal-overlay': overlayCloseHandler,
      },
    });
  }

  protected render(): string {
    const usersData = this.props.users.map((user) => {
      const avatarSrc = user.avatar 
        ? `${API_CONFIG.BASE_DOMAIN}${API_CONFIG.API_VERSION}/resources${user.avatar}` 
        : '';
      const avatar = new Avatar({ src: avatarSrc, size: 'small' });
      
      return {
        ...user,
        avatar: avatar.getContent()?.outerHTML || '',
        isAdmin: user.role === 'admin',
      };
    });

    return Handlebars.compile(template)({
      chatTitle: this.props.chatTitle,
      usersCount: this.props.users.length,
      users: usersData,
    });
  }
}
