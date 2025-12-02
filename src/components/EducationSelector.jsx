import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import AppInputField from '@/core/AppInputField';
import RbSheetComponent from '@/core/RbSheetComponent';
import { EDUCATION_LEVELS } from '@/utilities/appData';

const EducationSelector = ({ onSelect, selectedEducation, placeholder = 'Select education level' }) => {
  const sheetRef = useRef(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [courseValue, setCourseValue] = useState('');
  const [facultyValue, setFacultyValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [otherValue, setOtherValue] = useState('');

  const educationLevels = Object.keys(EDUCATION_LEVELS);
  const filteredLevels = educationLevels.filter(level =>
    level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpen = () => {
    setSelectedLevel(null);
    setCourseValue('');
    setFacultyValue('');
    setSearchQuery('');
    setOtherValue('');
    sheetRef.current?.open();
  };

  const handleLevelSelect = (level) => {
    if (level === 'OTHERS') {
      setSelectedLevel('OTHERS');
    } else {
      setSelectedLevel(level);
      setCourseValue('');
      setFacultyValue('');
    }
  };

  const handleConfirm = () => {
    const levelConfig = EDUCATION_LEVELS[selectedLevel];
    
    if (selectedLevel === 'OTHERS') {
      if (otherValue.trim()) {
        onSelect && onSelect({
          level: selectedLevel,
          course: null,
          faculty: null,
          customValue: otherValue.trim(),
        });
        sheetRef.current?.close();
      }
    } else if (selectedLevel === '<_10th') {
      onSelect && onSelect({
        level: selectedLevel,
        course: null,
        faculty: null,
      });
      sheetRef.current?.close();
    } else if (levelConfig.requiresCourse && levelConfig.requiresFaculty) {
      if (courseValue.trim() && facultyValue.trim()) {
        onSelect && onSelect({
          level: selectedLevel,
          course: courseValue.trim(),
          faculty: facultyValue.trim(),
        });
        sheetRef.current?.close();
      }
    }
  };

  const displayValue = () => {
    if (selectedEducation?.customValue) {
      return selectedEducation.customValue;
    }
    if (selectedEducation?.level) {
      let display = selectedEducation.level;
      if (selectedEducation.course) {
        display += ` - ${selectedEducation.course}`;
      }
      if (selectedEducation.faculty) {
        display += ` (${selectedEducation.faculty})`;
      }
      return display;
    }
    return placeholder;
  };

  const levelConfig = selectedLevel ? EDUCATION_LEVELS[selectedLevel] : null;
  const showCourseInput = selectedLevel && levelConfig?.requiresCourse && selectedLevel !== 'OTHERS';
  const showFacultyInput = selectedLevel && levelConfig?.requiresFaculty && selectedLevel !== 'OTHERS';
  const showOtherInput = selectedLevel === 'OTHERS';
  const canConfirm = showOtherInput
    ? otherValue.trim()
    : selectedLevel === '<_10th'
    ? true
    : showCourseInput && showFacultyInput
    ? courseValue.trim() && facultyValue.trim()
    : false;

  return (
    <>
      <TouchableOpacity onPress={handleOpen} activeOpacity={0.7}>
        <View pointerEvents="none">
          <AppInputField
            placeholder={placeholder}
            value={displayValue()}
            editable={false}
            endIcon={
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="chevron-down"
                size={20}
                color={colors.gray}
              />
            }
          />
        </View>
      </TouchableOpacity>

      <RbSheetComponent ref={sheetRef} height={hp(80)}>
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            {selectedLevel && (
              <TouchableOpacity onPress={() => {
                setSelectedLevel(null);
                setCourseValue('');
                setFacultyValue('');
                setOtherValue('');
              }} style={styles.backButton}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="arrow-back"
                  size={24}
                  color={colors.black}
                />
              </TouchableOpacity>
            )}
            <AppText variant={Variant.subTitle} style={styles.headerTitle}>
              {selectedLevel ? 
               (selectedLevel === 'OTHERS' ? 'Enter Education' : 
                selectedLevel === '<_10th' ? 'Confirm Education Level' :
                'Enter Course Details') : 
               'Select Education Level'}
            </AppText>
            <TouchableOpacity
              onPress={() => sheetRef.current?.close()}
              style={styles.closeButton}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="close"
                size={24}
                color={colors.black}
              />
            </TouchableOpacity>
          </View>

          {!selectedLevel && (
            <>
              <AppInputField
                placeholder="Search"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                endIcon={
                  <VectorIcons
                    name={iconLibName.Ionicons}
                    iconName="search"
                    size={20}
                    color={colors.gray}
                  />
                }
              />
              <View style={styles.listWrapper}>
                <FlatList
                  data={filteredLevels}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.optionItem}
                      onPress={() => handleLevelSelect(item)}
                      activeOpacity={0.7}
                    >
                      <AppText variant={Variant.body} style={styles.optionText}>
                        {item}
                      </AppText>
                      <VectorIcons
                        name={iconLibName.Ionicons}
                        iconName="chevron-forward"
                        size={20}
                        color={colors.gray}
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContent}
                  style={styles.list}
                />
              </View>
            </>
          )}

          {selectedLevel === '<_10th' && (
            <View style={styles.confirmContainer}>
              <AppText variant={Variant.body} style={styles.confirmText}>
                Education Level: {selectedLevel}
              </AppText>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <AppText variant={Variant.bodySemiBold} style={styles.confirmButtonText}>
                  Confirm
                </AppText>
              </TouchableOpacity>
            </View>
          )}

          {showCourseInput && showFacultyInput && (
            <View style={styles.inputContainer}>
              <AppInputField
                label="Which course"
                placeholder="Enter course name"
                value={courseValue}
                onChangeText={setCourseValue}
                style={styles.courseInput}
              />
              <AppInputField
                label="In which faculty"
                placeholder="Enter faculty name"
                value={facultyValue}
                onChangeText={setFacultyValue}
                style={styles.facultyInput}
              />
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !canConfirm && styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirm}
                disabled={!canConfirm}
              >
                <AppText variant={Variant.bodySemiBold} style={styles.confirmButtonText}>
                  Confirm
                </AppText>
              </TouchableOpacity>
            </View>
          )}

          {showOtherInput && (
            <View style={styles.inputContainer}>
              <AppInputField
                label="Enter education level"
                placeholder="Type your education level"
                value={otherValue}
                onChangeText={setOtherValue}
                style={styles.otherInput}
              />
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !canConfirm && styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirm}
                disabled={!canConfirm}
              >
                <AppText variant={Variant.bodySemiBold} style={styles.confirmButtonText}>
                  Confirm
                </AppText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </RbSheetComponent>
    </>
  );
};

export default EducationSelector;

const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    minHeight: hp(80),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#E5E7EB',
    marginBottom: hp(2),
  },
  backButton: {
    padding: wp(1),
    marginRight: wp(2),
  },
  headerTitle: {
    flex: 1,
    color: colors.black,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: wp(1),
  },
  searchInput: {
    marginBottom: hp(2),
  },
  listWrapper: {
    flex: 1,
    minHeight: hp(40),
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: hp(2),
    flexGrow: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#F3F4F6',
  },
  optionText: {
    fontSize: getFontSize(16),
    color: colors.textPrimary,
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    paddingTop: hp(2),
  },
  courseInput: {
    marginBottom: hp(2),
  },
  facultyInput: {
    marginBottom: hp(2),
  },
  otherInput: {
    marginBottom: hp(2),
  },
  confirmContainer: {
    flex: 1,
    paddingTop: hp(2),
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: getFontSize(16),
    color: colors.textPrimary,
    marginBottom: hp(3),
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: hp(1),
    paddingVertical: hp(2),
    alignItems: 'center',
    marginTop: hp(2),
  },
  confirmButtonDisabled: {
    backgroundColor: colors.grayE8 || '#E5E7EB',
    opacity: 0.5,
  },
  confirmButtonText: {
    color: colors.white,
  },
});

