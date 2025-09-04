import React, {memo, useRef} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import AppText, {Variant} from './AppText';
import {borders, colors, getFontSize, hp, wp} from '@/theme';
import globalStyles from '@/styles/globalStyles';
import {fonts} from '@/assets/fonts';

const AppInputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  style,
  labelStyle,
  inputStyle,
  wrapperStyle,
  startIcon,
  endIcon,
  onEndIconPress,
  timeInput = false,
  onPressTimeInput,
  multiline = false,
  ...props
}) => {
  const inputRef = useRef();
  const {writingDirection, textAlign, flexDirection} = {
    writingDirection: 'ltr',
    textAlign: 'left',
    flexDirection: 'row',
  };

  const handlePress = () => {
    if (timeInput) onPressTimeInput?.();
    else inputRef.current?.focus();
  };

  const renderInputContent = () => {
    if (timeInput) {
      return (
        <AppText
          numberOfLines={1}
          style={[
            styles.input,
            inputStyle,
            {color: value ? colors.black : colors.darkGray, textAlign},
            startIcon && {paddingLeft: wp(1.5)},
            endIcon && {paddingRight: 10},
          ]}>
          {value || placeholder}
        </AppText>
      );
    }

    return (
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          inputStyle,
          {writingDirection, textAlign},
          startIcon && {paddingLeft: wp(1.5)},
          endIcon && {paddingRight: 10, writingDirection},
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor={colors.gray}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        autoCapitalize="none"
        {...props}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <AppText
          variant={Variant.boldCaption}
          style={[styles.label, {textAlign}, labelStyle]}>
          {label}
        </AppText>
      )}

      <Pressable
        onPress={handlePress}
        style={[
          styles.inputWrapper,
          wrapperStyle,
          {height: multiline ? hp(16.8) : hp(5.8)},
          multiline && {alignItems: 'flex-start', paddingVertical: hp(1)},
        ]}>
        {startIcon}
        {renderInputContent()}
        {endIcon && (
          <TouchableOpacity
            onPress={onEndIconPress}
            style={styles.endIconWrapper}>
            {endIcon}
          </TouchableOpacity>
        )}
      </Pressable>
      {error && (
        <AppText style={[styles.errorText, {textAlign}]}>{error}</AppText>
      )}
    </View>
  );
};

export default memo(AppInputField);

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(2),
  },
  label: {
    marginLeft: wp(0.5),
    color: colors.grayLabel,
    marginBottom: hp(0.6),
  },
  inputWrapper: {
    ...globalStyles.flexRow,
    backgroundColor: colors.white,
    borderRadius: hp(1),
    borderWidth: borders.borderWidthThin,
    borderColor: colors.gray02,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: getFontSize(14),
    fontFamily: fonts.regular,
    color: colors.black,
  },
  endIconWrapper: {
    paddingRight: 10,
  },
  errorText: {
    color: colors.red,
    fontSize: getFontSize(12),
    marginTop: hp(0.6),
    marginLeft: wp(0.5),
  },
});
