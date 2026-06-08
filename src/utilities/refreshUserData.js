import { getMe } from "@/api/user/user.api";
import { updateUserFields } from "@/store/authSlice";
import { store } from "@/store/store";

// Imperatively refresh the signed-in user from GET /users/me and sync Redux.
// GET /users/me returns { ok: true, user: {...} }; `request` unwraps to response.data.
export const refreshUserData = async () => {
  try {
    const res = await getMe();
    if (res?.user) {
      store.dispatch(updateUserFields(res.user));
    } else {
      console.log('Failed to refresh user data: no user in response', res);
    }
  } catch (err) {
    console.log('Failed to refresh user data:', err);
  }
};
