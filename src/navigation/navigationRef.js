import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function resetRoot(params = {index: 0, routes}) {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot(params);
  }
}
