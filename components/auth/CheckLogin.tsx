import { getSession } from "next-auth/react";

// Cache for session data to prevent redundant API calls
let sessionCache: any = null;
let lastFetchTime = 0;
const CACHE_EXPIRY = 60 * 1000; // 1 minute cache

// Helper function to get session with caching for better performance
async function getSessionWithCache() {
  const now = Date.now();

  // If we have a cached session that's not expired, use it
  if (sessionCache && now - lastFetchTime < CACHE_EXPIRY) {
    return sessionCache;
  }

  // Otherwise fetch a fresh session
  try {
    const session = await getSession();
    sessionCache = session;
    lastFetchTime = now;

    // Update localStorage if authenticated
    if (session?.user) {
      if (typeof window !== "undefined") {
        localStorage.setItem("authState", "authenticated");
        localStorage.setItem(
          "userName",
          session.user.name?.toLowerCase() || ""
        );
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
  const session = await getSessionWithCache();

  if (
    !session ||
    !session.user ||
    session.user.name?.toLowerCase() !== "admin"
  ) {
    alert("You are not authorized to access this page.");
    window.location.href = "/";
    setIsAuthorized(false);
  } else {
    setIsAuthorized(true);
  }
}

export async function fetchUserSession(
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean | null>>
) {
  // Then validate with the server
  const session = await getSessionWithCache();

  if (!session || !session.user) {
    alert("You are not authorized to access this page. Please login first");
    window.location.href = "/api/auth/signin";
    setIsAuthorized(false);
  } else {
    setIsAuthorized(true);
    return session.user;
  }
}
