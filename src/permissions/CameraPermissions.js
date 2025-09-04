import {PermissionsAndroid, Platform} from 'react-native';
import {request, PERMISSIONS, RESULTS, check} from 'react-native-permissions';

export const checkCameraPermissions = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else {
    const status = await check(PERMISSIONS.IOS.CAMERA);

    if (status === RESULTS.GRANTED) {
      return true;
    } else if (status === RESULTS.DENIED) {
      const requestStatus = await request(PERMISSIONS.IOS.CAMERA);

      return requestStatus === RESULTS.GRANTED;
    }

    return false;
  }
};

export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera Permission Granted');

        return true;
      } else {
        console.log('Camera Permission Denied');

        return false;
      }
    } catch (err) {
      console.warn(err);

      return false;
    }
  } else {
    const result = await request(PERMISSIONS.IOS.CAMERA);

    if (result === RESULTS.GRANTED) {
      console.log('Camera Permission Granted');

      return true;
    } else {
      console.log('Camera Permission Denied');

      return false;
    }
  }
};
