import { launchCamera, launchImageLibrary } from "react-native-image-picker"
import { showToast, toastTypes } from "./toastConfig"
import { requestCameraPermission } from "@/permissions/CameraPermissions"

export const openCamera = async (options = {}) => {
    try {
        const cameraPermission = await requestCameraPermission()
        if (!cameraPermission) {
            showToast('Camera permission not granted', 'Permission Error', toastTypes.error)
            return
        }
        return new Promise((resolve, reject) => {
            launchCamera(
                {
                    mediaType: 'photo',
                    includeBase64: false,
                    saveToPhotos: false,
                    ...options,
                },
                (response) => {
                    if (response.didCancel) {
                        reject("User cancelled camera")
                    } else if (response.errorCode) {
                        reject(response.errorMessage)
                    } else {
                        const normalized = response.assets?.[0]
                        resolve(normalized);
                    }
                }
            )
        })
    } catch (error) {
        console.error('Permission error:', error);
    }
}

export const openGallery = async (options = {}) => {
  try {
    console.log('openGallery called');
    return new Promise((resolve, reject) => {
      launchImageLibrary(
        {
          mediaType: "photo",
          selectionLimit: 1,
          includeBase64: false,
          ...options,
        },
        (response) => {
          if (response.didCancel) {
            reject("User cancelled picker");
          } else if (response.errorCode) {
            console.log("ImagePicker Error: ", response.errorMessage);
            reject(response.errorMessage);
          } else {
            const normalized = response.assets?.[0]
            resolve(normalized);
          }
        }
      );
    });
  } catch (error) {
    console.log("Error in opening gallery ::: ", error.toString());
  }
};