import { API_CONFIG } from '../config';

export function getUserAvatarUrl(avatar: string | null | undefined): string {
  return avatar ? `${API_CONFIG.BASE_DOMAIN}${API_CONFIG.API_VERSION}/resources${avatar}` : '';
}

export function getUserDisplayName(user: any): string {
  return user.display_name || `${user.first_name} ${user.second_name}`;
}

export function getUserFields(user: any): Array<{ label: string; value: string }> {
  return [
    { label: 'Email', value: user.email },
    { label: 'Login', value: user.login },
    { label: 'First name', value: user.first_name },
    { label: 'Second name', value: user.second_name },
    { label: 'Display name', value: user.display_name || '' },
    { label: 'Phone', value: user.phone },
  ];
}
