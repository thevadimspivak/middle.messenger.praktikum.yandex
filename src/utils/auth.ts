import UserController from '../controllers/UserController';

export async function checkAuth(): Promise<boolean> {
  try {
    if (!UserController.getUser()) {
      await UserController.fetchUser();
    }
    return !!UserController.getUser();
  } catch {
    return false;
  }
}
