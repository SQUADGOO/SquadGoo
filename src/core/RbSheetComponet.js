import React, {
  forwardRef,
  memo,
  useState,
  useRef,
  useImperativeHandle,
} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {colors} from '../theme';
import {BlurView} from '@react-native-community/blur';
import {StyleSheet, View} from 'react-native';

const RbSheetCompnonet = forwardRef(
  ({children, height, bgColor, wrapperColor, containerStyle, onClose}, ref) => {
    return (
      // <>
      // 	{isSheetOpen && (
      // 		<BlurView
      // 			style={StyleSheet.absoluteFill}
      // 			blurType="light"
      // 			blurAmount={2}
      // 			reducedTransparencyFallbackColor="white"
      // 		/>
      // 	)}
      <RBSheet
        ref={ref}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={height}
        onClose={() => {
          setIsSheetOpen(false);
          onClose?.();
        }}
        customStyles={{
          wrapper: {
            backgroundColor: colors.black04 ?? 'transparent',
          },
          container: {
            backgroundColor: colors.white ?? bgColor,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            ...containerStyle,
          },
          draggableIcon: {
            backgroundColor: colors.white,
          },
        }}>
        {children}
      </RBSheet>
      // </>
    );
  },
);

export default memo(RbSheetCompnonet);
