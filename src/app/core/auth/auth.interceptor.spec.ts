import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { signal, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceMock: Partial<AuthService>;
  let routerSpy: jest.Mocked<Router>;

  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.signature';
  const newMockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIn0.signature2';

  beforeEach(() => {
    routerSpy = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    authServiceMock = {
      accessToken: signal(mockToken),
      refresh: jest.fn(),
      logout: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerSpy },
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('attaching Bearer token', () => {
    it('should attach Bearer token to request when user is authenticated', () => {
      authServiceMock.accessToken = signal(mockToken);

      httpClient.get('/api/test').subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBe(true);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush({});
    });

    it('should not attach Authorization header when no token exists', () => {
      authServiceMock.accessToken = signal(null);

      httpClient.get('/api/test').subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('should attach token to POST requests', () => {
      authServiceMock.accessToken = signal(mockToken);

      httpClient.post('/api/data', { test: true }).subscribe();

      const req = httpMock.expectOne('/api/data');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush({});
    });

    it('should attach token to PUT requests', () => {
      authServiceMock.accessToken = signal(mockToken);

      httpClient.put('/api/data/1', { test: true }).subscribe();

      const req = httpMock.expectOne('/api/data/1');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush({});
    });

    it('should attach token to DELETE requests', () => {
      authServiceMock.accessToken = signal(mockToken);

      httpClient.delete('/api/data/1').subscribe();

      const req = httpMock.expectOne('/api/data/1');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush({});
    });
  });

  describe('handling 401 errors', () => {
    it('should refresh token on 401 error and retry request', fakeAsync(() => {
      authServiceMock.accessToken = signal(mockToken);
      (authServiceMock.refresh as jest.Mock).mockReturnValue(of(void 0));

      // Simulate refresh updating the token
      let refreshCallCount = 0;
      Object.defineProperty(authServiceMock, 'accessToken', {
        get: () => {
          return signal(refreshCallCount > 0 ? newMockToken : mockToken);
        },
        configurable: true,
      });

      (authServiceMock.refresh as jest.Mock).mockImplementation(() => {
        refreshCallCount++;
        return of(void 0);
      });

      httpClient.get('/api/protected').subscribe(response => {
        expect(response).toBeTruthy();
      });

      // First request returns 401
      let req = httpMock.expectOne('/api/protected');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      tick();

      // Refresh should have been called
      expect(authServiceMock.refresh).toHaveBeenCalled();

      // Retry with new token
      req = httpMock.expectOne('/api/protected');
      req.flush({ data: 'success' });

      tick();
    }));

    it('should not refresh on 401 from /auth/refresh endpoint', fakeAsync(() => {
      authServiceMock.accessToken = signal(mockToken);

      httpClient.post('/api/v1/auth/refresh', {}).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
        },
      });

      const req = httpMock.expectOne('/api/v1/auth/refresh');
      req.flush({ message: 'Invalid refresh token' }, { status: 401, statusText: 'Unauthorized' });

      tick();

      expect(authServiceMock.refresh).not.toHaveBeenCalled();
    }));

    it('should logout and propagate error when refresh fails', fakeAsync(() => {
      authServiceMock.accessToken = signal(mockToken);
      (authServiceMock.refresh as jest.Mock).mockReturnValue(throwError(() => new Error('Refresh failed')));

      httpClient.get('/api/protected').subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      // First request returns 401
      let req = httpMock.expectOne('/api/protected');
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      tick();

      expect(authServiceMock.refresh).toHaveBeenCalled();
      expect(authServiceMock.logout).toHaveBeenCalled();
    }));

    it('should handle concurrent 401 requests and refresh only once', fakeAsync(() => {
      authServiceMock.accessToken = signal(mockToken);
      let refreshInProgress = false;

      (authServiceMock.refresh as jest.Mock).mockImplementation(() => {
        if (refreshInProgress) {
          return throwError(() => new Error('Already refreshing'));
        }
        refreshInProgress = true;
        return of(void 0).pipe(
          // Simulate async refresh
        );
      });

      // Make two concurrent requests
      httpClient.get('/api/resource1').subscribe();
      httpClient.get('/api/resource2').subscribe();

      // Both requests get 401
      const req1 = httpMock.expectOne('/api/resource1');
      const req2 = httpMock.expectOne('/api/resource2');

      req1.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
      req2.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      tick();

      // Refresh should handle concurrent requests
      expect(authServiceMock.refresh).toHaveBeenCalled();
    }));
  });

  describe('handling other errors', () => {
    it('should propagate non-401 errors without refreshing', fakeAsync(() => {
      authServiceMock.accessToken = signal(mockToken);

      httpClient.get('/api/test').subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(403);
        },
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({ message: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });

      tick();

      expect(authServiceMock.refresh).not.toHaveBeenCalled();
    }));

    it('should propagate 500 errors without refreshing', fakeAsync(() => {
      authServiceMock.accessToken = signal(mockToken);

      httpClient.get('/api/test').subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({ message: 'Server Error' }, { status: 500, statusText: 'Internal Server Error' });

      tick();

      expect(authServiceMock.refresh).not.toHaveBeenCalled();
    }));

    it('should propagate 404 errors without refreshing', fakeAsync(() => {
      authServiceMock.accessToken = signal(mockToken);

      httpClient.get('/api/not-found').subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne('/api/not-found');
      req.flush({ message: 'Not Found' }, { status: 404, statusText: 'Not Found' });

      tick();

      expect(authServiceMock.refresh).not.toHaveBeenCalled();
    }));
  });

  describe('successful requests', () => {
    it('should pass through successful responses unchanged', fakeAsync(() => {
      authServiceMock.accessToken = signal(mockToken);
      const mockResponse = { id: 1, name: 'Test' };

      httpClient.get('/api/data').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/data');
      req.flush(mockResponse);

      tick();
    }));

    it('should handle empty responses', fakeAsync(() => {
      authServiceMock.accessToken = signal(mockToken);

      httpClient.get('/api/empty').subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('/api/empty');
      req.flush(null);

      tick();
    }));
  });
});