import Handlebars from 'handlebars';
import { Avatar, ChatInfoModal } from '../../components';
import { Block, BlockProps } from '../../core';
import {
  validateField, handleLinkClick, showModal, showPromptModal, trim, connect,
} from '../../utils';
import { getErrorMessage } from '../../utils/errorHandler';
import { ChatController } from '../../controllers';
import UserAPI from '../../api/UserAPI';
import { API_CONFIG } from '../../config';
import type { Chat, Message, User } from '../../api/types';
import { Routes } from '../../router';

const template = `
<main class="chat">
  <aside class="chat__sidebar">
    <div class="chat__header">
      <a href="${Routes.Settings}" class="chat__profile-link">Profile →</a>
      <button class="chat__new-chat-btn">New Chat</button>
    </div>
    <div class="chat__search">
      <input type="text" class="chat__search-input" placeholder="Search" />
    </div>
    <ul class="chat__list">
      {{#each chats}}
      <li class="chat__item {{#if active}}chat__item--active{{/if}}" data-chat-id="{{id}}">
        {{{avatar}}}
        <div class="chat__item-info">
          <div class="chat__item-header">
            <span class="chat__item-name">{{title}}</span>
            <span class="chat__item-time">{{time}}</span>
          </div>
          <p class="chat__item-message">{{lastMessage}}</p>
        </div>
        {{#if unread_count}}
        <span class="chat__item-badge">{{unread_count}}</span>
        {{/if}}
      </li>
      {{/each}}
    </ul>
  </aside>
  <div class="chat__main">
    {{#if selectedChat}}
    <div class="chat__header">
      <div class="chat__user">
        <div class="chat__avatar-wrapper" data-chat-id="{{selectedChat.id}}">
          {{{selectedChat.avatar}}}
        </div>
        <span class="chat__user-name">{{selectedChat.title}}</span>
      </div>
      <div class="chat__actions">
        <button class="chat__add-user-btn">Add User</button>
        <button class="chat__remove-user-btn">Remove User</button>
        <button class="chat__delete-btn">Delete Chat</button>
      </div>
    </div>
    <div class="chat__messages">
      {{#each messages}}
      <div class="chat__message {{#if isOwn}}chat__message--own{{/if}}">
        <div class="chat__message-content">{{content}}</div>
        <div class="chat__message-time">{{time}}</div>
      </div>
      {{/each}}
    </div>
    <div class="chat__input">
      <form class="chat__form">
        <input 
          type="text" 
          name="message" 
          class="chat__message-input" 
          placeholder="Type a message..."
        />
        <button type="submit" class="chat__send-button">Send</button>
      </form>
    </div>
    {{else}}
    <div class="chat__empty">
      <p>Select a chat to start messaging</p>
    </div>
    {{/if}}
  </div>
</main>
`;

interface ChatPageState extends BlockProps {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  user: User | null;
}

class ChatPage extends Block<ChatPageState> {
  constructor() {
    const handleSubmit = async (event: SubmitEvent) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const messageInput = form.querySelector<HTMLInputElement>('[name="message"]');

      if (!messageInput) return;

      const validationError = validateField('message', messageInput.value);
      if (validationError) {
        return;
      }

      const message = trim(messageInput.value);
      if (!message) {
        return;
      }

      try {
        ChatController.sendMessage(message);
        form.reset();
      } catch (error: unknown) {
        showModal(getErrorMessage(error), 'Error');
      }
    };

    const handleChatClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const chatItem = target.closest('.chat__item') as HTMLElement;

      if (chatItem) {
        const chatId = parseInt(chatItem.dataset.chatId || '0', 10);
        this.selectChat(chatId);
      }
    };

    const handleNewChat = async () => {
      showPromptModal('Create New Chat', 'Enter chat name', async (title) => {
        try {
          await ChatController.createChat(title);
          await this.loadChats();
        } catch (error: unknown) {
          showModal(getErrorMessage(error), 'Error');
        }
      });
    };

    const handleDeleteChat = async () => {
      if (!this.props.selectedChat) return;

      try {
        await ChatController.deleteChat(this.props.selectedChat.id);
        this.setProps({ selectedChat: null });
        await this.loadChats();
      } catch (error: unknown) {
        showModal(getErrorMessage(error), 'Error');
      }
    };

    const handleAddUser = async () => {
      if (!this.props.selectedChat) return;

      const selectedChatId = this.props.selectedChat.id;

      showPromptModal('Add User to Chat', 'Enter user login', async (login) => {
        try {
          const users = await UserAPI.searchUsers({ login });

          if (users.length === 0) {
            showModal('User not found', 'Error');
            return;
          }

          const user = users[0];

          await ChatController.addUserToChat(selectedChatId, user.id);

          showModal(`User ${user.login} added successfully`, 'Success');
        } catch (error: unknown) {
          showModal(getErrorMessage(error), 'Error');
        }
      });
    };

    const handleRemoveUser = async () => {
      if (!this.props.selectedChat) return;

      const selectedChatId = this.props.selectedChat.id;

      showPromptModal('Remove User from Chat', 'Enter user login', async (login) => {
        try {
          const users = await UserAPI.searchUsers({ login });

          if (users.length === 0) {
            showModal('User not found', 'Error');
            return;
          }

          const user = users[0];

          await ChatController.removeUserFromChat(selectedChatId, user.id);

          showModal(`User ${user.login} removed successfully`, 'Success');
        } catch (error: unknown) {
          showModal(getErrorMessage(error), 'Error');
        }
      });
    };

    const handleAvatarClick = () => {
      if (!this.props.selectedChat) return;

      const selectedChatId = this.props.selectedChat.id;

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) return;

        const formData = new FormData();
        formData.append('chatId', selectedChatId.toString());
        formData.append('avatar', file);

        try {
          await ChatController.updateChatAvatar(selectedChatId, formData);
          await this.loadChats();

          if (this.props.selectedChat) {
            this.selectChat(this.props.selectedChat.id);
          }
        } catch (error: unknown) {
          showModal(getErrorMessage(error), 'Error');
        }
      };

      input.click();
    };

    const handleChatTitleClick = async () => {
      if (!this.props.selectedChat) return;

      try {
        const users = await ChatController.getChatUsers(this.props.selectedChat.id);

        const modal = new ChatInfoModal({
          chatTitle: this.props.selectedChat.title,
          users,
        });

        const modalElement = modal.getContent();
        if (modalElement) {
          document.body.appendChild(modalElement);
          modal.dispatchComponentDidMount();
          modal.show();
        }
      } catch (error: unknown) {
        showModal(getErrorMessage(error), 'Error');
      }
    };

    super('div', {
      chats: [],
      selectedChat: null,
      messages: [],
      user: null,
      events: {
        'submit .chat__form': handleSubmit,
        'click a': handleLinkClick,
        'click .chat__item': handleChatClick,
        'click .chat__new-chat-btn': handleNewChat,
        'click .chat__delete-btn': handleDeleteChat,
        'click .chat__add-user-btn': handleAddUser,
        'click .chat__remove-user-btn': handleRemoveUser,
        'click .chat__avatar-wrapper': handleAvatarClick,
        'click .chat__user-name': handleChatTitleClick,
      },
    });
  }

  async loadChats() {
    try {
      const chats = await ChatController.fetchChats();
      const chatsData = chats.map((chat) => {
        const avatarSrc = chat.avatar ? `${API_CONFIG.BASE_DOMAIN}${API_CONFIG.API_VERSION}/resources${chat.avatar}` : '';
        const avatar = new Avatar({ src: avatarSrc, size: 'small' });

        return {
          ...chat,
          avatarPath: chat.avatar,
          avatar: avatar.getContent()?.outerHTML || '',
          time: chat.last_message ? new Date(chat.last_message.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
          lastMessage: chat.last_message?.content || 'No messages yet',
          active: chat.id === this.props.selectedChat?.id,
        };
      });

      this.setProps({ chats: chatsData });
    } catch (error: unknown) {
      showModal(getErrorMessage(error), 'Error loading chats');
    }
  }

  async selectChat(chatId: number) {
    const chat = this.props.chats.find((c) => c.id === chatId);
    if (!chat) return;

    ChatController.disconnectFromChat();

    const avatarSrc = chat.avatarPath ? `${API_CONFIG.BASE_DOMAIN}${API_CONFIG.API_VERSION}/resources${chat.avatarPath}` : '';
    const avatar = new Avatar({ src: avatarSrc, size: 'small' });

    const selectedChat = {
      ...chat,
      avatar: avatar.getContent()?.outerHTML || '',
    };

    const chatsData = this.props.chats.map((c) => ({
      ...c,
      active: c.id === chatId,
    }));

    ChatController.selectChat(selectedChat);

    try {
      await ChatController.connectToChat(chatId);
    } catch (error: unknown) {
      console.error('Error connecting to chat:', getErrorMessage(error));
    }

    this.setProps({
      selectedChat,
      chats: chatsData,
    });
  }

  protected render(): string {
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate(this.props);
  }

  protected componentDidMount(): void {
    this.loadChats();
  }

  protected componentDidUpdate(oldProps: ChatPageState, newProps: ChatPageState): boolean {
    if (oldProps.messages !== newProps.messages) {
      this.scrollToBottom();
    }
    return true;
  }

  protected componentWillUnmount(): void {
    ChatController.disconnectFromChat();
  }

  private scrollToBottom(): void {
    const messagesContainer = this.element?.querySelector('.chat__messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }
}

const mapStateToProps = (state: Record<string, any>) => {
  const messages = (state.messages || []).map((msg: Message) => {
    const date = new Date(msg.time);
    return {
      ...msg,
      content: msg.content,
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isOwn: state.user && msg.user_id === state.user.id.toString(),
    };
  });

  return {
    messages,
    user: state.user,
  };
};

export default connect(mapStateToProps)(ChatPage);
