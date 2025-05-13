export async function fetchAdminSession(
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean | null>>
) {
  const res = await fetch("/api/auth/session");
  const data = await res.json();

  if (!data || !data.user || data.user.name.toLowerCase() !== "admin") {
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
  const res = await fetch("/api/auth/session");
  const data = await res.json();

  if (!data || !data.user) {
    alert("You are not authorized to access this page. Please login first");
    window.location.href = "/api/auth/signin";
    setIsAuthorized(false);
  } else {
    setIsAuthorized(true);
    return data.user;
  }
}
