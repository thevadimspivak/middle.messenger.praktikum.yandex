import Handlebars from 'handlebars';
import '../../styles/main.scss';
import { Avatar } from '../../components';
import { Block } from '../../core';
import { render, getFormValues, validateField } from '../../utils';

const template = `
<main class="chat">
  <aside class="chat__sidebar">
    <div class="chat__header">
      <a href="/profile.html" class="chat__profile-link">Profile →</a>
    </div>
    <div class="chat__search">
      <input type="text" class="chat__search-input" placeholder="Search" />
    </div>
    <ul class="chat__list">
      {{#each chats}}
      <li class="chat__item {{#if active}}chat__item--active{{/if}}">
        {{{avatar}}}
        <div class="chat__item-info">
          <div class="chat__item-header">
            <span class="chat__item-name">{{name}}</span>
            <span class="chat__item-time">{{time}}</span>
          </div>
          <p class="chat__item-message">{{lastMessage}}</p>
        </div>
        {{#if unread}}
        <span class="chat__item-badge">{{unread}}</span>
        {{/if}}
      </li>
      {{/each}}
    </ul>
  </aside>
  <div class="chat__main">
    {{#if selectedChat}}
    <div class="chat__header">
      <div class="chat__user">
        {{{selectedChat.avatar}}}
        <span class="chat__user-name">{{selectedChat.name}}</span>
      </div>
    </div>
    <div class="chat__messages">
      {{#each selectedChat.messages}}
      <div class="message {{#if isMine}}message--mine{{else}}message--other{{/if}}">
        <div class="message__content">
          <p class="message__text">{{text}}</p>
          <span class="message__time">{{time}}</span>
        </div>
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

class ChatPage extends Block {
  constructor() {
    const handleSubmit = (event: Event) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const messageInput = form.querySelector('[name="message"]') as HTMLInputElement;

      const error = validateField('message', messageInput.value);
      if (error) {
        return;
      }

      const formData = getFormValues(form);
      console.log('Chat message form data:', formData);

      form.reset();
    };

    super('div', {
      events: {
        'submit .chat__form': handleSubmit,
      },
    });
  }

  protected render(): string {
    const chats = [
      {
        avatar: new Avatar({ size: 'small' }).getContent()?.outerHTML || '',
        name: 'Unknown',
        lastMessage: '???',
        time: '04:08',
        unread: 0,
        active: true,
      },
    ];

    const selectedChat = {
      avatar: new Avatar({ size: 'small' }).getContent()?.outerHTML || '',
      name: 'Unknown',
      messages: [
        {
          text: 'See you in another life brotha',
          time: '15:16',
          isMine: false,
        },
        {
          text: '???',
          time: '23:42',
          isMine: true,
        },
      ],
    };

    return Handlebars.compile(template)({ chats, selectedChat });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const page = new ChatPage();
  render('#app', page);
});
