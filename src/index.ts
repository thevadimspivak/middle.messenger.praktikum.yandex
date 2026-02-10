import './styles/main.scss';
import router, { Routes } from './router';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import ChatPage from './pages/chat';
import ProfilePage from './pages/profile';
import ProfileEditPage from './pages/profile-edit';
import ProfilePasswordPage from './pages/profile-password';
import { Error404Page } from './pages/error-404';
import { Error500Page } from './pages/error-500';
import { checkAuth } from './utils';

router
  .setAuthCheck(checkAuth)
  .use(Routes.Login, LoginPage)
  .use(Routes.SignUp, RegisterPage)
  .use(Routes.Settings, ProfilePage, { isProtected: true })
  .use(Routes.Messenger, ChatPage, { isProtected: true })
  .use(Routes.ProfileEdit, ProfileEditPage, { isProtected: true })
  .use(Routes.ProfilePassword, ProfilePasswordPage, { isProtected: true })
  .use(Routes.Error404, Error404Page)
  .use(Routes.Error500, Error500Page)
  .start();
