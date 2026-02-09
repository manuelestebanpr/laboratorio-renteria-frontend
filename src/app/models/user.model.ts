/**
 * User role types in the system
 */
export type UserRole = 'PATIENT' | 'EMPLOYEE' | 'ADMIN';

/**
 * User model representing authenticated users
 * Consolidated from auth.model.ts to single source of truth
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  permissions: string[];
  fullName: string;
  firstName?: string;
  lastName?: string;
  forcePasswordChange?: boolean;
  requiresConsentUpdate?: boolean;
}

/**
 * User login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * User registration data
 */
export interface UserRegistration {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
