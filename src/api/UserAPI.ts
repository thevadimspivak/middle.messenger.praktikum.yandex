import { BaseAPI } from './BaseAPI';
import type {
  User, UpdateProfileData, PasswordData, SearchUserData,
} from './types';

export type {
  User, UpdateProfileData, PasswordData, SearchUserData,
};

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
