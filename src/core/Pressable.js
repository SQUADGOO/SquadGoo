import {TouchableOpacity} from 'react-native';
import React, {forwardRef, memo} from 'react';
const Pressable = forwardRef(
  ({children, onPress, style, opacity = 0.8, ...props}, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        activeOpacity={opacity}
        style={style}
        onPress={onPress}
        {...props}>
        {children}
      </TouchableOpacity>
    );
  },
);
export default memo(Pressable);
