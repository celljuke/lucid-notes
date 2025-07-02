export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthSession {
  user: AuthUser;
  expires: string;
}

export interface AuthError {
  type: string;
  message: string;
}

export type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  error: AuthError | null;
};
