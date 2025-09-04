import {Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const screenWidth = Dimensions.get('window').width;

const getFontSize = baseSize => {
  const scaleFactor = screenWidth / 375;
  const newSize = baseSize * scaleFactor;

  return Math.round(newSize);
};

const typography = {
  heading: {fontSize: getFontSize(24), fontWeight: 'bold'},
  body: {fontSize: getFontSize(16)},
  caption: {fontSize: getFontSize(12)},
};

export {getFontSize, typography, wp, hp};
