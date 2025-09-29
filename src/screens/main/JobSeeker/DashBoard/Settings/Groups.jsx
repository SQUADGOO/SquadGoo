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
import { colors, getFontSize, hp, wp } from '@/theme';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import VectorIcons from '@/theme/vectorIcon';
import { screenNames } from '@/navigation/screenNames';

const SquadSettingsGroups = () => {
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]); // Groups list
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    taxInfo: '',
    experience: '',
  });

  const handleCreateGroup = () => {
    if (!form.name) return; // basic validation
    const newGroup = { ...form, id: Date.now().toString() };
    setGroups([...groups, newGroup]);
    setForm({ name: '', description: '', taxInfo: '', experience: '' });
    setModalVisible(false);
  };

  const renderGroup = ({ item }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => navigation.navigate(screenNames.GROUP_DETAIL, { group: item })}
    >
      <View style={{ flex: 1 }}>
        <AppText variant={Variant.h3} style={styles.groupTitle}>
          {item.name}
        </AppText>
        <AppText variant={Variant.bodySmall} style={styles.groupDesc}>
          {item.description}
        </AppText>
      </View>
      <TouchableOpacity style={styles.addMemberBtn}>
        <VectorIcons
          lib="Feather"
          name="user-plus"
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
            <VectorIcons lib="Feather" name="plus-circle" size={26} color="#FFF" />
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
            <AppText variant={Variant.h2} style={styles.modalTitle}>
              Create Squad
            </AppText>

            <TextInput
              placeholder="Squad Name"
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t })}
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              value={form.description}
              onChangeText={(t) => setForm({ ...form, description: t })}
              style={styles.input}
            />
            <TextInput
              placeholder="Tax Info"
              value={form.taxInfo}
              onChangeText={(t) => setForm({ ...form, taxInfo: t })}
              style={styles.input}
            />
            <TextInput
              placeholder="Squad Experience"
              value={form.experience}
              onChangeText={(t) => setForm({ ...form, experience: t })}
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <AppButton
                text="Cancel"
                onPress={() => setModalVisible(false)}
                style={{ flex: 1, marginRight: wp(2) }}
              />
              <AppButton
                text="Create"
                onPress={handleCreateGroup}
                style={{ flex: 1 }}
                textColor="#FFF"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SquadSettingsGroups;

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
  modalButtons: {
    flexDirection: 'row',
    marginTop: hp(2),
  },
});
