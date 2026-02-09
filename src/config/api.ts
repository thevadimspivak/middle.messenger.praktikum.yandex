export const API_CONFIG = {
  BASE_DOMAIN: 'https://ya-praktikum.tech',
  API_VERSION: '/api/v2',
  get BASE_URL() {
    return `${this.BASE_DOMAIN}${this.API_VERSION}`;
  },
};
