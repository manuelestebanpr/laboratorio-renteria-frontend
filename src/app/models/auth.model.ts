import { User } from './user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  forcePasswordChange: boolean;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

// Re-export User from user.model.ts for backward compatibility
export { User };
