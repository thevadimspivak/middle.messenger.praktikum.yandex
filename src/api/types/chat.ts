export interface Chat {
  id: number;
  title: string;
  avatar: string | null;
  avatarPath?: string | null;
  unread_count: number;
  created_by: number;
  last_message: {
    user: {
      first_name: string;
      second_name: string;
      avatar: string | null;
      email: string;
      login: string;
      phone: string;
    };
    time: string;
    content: string;
  } | null;
}

export interface Message {
  id: number;
  chat_id: number;
  time: string;
  type: string;
  user_id: number;
  content: string;
  file?: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  };
}

export interface ChatUser {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string | null;
  role: string;
}

export interface CreateChatData {
  title: string;
}

export interface AddUsersData {
  users: number[];
  chatId: number;
}

export interface DeleteUsersData {
  users: number[];
  chatId: number;
}

export interface ChatTokenResponse {
  token: string;
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
