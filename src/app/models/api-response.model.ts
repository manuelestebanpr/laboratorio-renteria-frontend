/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * API error response - matches backend ApiError record
 */
export interface ApiErrorResponse {
  error: string;
  message: string;
  timestamp: string;
  path: string;
}

/**
 * Pagination metadata
 */
export interface PageMetadata {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Paginated API response
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  pagination: PageMetadata;
}
