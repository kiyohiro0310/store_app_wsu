import React, { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAdminSession, fetchUserSession } from './CheckLogin';

interface AuthStateWrapperProps {
  children: ReactNode;
  requireAuth?: boolean; // Whether authentication is required
  requireAdmin?: boolean; // Whether admin role is required
  fallback?: ReactNode; // Optional fallback UI while checking auth
  redirectTo?: string; // Where to redirect if auth fails
}

/**
 * A wrapper component that handles authentication state
 * to prevent loading screens when reloading the page
 */
const AuthStateWrapper: React.FC<AuthStateWrapperProps> = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  fallback = null,
  redirectTo,
}) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage first for an immediate decision
    const storedAuthState = localStorage.getItem('authState');
    const storedUserName = localStorage.getItem('userName');
    
    let initialAuth = null;
    
    if (storedAuthState === 'authenticated') {
      // If we require admin, check if the stored user is admin
      if (requireAdmin) {
        if (storedUserName === 'admin') {
          initialAuth = true;
        } else {
          initialAuth = false;
        }
      } else {
        // For regular auth, localStorage is sufficient for initial state
        initialAuth = true;
      }
    } else if (storedAuthState === null) {
      // No stored auth state - we'll need to check with the server
      initialAuth = null;
    } else {
      // Explicitly not authenticated
      initialAuth = false;
    }
    
    // Set initial state from localStorage
    setIsAuthorized(initialAuth);
    setInitialCheckDone(true);
    
    // Then verify with the server
    const verifyAuth = async () => {
      try {
        if (requireAdmin) {
          await fetchAdminSession(setIsAuthorized);
        } else if (requireAuth) {
          await fetchUserSession(setIsAuthorized);
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        setIsAuthorized(false);
      }
    };
    
    verifyAuth();
  }, [requireAuth, requireAdmin, redirectTo]);

  // Handle redirection when auth is explicitly false
  useEffect(() => {
    if (isAuthorized === false && redirectTo) {
      router.push(redirectTo);
    }
  }, [isAuthorized, redirectTo, router]);

  // Return children directly if we have initial auth from localStorage
  if (isAuthorized === true) {
    return <>{children}</>;
  }
  
  // Show fallback UI if initial check is done but we're waiting for server verification
  // This prevents flickering between states
  if (initialCheckDone) {
    return <>{fallback}</>;
  }
  
  // During initial render before localStorage check, return nothing to prevent flicker
  return null;
};

export default AuthStateWrapper; 