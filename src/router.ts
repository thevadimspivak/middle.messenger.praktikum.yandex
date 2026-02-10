import { Router } from './core';

export enum Routes {
  Login = '/',
  SignUp = '/sign-up',
  Messenger = '/messenger',
  Settings = '/settings',
  ProfileEdit = '/profile-edit',
  ProfilePassword = '/profile-password',
  Error404 = '/404',
  Error500 = '/500',
}

const router = new Router('#app');

export default router;
