import ChatAPI from '../api/ChatAPI';
import store from '../core/Store';
import webSocketService, { WSEvents } from '../core/WebSocketService';

class ChatController {
  private currentChatId: number | null = null;

  private messageHandler: ((data: any) => void) | null = null;

  async fetchChats() {
    try {
      const chats = await ChatAPI.getChats();
      store.set('chats', chats);
      return chats;
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      throw error;
    }
  }

  getChats() {
    return store.getState().chats || [];
  }

  async createChat(title: string) {
    await ChatAPI.createChat({ title });
    await this.fetchChats();
  }

  async deleteChat(chatId: number) {
    await ChatAPI.deleteChat({ chatId });
    await this.fetchChats();

    const selectedChat = this.getSelectedChat();
    if (selectedChat?.id === chatId) {
      store.set('selectedChat', null);
    }

    const cachedTokens = store.getState().chatTokens || {};
    delete cachedTokens[chatId];
    store.set('chatTokens', { ...cachedTokens });

    const cachedMessages = store.getState().chatMessages || {};
    delete cachedMessages[chatId];
    store.set('chatMessages', { ...cachedMessages });

    const cachedUsers = store.getState().chatUsers || {};
    delete cachedUsers[chatId];
    store.set('chatUsers', { ...cachedUsers });
  }

  selectChat(chat: any) {
    store.set('selectedChat', chat);
  }

  getSelectedChat() {
    return store.getState().selectedChat;
  }

  async addUserToChat(chatId: number, userId: number) {
    await ChatAPI.addUsersToChat({ users: [userId], chatId });

    const cachedUsers = store.getState().chatUsers || {};
    delete cachedUsers[chatId];
    store.set('chatUsers', { ...cachedUsers });
  }

  async removeUserFromChat(chatId: number, userId: number) {
    await ChatAPI.deleteUsersFromChat({ users: [userId], chatId });

    const cachedUsers = store.getState().chatUsers || {};
    delete cachedUsers[chatId];
    store.set('chatUsers', { ...cachedUsers });
  }

  async getChatUsers(chatId: number) {
    const cachedUsers = store.getState().chatUsers || {};

    if (cachedUsers[chatId]) {
      return cachedUsers[chatId];
    }

    const users = await ChatAPI.getChatUsers(chatId);

    store.set('chatUsers', {
      ...cachedUsers,
      [chatId]: users,
    });

    return users;
  }

  async updateChatAvatar(chatId: number, formData: FormData) {
    formData.append('chatId', chatId.toString());
    const chat = await ChatAPI.updateChatAvatar(formData);
    await this.fetchChats();
    return chat;
  }

  async getChatToken(chatId: number) {
    const cachedTokens = store.getState().chatTokens || {};

    if (cachedTokens[chatId]) {
      return cachedTokens[chatId];
    }

    const response = await ChatAPI.getChatToken(chatId);
    const { token } = response;

    store.set('chatTokens', {
      ...cachedTokens,
      [chatId]: token,
    });

    return token;
  }

  async connectToChat(chatId: number) {
    const cachedMessages = store.getState().chatMessages || {};

    if (cachedMessages[chatId]) {
      store.set('messages', cachedMessages[chatId]);
    } else {
      store.set('messages', []);
    }

    if (this.currentChatId === chatId && webSocketService.getState() === WebSocket.OPEN) {
      if (!cachedMessages[chatId]) {
        webSocketService.getOldMessages(0);
      }
      return;
    }

    if (this.messageHandler) {
      webSocketService.off(WSEvents.Message, this.messageHandler);
    }

    if (this.currentChatId !== null) {
      webSocketService.close();
    }

    const { user } = store.getState();
    if (!user) {
      throw new Error('User not found');
    }

    const token = await this.getChatToken(chatId);

    this.currentChatId = chatId;

    this.messageHandler = (data: any) => {
      if (Array.isArray(data)) {
        const reversedMessages = data.reverse();
        store.set('messages', reversedMessages);

        const allChatMessages = store.getState().chatMessages || {};
        store.set('chatMessages', {
          ...allChatMessages,
          [chatId]: reversedMessages,
        });
      } else {
        const messages = store.getState().messages || [];
        const newMessages = [...messages, data];
        store.set('messages', newMessages);

        const allChatMessages = store.getState().chatMessages || {};
        store.set('chatMessages', {
          ...allChatMessages,
          [chatId]: newMessages,
        });
      }
    };

    webSocketService.on(WSEvents.Message, this.messageHandler);

    await webSocketService.connect(user.id, chatId, token);

    if (!cachedMessages[chatId]) {
      webSocketService.getOldMessages(0);
    }
  }

  sendMessage(content: string) {
    webSocketService.send(content);
  }

  disconnectFromChat() {
    if (this.messageHandler) {
      webSocketService.off(WSEvents.Message, this.messageHandler);
      this.messageHandler = null;
    }
    webSocketService.close();
    this.currentChatId = null;
    store.set('messages', []);
  }

  getMessages() {
    return store.getState().messages || [];
  }
}

export default new ChatController();
