import React, {createContext, useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {debounce} from 'lodash';
import {showToast, toastTypes} from '@/utilities/toastConfig';

export const NetworkContext = createContext();

const NetworkProvider = ({children}) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const handleNetworkChange = debounce(state => {
      setIsConnected(state.isConnected);

      if (state.isConnected) {
      } else {
        showToast('No Internet Connection', 'Network Error', toastTypes.error);
      }
    }, 1000);

    const unsubscribe = NetInfo.addEventListener(handleNetworkChange);

    return () => {
      unsubscribe();
      handleNetworkChange.cancel();
    };
  }, []);

  return (
    <NetworkContext.Provider value={{isConnected}}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
