export default function logoutUrl(role?: string): string {
  if (role === 'agent') return '/agent/logout';
  if (role === 'admin' || role === 'superadmin') return '/admin/logout';
  return '/logout';
}