export function getUserFromCookie() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('mylogintoken='));
    
    if (!cookie) return null;

    const tokenData = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
    return {
      token: tokenData.token,
      role: tokenData.role,
    };
  } catch (error) {
    console.error('Error parsing auth cookie:', error);
    return null;
  }
}

export function isManager() {
  const user = getUserFromCookie();
  return user?.role === 'manager';
}

export function isStaff() {
  const user = getUserFromCookie();
  return user?.role === 'staff';
}

export function hasRole(requiredRole) {
  const user = getUserFromCookie();
  return user?.role === requiredRole;
}

export function logout() {
  if (typeof window !== 'undefined') {
    document.cookie = 'mylogintoken=; Max-Age=0; path=/;';
    window.location.href = '/login';
  }
}
