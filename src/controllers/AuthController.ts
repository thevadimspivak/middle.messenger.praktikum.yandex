import AuthAPI, { SignInData, SignUpData } from '../api/AuthAPI';
import store from '../core/Store';
import router from '../router';

class AuthController {
  async login(data: SignInData) {
    const response = await AuthAPI.signIn(data);
    await this.fetchUser();
    router.go('/messenger');
    return response;
  }

  async signup(data: SignUpData) {
    const response = await AuthAPI.signUp(data);
    await this.fetchUser();
    router.go('/messenger');
    return response;
  }

  async logout() {
    await AuthAPI.logout();
    store.set('user', null);
    store.set('chats', []);
    store.set('selectedChat', null);
    store.set('messages', []);
    store.set('chatTokens', {});
    store.set('chatMessages', {});
    store.set('chatUsers', {});
    router.go('/');
  }

  async fetchUser() {
    const user = await AuthAPI.read();
    store.set('user', user);
    return user;
  }

  getUser() {
    return store.getState().user;
  }
}

export default new AuthController();
