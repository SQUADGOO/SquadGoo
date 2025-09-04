import {Alert, Platform} from 'react-native';
import {
  request,
  check,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {isIOS} from '../utilities/helperFunctions';

const handlePermissionDenied = async () => {
  Alert.alert(
    'Permission Required',
    'This permission is necessary for the app to function correctly. Please enable it in settings.',
    [
      {text: 'Cancel', style: 'cancel'},
      {text: 'OK', onPress: async () => await openSettings()},
    ],
  );
};

export const requestStoragePermission = async () => {
  let permission = isIOS
    ? PERMISSIONS.IOS.PHOTO_LIBRARY
    : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

  try {
    const status = await check(permission);

    if (status === RESULTS.GRANTED) {
      console.log('Storage Permission Already Granted');

      return true;
    }

    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      console.log('Storage Permission Granted');

      return true;
    } else {
      await handlePermissionDenied();

      return false;
    }
  } catch (error) {
    console.warn('Error requesting storage permission:', error);

    return false;
  }
};

export const requestCameraPermission = async () => {
  let permission = isIOS ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

  try {
    const status = await check(permission);

    if (status === RESULTS.GRANTED) {
      console.log('Camera Permission Already Granted');

      return true;
    }

    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      console.log('Camera Permission Granted');

      return true;
    } else {
      await handlePermissionDenied();

      return false;
    }
  } catch (error) {
    console.warn('Error requesting camera permission:', error);

    return false;
  }
};
