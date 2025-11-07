import { getUserData } from "@/api/user/user.api";
import { updateUserFields } from "@/store/authSlice";
import { store } from "@/store/store";

export const refreshUserData = async () => {
  try {
    const res = await getUserData();
    if (res?.status == 200) {
      // console.log('useGetUserData resss', res?.data)
      store.dispatch(updateUserFields(res?.data?.profile?.basicDetails));
    } else {
        console.log('Failed to refresh user data: Invalid response status', res?.status);
    }
  } catch (err) {
    console.log('Failed to refresh user data:', err);
  }
};
