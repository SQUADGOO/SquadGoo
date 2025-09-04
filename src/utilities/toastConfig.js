import Toast from 'react-native-toast-message';
import MyToast from '@/core/MyToast';

export const toastTypes = {
  success: 'customSuccess',
  error: 'customError',
  warning: 'customWarning',
};

const toastConfig = {
  customSuccess: props => <MyToast type="customSuccess" {...props} />,
  customError: props => <MyToast type="customError" {...props} />,
  customWarning: props => <MyToast type="customWarning" {...props} />,
};

export default toastConfig;

export const showToast = (messageKey, titleKey, type = toastTypes.success) => {
  Toast.show({
    type,
    text1: titleKey || (type === toastTypes.success ? 'success' : 'error'),
    text2: messageKey,
    position: 'top',
  });
};
