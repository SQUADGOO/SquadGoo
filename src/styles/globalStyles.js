// src/styles/globalStyles.js
import {fonts} from '@/assets/fonts';
import {colors, getFontSize, hp, wp} from '@/theme';
import {StyleSheet} from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    backgroundColor: colors.bgColor,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowJustify: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  columnJustify: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  columnCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRowGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: hp(1),
  },
  flexRowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  flexColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  flexJustifyStart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  authLogo: {
    height: wp(10),
    width: wp(55),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: hp(4),
  },
  errorText: {
    color: colors.red,
    fontSize: getFontSize(12),
    marginBottom: hp(1),
    fontFamily: fonts.regular,
  },
  topTextMargin: {
    textAlign: 'center',
    marginTop: hp(5),
  },
  hitSlop: {
    top: hp(0.8),
    left: hp(0.8),
    right: hp(0.8),
    bottom: hp(0.8),
  },
  paginateStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: wp(4),
  },
  labelFont: {
    fontSize: getFontSize(14),
  },
});

export default globalStyles;
