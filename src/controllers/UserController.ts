import AuthAPI from '../api/AuthAPI';
import UserAPI from '../api/UserAPI';
import store from '../core/Store';

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

  async updateProfile(data: any) {
    const user = await UserAPI.updateProfile(data);
    store.set('user', user);
    return user;
  }

  async updateAvatar(formData: FormData) {
    const user = await UserAPI.updateAvatar(formData);
    store.set('user', user);
    return user;
  }

  async updatePassword(data: { oldPassword: string; newPassword: string }) {
    await UserAPI.updatePassword(data);
  }
}

export default new UserController();
