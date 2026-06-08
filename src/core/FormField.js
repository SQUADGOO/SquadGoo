import { View, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppInputField from '@/core/AppInputField';
import AppDatePickerModal from '@/core/AppDatePickerModal';
import { colors, hp } from '@/theme';

const FormField = ({
  name,
  label,
  type = 'input',
  onPressField,
  rules = {},
  multiline = false,
  placeholder = 'typeHere',
  keyboardType,
  inputWrapperStyle,
  disabled = false,
  maximumDate,
  minimumDate,
  mode = 'date',
  ...rest
}) => {
  const { control, formState: { errors } } = useFormContext();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible(prev => !prev);

  const renderInputByType = (field) => {
    const { onChange, value } = field;

    switch (type) {
      case 'passwordInput':
        return (
          <AppInputField
            label={label}
            value={value}
            placeholder={placeholder}
            onChangeText={onChange}
            secureTextEntry={!isPasswordVisible}
            editable={!disabled}
            endIcon={
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName={!isPasswordVisible ? 'eye-off' : 'eye'}
                  size={hp(2)}
                  color={colors.black}
                />
              </TouchableOpacity>
            }
            error={errors[name]?.message}
            wrapperStyle={inputWrapperStyle}
            keyboardType={keyboardType}
            {...rest}
          />
        );

      case 'datePicker':
      case 'timePicker':
        return (
          <AppDatePickerModal
            label={label}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            mode={type === 'timePicker' ? 'time' : mode}
          />
        );

      default:
        return (
          <AppInputField
            label={label}
            value={value}
            onPressField={onPressField}
            multiline={multiline}
            onChangeText={onChange}
            placeholder={placeholder}
            error={errors[name]?.message}
            wrapperStyle={inputWrapperStyle}
            keyboardType={keyboardType}
            editable={!disabled}
            {...rest}
          />
        );
    }
  };

  return (
    <View>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field }) => renderInputByType(field)}
      />
    </View>
  );
};

export default FormField;

const styles = StyleSheet.create({});
