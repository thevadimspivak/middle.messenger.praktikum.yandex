import AuthAPI from '../api/AuthAPI';
import UserAPI from '../api/UserAPI';
import store from '../core/Store';
import type { UpdateProfileData, PasswordData } from '../api/types';

class UserController {
  async fetchUser() {
    try {
      const user = await AuthAPI.read();
      store.set('user', user);
      return user;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  }

  getUser() {
    return store.getState().user;
  }

  async updateProfile(data: UpdateProfileData) {
    const user = await UserAPI.updateProfile(data);
    store.set('user', user);
    return user;
  }

  async updateAvatar(formData: FormData) {
    const user = await UserAPI.updateAvatar(formData);
    store.set('user', user);
    return user;
  }

  async updatePassword(data: PasswordData) {
    await UserAPI.updatePassword(data);
  }
}

export default new UserController();
