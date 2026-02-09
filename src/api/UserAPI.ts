import { BaseAPI } from './BaseAPI';

export interface User {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface UpdateProfileData {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}

export interface PasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface SearchUserData {
  login: string;
}

export class UserAPI extends BaseAPI {
  updateProfile(data: UpdateProfileData): Promise<User> {
    return this.http.put('/user/profile', { data });
  }

  updateAvatar(formData: FormData): Promise<User> {
    return this.http.put('/user/profile/avatar', { data: formData });
  }

  updatePassword(data: PasswordData): Promise<string> {
    return this.http.put('/user/password', { data });
  }

  getUserById(id: number): Promise<User> {
    return this.http.get(`/user/${id}`);
  }

  searchUsers(data: SearchUserData): Promise<User[]> {
    return this.http.post('/user/search', { data });
  }
}

export default new UserAPI();
