export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export function redirectToLogin() {
  window.location.href = '/api/login';
}

export function redirectToLogout() {
  window.location.href = '/api/logout';
}
