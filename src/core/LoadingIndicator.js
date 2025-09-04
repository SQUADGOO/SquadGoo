import {ActivityIndicator, View} from 'react-native';
import React, {memo} from 'react';
import {colors} from '@/theme';
import globalStyles from '@/styles/globalStyles';

const LoaderIndicator = ({size = 'large', color = colors.primary}) => {
  return (
    <View style={globalStyles.centerContent}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default memo(LoaderIndicator);
