import { getSession } from "next-auth/react";

// Cache for session data to prevent redundant API calls
let sessionCache: any = null;
let lastFetchTime = 0;
const CACHE_EXPIRY = 60 * 1000; // 1 minute cache

// Helper function to get session with caching for better performance
async function getSessionWithCache() {
  const now = Date.now();
  
  // Check localStorage first for a quick initial state
  const storedAuthState = typeof window !== 'undefined' ? localStorage.getItem('authState') : null;
  
  // If we have a cached session that's not expired, use it
  if (sessionCache && (now - lastFetchTime < CACHE_EXPIRY)) {
    return sessionCache;
  }
  
  // Otherwise fetch a fresh session
  try {
    const session = await getSession();
    sessionCache = session;
    lastFetchTime = now;
    
    // Update localStorage if authenticated
    if (session?.user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('authState', 'authenticated');
        localStorage.setItem('userName', session.user.name?.toLowerCase() || '');
      }
    }
    
    return session;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

export async function fetchAdminSession(
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean | null>>
) {
  // Quick check using localStorage before API call
  const storedAuthState = typeof window !== 'undefined' ? localStorage.getItem('authState') : null;
  const storedUserName = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
  
  // If we have stored credentials that indicate admin, set authorized immediately to prevent flicker
  if (storedAuthState === 'authenticated' && storedUserName === 'admin') {
    setIsAuthorized(true);
  }
  
  // Then validate with the server
  const session = await getSessionWithCache();

  if (!session || !session.user || session.user.name?.toLowerCase() !== "admin") {
    // Only show alert and redirect if we haven't previously set auth to true
    if (!(storedAuthState === 'authenticated' && storedUserName === 'admin')) {
      alert("You are not authorized to access this page.");
      window.location.href = "/";
    }
    setIsAuthorized(false);
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authState');
      localStorage.removeItem('userName');
    }
  } else {
    setIsAuthorized(true);
  }
}

export async function fetchUserSession(
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean | null>>
) {
  // Quick check using localStorage before API call
  const storedAuthState = typeof window !== 'undefined' ? localStorage.getItem('authState') : null;
  
  // If we have stored credentials, set authorized immediately to prevent flicker
  if (storedAuthState === 'authenticated') {
    setIsAuthorized(true);
  }
  
  // Then validate with the server
  const session = await getSessionWithCache();

  if (!session || !session.user) {
    // Only show alert and redirect if we haven't previously set auth to true
    if (storedAuthState !== 'authenticated') {
      alert("You are not authorized to access this page. Please login first");
      window.location.href = "/api/auth/signin";
    }
    setIsAuthorized(false);
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authState');
      localStorage.removeItem('userName');
    }
  } else {
    setIsAuthorized(true);
    return session.user;
  }
}
