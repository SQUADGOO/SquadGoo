// screens/SquadSettings.jsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, FormProvider } from 'react-hook-form';
import { colors, getFontSize, hp, wp } from '@/theme';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import VectorIcons from '@/theme/vectorIcon';
import { screenNames } from '@/navigation/screenNames';

const SquadSettings = () => {
  const navigation = useNavigation();
  const methods = useForm({
    defaultValues: {
      name: '',
      description: '',
      taxType: 'ABN',
      experience: '',
    },
  });

  const { watch, setValue, handleSubmit, reset } = methods;

  const [groups, setGroups] = useState([]); // Groups list
  const [modalVisible, setModalVisible] = useState(false);

  const taxType = watch('taxType');

  const handleCreateGroup = (data) => {
    if (!data.name) return; // basic validation
    const newGroup = { ...data, id: Date.now().toString() };
    setGroups([...groups, newGroup]);
    reset();
    setModalVisible(false);
  };

  const renderGroup = ({ item }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() =>
        navigation.navigate(screenNames.GROUP_DETAIL, { group: item })
      }>
      <View style={{ flex: 1 }}>
        <AppText variant={Variant.h3} style={styles.groupTitle}>
          {item.name}
        </AppText>
        <AppText variant={Variant.bodySmall} style={styles.groupDesc}>
          {item.description}
        </AppText>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(screenNames.MEMBERS, {
            groupId: item.id,
            existingMembers: item.members || [],
          })
        }
        style={styles.addMemberBtn}>
        <VectorIcons
          name="Feather"
          iconName="user-plus"
          size={22}
          color={colors.primary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader
        title="Squad Settings"
        showTopIcons={false}
        rightComponent={
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <VectorIcons
              name="Feather"
              iconName="plus-circle"
              size={26}
              color="#FFF"
            />
          </TouchableOpacity>
        }
      />

      {/* Groups List */}
      {groups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AppText variant={Variant.h3} style={styles.emptyText}>
            No squads yet
          </AppText>
          <AppButton
            style={{ backgroundColor: colors.primary, width: '60%' }}
            text="Create Squad"
            onPress={() => setModalVisible(true)}
            textColor="#FFF"
          />
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={renderGroup}
          contentContainerStyle={{ padding: wp(4) }}
        />
      )}

      {/* Create Group Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FormProvider {...methods}>
              <AppText variant={Variant.h2} style={styles.modalTitle}>
                Create Squad
              </AppText>

              <TextInput
                placeholder="Squad Name"
                value={watch('name')}
                onChangeText={(t) => setValue('name', t)}
                style={styles.input}
                placeholderTextColor={colors.gray}
              />
              <TextInput
                placeholder="Description"
                value={watch('description')}
                onChangeText={(t) => setValue('description', t)}
                style={styles.input}
                placeholderTextColor={colors.gray}
                

              />

              {/* Tax Type (styled same as AvailabilityScreen) */}
              <AppText variant={Variant.h2} style={styles.sectionTitle}>
                Required Tax type
              </AppText>
              <View style={styles.taxTypeRow}>
                {['ABN', 'TFN', 'Both'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.taxTypeBtn,
                      taxType === type && styles.taxTypeBtnActive,
                    ]}
                    onPress={() => setValue('taxType', type)}>
                    <AppText
                      style={[
                        styles.taxTypeText,
                        taxType === type && styles.taxTypeTextActive,
                      ]}>
                      {type}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                placeholder="Squad Experience"
                value={watch('experience')}
                onChangeText={(t) => setValue('experience', t)}
                style={styles.input}
                placeholderTextColor={colors.gray}

              />

              <View style={styles.modalButtons}>
                <AppButton
                  text="Cancel"
                  onPress={() => setModalVisible(false)}
                  style={{ flex: 1, marginRight: wp(2) }}
                />
                <AppButton
                  text="Create"
                  onPress={handleSubmit(handleCreateGroup)}
                  style={{ flex: 1 }}
                  textColor="#FFF"
                />
              </View>
            </FormProvider>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SquadSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(6),
  },
  emptyText: {
    color: colors.gray,
    marginBottom: hp(2),
    textAlign: 'center',
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    padding: wp(4),
    marginBottom: hp(1.5),
  },
  groupTitle: {
    color: colors.secondary,
    fontWeight: '600',
  },
  groupDesc: {
    color: colors.gray,
    marginTop: 4,
  },
  addMemberBtn: {
    marginLeft: wp(2),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000077',
    justifyContent: 'center',
    padding: wp(6),
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: wp(5),
  },
  modalTitle: {
    color: colors.secondary,
    marginBottom: hp(2),
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    marginBottom: hp(1.5),
    color: colors.secondary,
  },
  sectionTitle: {
    color: colors.secondary,
    marginBottom: hp(0.5),
  },
  taxTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp(2),
  },
  taxTypeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: hp(1.5),
    borderRadius: 50,
    marginHorizontal: wp(1),
    alignItems: 'center',
  },
  taxTypeBtnActive: {
    backgroundColor: colors.primary,
  },
  taxTypeText: {
    color: colors.primary,
    fontWeight: '600',
  },
  taxTypeTextActive: {
    color: colors.white,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: hp(2),
  },
});
