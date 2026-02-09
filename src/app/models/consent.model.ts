/**
 * Consent status for privacy notice
 */
export interface ConsentStatus {
  hasConsented: boolean;
  consentDate?: string;
  consentVersion?: string;
  requiresUpdate: boolean;
}

/**
 * Privacy notice content
 */
export interface PrivacyNotice {
  id: string;
  version: string;
  title: string;
  content: string;
  effectiveDate: string;
  language: string;
}

/**
 * Consent acceptance request
 */
export interface ConsentAcceptanceRequest {
  noticeId: string;
  accepted: boolean;
}
