import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import {colors} from './colors';

export const iconLibName = {
  AntDesign: 'AntDesign',
  Entypo: 'Entypo',
  FontAwesome: 'FontAwesome',
  EvilIcons: 'EvilIcons',
  Feather: 'Feather',
  FontAwesome5: 'FontAwesome5',
  FontAwesome6: 'FontAwesome6',
  Foundation: 'Foundation',
  Ionicons: 'Ionicons',
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  MaterialIcons: 'MaterialIcons',
  Octicons: 'Octicons',
  SimpleLineIcons: 'SimpleLineIcons',
  Zocial: 'Zocial',
};

const dynamicNames = {
  AntDesign: AntDesign,
  Entypo: Entypo,
  FontAwesome: FontAwesome,
  EvilIcons: EvilIcons,
  Feather: Feather,
  FontAwesome5: FontAwesome5,
  FontAwesome6: FontAwesome6,
  Foundation: Foundation,
  Ionicons: Ionicons,
  MaterialCommunityIcons: MaterialCommunityIcons,
  MaterialIcons: MaterialIcons,
  Octicons: Octicons,
  SimpleLineIcons: SimpleLineIcons,
  Zocial: Zocial,
};

const VectorIcons = ({name, iconName, size, color}) => {
  const IconComponent = dynamicNames[name];

  if (!IconComponent) {
    console.error(`Icon library "${name}" not found.`);

    return null;
  }

  return (
    <IconComponent
      name={iconName}
      size={size ?? 18}
      color={color ?? colors.black}
    />
  );
};

export default VectorIcons;
