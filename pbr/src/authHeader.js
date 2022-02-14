import { user } from "useAuth";

export function authHeader() {
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  } else {
    return {};
  }
}
