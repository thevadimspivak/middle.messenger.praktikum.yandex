export interface LoginFormData {
  login: string;
  password: string;
}

export interface SignUpFormData {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

export interface UpdateProfileFormData {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}
