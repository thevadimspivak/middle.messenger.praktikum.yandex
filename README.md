# Мессенджер

Веб-приложение мессенджера, созданное в рамках учебного проекта Яндекс.Практикума.

Макеты находятся в директории `./ui`

Развёрнуто по адресу: https://chat-messenger-26.netlify.app/


- [Главная / Вход](https://chat-messenger-26.netlify.app/) - Страница входа
- [Регистрация](https://chat-messenger-26.netlify.app/sign-up) - Страница регистрации
- [Чаты](https://chat-messenger-26.netlify.app/messenger) - Главная страница со списком чатов
- [Профиль](https://chat-messenger-26.netlify.app/settings) - Профиль пользователя
- [Редактирование профиля](https://chat-messenger-26.netlify.app/profile-edit) - Изменение данных профиля
- [Смена пароля](https://chat-messenger-26.netlify.app/profile-password) - Изменение пароля
- [Ошибка 404](https://chat-messenger-26.netlify.app/404) - Страница не найдена
- [Ошибка 500](https://chat-messenger-26.netlify.app/500) - Ошибка сервера

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

- [Главная / Вход](http://localhost:3000/) - Страница входа
- [Регистрация](http://localhost:3000/sign-up) - Страница регистрации
- [Чаты](http://localhost:3000/messenger) - Главная страница со списком чатов
- [Профиль](http://localhost:3000/settings) - Профиль пользователя
- [Редактирование профиля](http://localhost:3000/profile-edit) - Изменение данных профиля
- [Смена пароля](http://localhost:3000/profile-password) - Изменение пароля
- [Ошибка 404](http://localhost:3000/404) - Страница не найдена
- [Ошибка 500](http://localhost:3000/500) - Ошибка сервера

### Сборка проекта

```bash
npm run build
```

Собранные файлы будут находиться в директории `dist/`

### Production mode (сборка + preview)

```bash
npm run start
```

## Проверка кода

### Запуск всех линтеров

```bash
npm run lint
```
