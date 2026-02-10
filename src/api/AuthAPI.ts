import { BaseAPI } from './BaseAPI';
import type {
  SignUpData, SignInData, User, SignUpResponse,
} from './types';

export type {
  SignUpData, SignInData, User, SignUpResponse,
};

export class AuthAPI extends BaseAPI {
  signUp(data: SignUpData): Promise<SignUpResponse> {
    return this.http.post('/auth/signup', { data });
  }

  signIn(data: SignInData): Promise<string> {
    return this.http.post('/auth/signin', { data });
  }

  read(): Promise<User> {
    return this.http.get('/auth/user');
  }

  logout(): Promise<string> {
    return this.http.post('/auth/logout');
  }
}

export default new AuthAPI();
