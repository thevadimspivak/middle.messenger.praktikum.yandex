import './styles/main.scss';
import router from './router';
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
  .use('/', LoginPage)
  .use('/sign-up', RegisterPage)
  .use('/settings', ProfilePage, { isProtected: true })
  .use('/messenger', ChatPage, { isProtected: true })
  .use('/profile-edit', ProfileEditPage, { isProtected: true })
  .use('/profile-password', ProfilePasswordPage, { isProtected: true })
  .use('/404', Error404Page)
  .use('/500', Error500Page)
  .start();
