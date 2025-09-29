// screens/GroupDetail.jsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { colors, hp, wp } from '@/theme';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import VectorIcons from '@/theme/vectorIcon';

const GroupDetail = () => {
  const route = useRoute();
  const { group } = route.params; // passed from SquadSettings

  const [members, setMembers] = useState([
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMember, setNewMember] = useState('');

  const addMember = () => {
    if (!newMember.trim()) return;
    setMembers([...members, { id: Date.now().toString(), name: newMember }]);
    setNewMember('');
    setModalVisible(false);
  };

  const renderMember = ({ item }) => (
    <View style={styles.memberCard}>
      <VectorIcons name="Feather" iconName="user" size={20} color={colors.secondary} />
      <AppText variant={Variant.bodyMedium} style={styles.memberName}>
        {item.name}
      </AppText>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader
        title="Group Details"
        showTopIcons={false}
        rightComponent={
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <VectorIcons name="Feather" iconName="user-plus" size={24} color="#FFF" />
          </TouchableOpacity>
        }
      />

      {/* Group Info */}
      <View style={styles.groupInfo}>
        <AppText variant={Variant.h2} style={styles.groupTitle}>
          {group.name}
        </AppText>
        <AppText variant={Variant.bodySmall} style={styles.groupDesc}>
          {group.description || 'No description'}
        </AppText>

        <View style={styles.infoRow}>
          <VectorIcons name="MaterialIcons" iconName="receipt" size={18} color={colors.secondary} />
          <AppText style={styles.groupDetailText}>
            <AppText style={styles.label}>Tax Info: </AppText>
            {group.taxInfo || 'N/A'}
          </AppText>
        </View>

        <View style={styles.infoRow}>
          <VectorIcons name="Ionicons" iconName="briefcase-outline" size={18} color={colors.secondary} />
          <AppText style={styles.groupDetailText}>
            <AppText style={styles.label}>Experience: </AppText>
            {group.experience || 'N/A'}
          </AppText>
        </View>
      </View>

      {/* Members List */}
      <View style={styles.membersHeader}>
        <VectorIcons name="Feather" iconName="users" size={20} color={colors.secondary} />
        <AppText variant={Variant.h3} style={styles.membersTitle}>
          Squad Members
        </AppText>
      </View>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={renderMember}
        contentContainerStyle={{ paddingBottom: hp(4) }}
      />

      {/* Add Member Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppText variant={Variant.h2} style={styles.modalTitle}>
              Add Member
            </AppText>

            <View style={styles.inputRow}>
              <VectorIcons name="Feather" iconName="user" size={20} color={colors.gray} />
              <TextInput
                placeholder="Member Name"
                value={newMember}
                onChangeText={setNewMember}
                style={styles.input}
              />
            </View>

            <View style={styles.modalButtons}>
              <AppButton
                text="Cancel"
                onPress={() => setModalVisible(false)}
                style={{ flex: 1, marginRight: wp(2) }}
              />
              <AppButton
                text="Add"
                onPress={addMember}
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

export default GroupDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  groupInfo: {
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  groupTitle: {
    color: colors.secondary,
    marginBottom: hp(0.5),
  },
  groupDesc: {
    color: colors.gray,
    marginBottom: hp(1.5),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  groupDetailText: {
    color: colors.secondary,
    marginLeft: wp(2),
  },
  label: {
    fontWeight: '600',
    color: colors.secondary,
  },
  membersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  membersTitle: {
    marginLeft: wp(2),
    color: colors.secondary,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(4),
    marginHorizontal: wp(4),
    marginBottom: hp(1),
    backgroundColor: colors.lightGray,
    borderRadius: 10,
  },
  memberName: {
    marginLeft: wp(2),
    color: colors.secondary,
    fontWeight: '500',
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: wp(3),
    marginBottom: hp(1.5),
  },
  input: {
    flex: 1,
    paddingVertical: hp(1.5),
    marginLeft: wp(2),
    color: colors.secondary,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: hp(2),
  },
});
