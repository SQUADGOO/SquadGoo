import { View, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppInputField from '@/core/AppInputField'
import { colors, hp } from '@/theme'

const FormField = ({
    name,
    label,
    type = 'input',
    rules = {},
    multiline = false,
    placeholder = 'typeHere',
    keyboardType,
    inputWrapperStyle,
    disabled = false,
    ...rest
}) => {
    const { control, formState: { errors } } = useFormContext()
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    
    const togglePasswordVisibility = () => setIsPasswordVisible(prev => !prev)

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
          
            default:
                return (
                    <AppInputField
                        label={label}
                        value={value}
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

const styles = StyleSheet.create({
    // Keep only if you plan to use custom styling later
});