import React, { useState, useEffect } from 'react';
import { View, Modal, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppInputField from './AppInputField';
import { colors, hp } from '@/theme';
import AppButton from './AppButton';

const AppDatePickerModal = ({
  label = 'Date of Birth',
  value,
  onChange,
  maximumDate,
  minimumDate,
  mode = 'date',
  placeholder = 'Select date',
}) => {
  const [visible, setVisible] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());

  useEffect(() => {
    if (value) setTempDate(new Date(value));
  }, [value]);

  const handleConfirm = (date) => {
    onChange(date);
    setVisible(false);
  };

  const handleCancel = () => {
    setTempDate(value || new Date());
    setVisible(false);
  };

  const formatDisplayValue = () => {
    if (!value) return '';
    const date = new Date(value);
    if (mode === 'time') {
      // Format time as HH:MM
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return date.toDateString();
  };

  return (
    <View style={styles.container}>
      <AppInputField
        label={label}
        value={formatDisplayValue()}
        placeholder={placeholder}
        onPressField={() => setVisible(true)}
        editable={false}
      />

      <Modal
        transparent
        visible={visible}
        animationType="slide"
        onRequestClose={handleCancel}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <DateTimePicker
              value={tempDate}
              mode={mode}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={maximumDate}
              minimumDate={minimumDate}
              onChange={(event, selectedDate) => {
                if (Platform.OS === 'android') {
                  if (event.type === 'set' && selectedDate) {
                    handleConfirm(selectedDate);
                  }
                  setVisible(false);
                } else if (selectedDate) {
                  setTempDate(selectedDate);
                }
              }}
            />
            {Platform.OS === 'ios' && (
              <View style={styles.iosButtons}>
                <AppButton
                  text="Done"
                  bgColor={colors.primary}
                  onPress={() => handleConfirm(tempDate)}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AppDatePickerModal;

const styles = StyleSheet.create({
  // container: { marginBottom: hp(2) },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
  },
  iosButtons: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
