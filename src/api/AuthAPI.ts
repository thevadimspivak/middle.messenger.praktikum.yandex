import { BaseAPI } from './BaseAPI';

export interface SignUpData {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

export interface SignUpResponse {
  id: number;
}

export interface SignInData {
  login: string;
  password: string;
}

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
