# Мессенджер

Веб-приложение мессенджера, созданное в рамках учебного проекта Яндекс.Практикума.

Макеты находятся в директории `./ui`

Развёрнуто по адресу: https://chat-messenger-26.netlify.app/


- [Главная / Чаты](https://chat-messenger-26.netlify.app/) - Главная страница со списком чатов
- [Авторизация](https://chat-messenger-26.netlify.app/login.html) - Страница входа
- [Регистрация](https://chat-messenger-26.netlify.app/register.html) - Страница регистрации
- [Профиль](https://chat-messenger-26.netlify.app/profile.html) - Профиль пользователя
- [Редактирование профиля](https://chat-messenger-26.netlify.app/profile-edit.html) - Изменение данных профиля
- [Смена пароля](https://chat-messenger-26.netlify.app/profile-password.html) - Изменение пароля
- [Ошибка 404](https://chat-messenger-26.netlify.app/404.html) - Страница не найдена
- [Ошибка 500](https://chat-messenger-26.netlify.app/500.html) - Ошибка сервера

## Установка и запуск

### Установка зависимостей

```bash
npm install
```

### Запуск dev-сервера

```bash
npm run dev
```

Проект запускается локально на <http://localhost:3000>

**Доступные страницы в режиме разработки:**

- [Главная / Чаты](http://localhost:3000/) - Главная страница со списком чатов
- [Авторизация](http://localhost:3000/login.html) - Страница входа
- [Регистрация](http://localhost:3000/register.html) - Страница регистрации
- [Профиль](http://localhost:3000/profile.html) - Профиль пользователя
- [Редактирование профиля](http://localhost:3000/profile-edit.html) - Изменение данных профиля
- [Смена пароля](http://localhost:3000/profile-password.html) - Изменение пароля
- [Ошибка 404](http://localhost:3000/404.html) - Страница не найдена
- [Ошибка 500](http://localhost:3000/500.html) - Ошибка сервера

### Сборка проекта

```bash
npm run build
```

Собранные файлы будут находиться в директории `dist/`

### Production mode (сборка + preview)

```bash
npm run start
```