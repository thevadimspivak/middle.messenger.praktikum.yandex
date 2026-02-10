import { BaseAPI } from './BaseAPI';
import type {
  Chat,
  ChatUser,
  CreateChatData,
  AddUsersData,
  DeleteUsersData,
  ChatTokenResponse,
  DeleteChatData,
  UpdateChatAvatarResponse,
} from './types';

export type {
  Chat,
  ChatUser,
  CreateChatData,
  AddUsersData,
  DeleteUsersData,
  ChatTokenResponse,
  DeleteChatData,
  UpdateChatAvatarResponse,
};

class ChatAPIClass extends BaseAPI {
  getChats(): Promise<Chat[]> {
    return this.http.get('/chats');
  }

  createChat(data: CreateChatData): Promise<{ id: number }> {
    return this.http.post('/chats', { data });
  }

  deleteChat(data: DeleteChatData): Promise<{ userId: number; result: Chat }> {
    return this.http.delete('/chats', { data });
  }

  getChatUsers(chatId: number): Promise<ChatUser[]> {
    return this.http.get(`/chats/${chatId}/users`);
  }

  addUsersToChat(data: AddUsersData): Promise<string> {
    return this.http.put('/chats/users', { data });
  }

  deleteUsersFromChat(data: DeleteUsersData): Promise<string> {
    return this.http.delete('/chats/users', { data });
  }

  getChatToken(chatId: number): Promise<ChatTokenResponse> {
    return this.http.post(`/chats/token/${chatId}`);
  }

  updateChatAvatar(formData: FormData): Promise<UpdateChatAvatarResponse> {
    return this.http.put('/chats/avatar', { data: formData });
  }
}

export default new ChatAPIClass();
