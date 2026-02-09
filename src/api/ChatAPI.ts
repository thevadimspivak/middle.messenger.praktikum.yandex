import { BaseAPI } from './BaseAPI';

export interface Chat {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  created_by: number;
  last_message: {
    user: {
      first_name: string;
      second_name: string;
      avatar: string;
      email: string;
      login: string;
      phone: string;
    };
    time: string;
    content: string;
  } | null;
}

export interface CreateChatData {
  title: string;
}

export interface ChatUser {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  avatar: string;
  role: string;
}

export interface AddUsersData {
  users: number[];
  chatId: number;
}

export interface DeleteUsersData {
  users: number[];
  chatId: number;
}

export interface DeleteChatData {
  chatId: number;
}

export interface UpdateChatAvatarResponse {
  id: number;
  title: string;
  avatar: string;
  created_by: number;
}

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

  getChatToken(chatId: number): Promise<{ token: string }> {
    return this.http.post(`/chats/token/${chatId}`);
  }

  updateChatAvatar(formData: FormData): Promise<UpdateChatAvatarResponse> {
    return this.http.put('/chats/avatar', { data: formData });
  }
}

export default new ChatAPIClass();
