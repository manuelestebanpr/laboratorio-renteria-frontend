/**
 * ID types for Colombian identification documents
 */
export type IdType = 'CC' | 'CE' | 'TI' | 'PP' | 'NIT';

/**
 * Blood types
 */
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

/**
 * Patient model for patient data
 */
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  idType: IdType;
  idNumber: string;
  dateOfBirth: string;
  bloodType?: BloodType;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Patient search/filter parameters
 */
export interface PatientSearchParams {
  query?: string;
  idType?: IdType;
  idNumber?: string;
  page?: number;
  size?: number;
}

/**
 * Patient list response
 */
export interface PatientListResponse {
  content: Patient[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
