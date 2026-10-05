export function getViewerToken() {
  let token = localStorage.getItem('viewer_token');
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem('viewer_token', token);
  }
  return token;
}