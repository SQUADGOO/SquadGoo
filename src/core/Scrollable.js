import {ScrollView} from 'react-native';
import React, {forwardRef, memo} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Scrollable = forwardRef(
  (
    {children, hasInput, horizontal, containerStyle, style, onScroll, ...props},
    ref,
  ) => {
    if (hasInput) {
      return (
        <KeyboardAwareScrollView
          ref={ref}
          onScroll={onScroll}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={containerStyle}
          horizontal={horizontal}
          style={style}
          bounces={false}
          {...props}>
          {children}
        </KeyboardAwareScrollView>
      );
    } else {
      return (
        <ScrollView
          ref={ref}
          onScroll={onScroll}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={containerStyle}
          horizontal={horizontal}
          bounces={false}
          {...props}>
          {children}
        </ScrollView>
      );
    }
  },
);

export default memo(Scrollable);
