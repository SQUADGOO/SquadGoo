import React from 'react';
import {BaseToast} from 'react-native-toast-message';

const MyToast = ({type, ...props}) => {
  const colors = {
    customSuccess: {
      borderColor: 'green',
      backgroundColor: 'white',
      textColor: 'green',
    },
    customError: {
      borderColor: 'red',
      backgroundColor: 'white',
      textColor: 'red',
    },
    customWarning: {
      borderColor: '#FFA500',
      backgroundColor: 'white',
      textColor: '#FFA500',
    },
  };

  const styles = colors[type] || colors.customSuccess;

  return (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: styles.borderColor,
        backgroundColor: styles.backgroundColor,
      }}
      text1Style={{color: styles.textColor, fontWeight: 'bold'}}
      text2Style={{color: styles.textColor}}
    />
  );
};

export default MyToast;
