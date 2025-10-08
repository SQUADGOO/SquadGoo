import React, {memo} from 'react';
import {Text, StyleSheet} from 'react-native';
import {fonts} from '@/assets/fonts';
import {colors, getFontSize} from '@/theme';

const AppText = ({
  children,
  variant = 'body',
  color = colors.textPrimary,
  style,
  ...props
}) => {
  return (
    <Text style={[styles[variant], {color}, style]} {...props}>
      {children}
    </Text>
  );
};

export default memo(AppText);

const styles = StyleSheet.create({
  title: {
    fontSize: getFontSize(24),
    fontFamily: fonts.semiBold,
  },
  subTitle: {
    fontSize: getFontSize(18),
    fontFamily: fonts.bold,
  },
  regularFont: {
    fontSize: getFontSize(16),
    fontFamily: fonts.regular,
  },
  regularFontSemi: {
    fontSize: getFontSize(16),
    fontFamily: fonts.semiBold,
  },
  body: {
    fontSize: getFontSize(14),
    fontFamily: fonts.regular,
  },
  ligntBody: {
    fontSize: getFontSize(14),
    fontFamily: fonts.light,
  },
  bodyMedium: {
    fontSize: getFontSize(14),
    // fontFamily: fonts.medium,
  },
  bodybold: {
    fontSize: getFontSize(14),
    fontFamily: fonts.bold,
  },
  bodySemiBold: {
    fontSize: getFontSize(14),
    fontFamily: fonts.semiBold,
  },
  caption: {
    fontSize: getFontSize(12),
    fontFamily: fonts.regular,
  },
  captionLight: {
    fontSize: getFontSize(12),
    fontFamily: fonts.light,
  },
  captionMedium: {
    fontSize: getFontSize(12),
    fontFamily: fonts.medium,
  },
  boldCaption: {
    fontSize: getFontSize(14),
    fontFamily: fonts.semiBold,
  },
  smallCaption: {
    fontSize: getFontSize(10),
    fontFamily: fonts.regular,
  },
  smallCaptionSemi: {
    fontSize: getFontSize(10),
    fontFamily: fonts.semiBold,
  },
  smallCaptionLight: {
    fontSize: getFontSize(10),
    fontFamily: fonts.light,
  },
});

export const Variant = {
  title: 'title',
  subTitle: 'subTitle',
  regularFont: 'regularFont',
  regularFontSemi: 'regularFontSemi',
  body: 'body',
  bodyMedium: 'bodyMedium',
  bodybold: 'bodybold',
  bodySemiBold: 'bodySemiBold',
  caption: 'caption',
  boldCaption: 'boldCaption',
  captionLight: 'captionLight',
  captionMedium: 'captionMedium',
  ligntBody: 'ligntBody',
  smallCaption: 'smallCaption',
  smallCaptionLight: 'smallCaptionLight',
  smallCaptionSemi: 'smallCaptionSemi',
};
