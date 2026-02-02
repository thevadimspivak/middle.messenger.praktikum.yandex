import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: resolve(__dirname, 'static'),
  publicDir: resolve(__dirname, 'static/assets'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'static/index.html'),
        login: resolve(__dirname, 'static/login.html'),
        register: resolve(__dirname, 'static/register.html'),
        chat: resolve(__dirname, 'static/chat.html'),
        profile: resolve(__dirname, 'static/profile.html'),
        profileEdit: resolve(__dirname, 'static/profile-edit.html'),
        profilePassword: resolve(__dirname, 'static/profile-password.html'),
        error404: resolve(__dirname, 'static/404.html'),
        error500: resolve(__dirname, 'static/500.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '/src': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
