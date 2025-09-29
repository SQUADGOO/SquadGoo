// screens/Members.jsx
import React, { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors, hp, wp } from "@/theme";
import AppHeader from "@/core/AppHeader";
import AppText, { Variant } from "@/core/AppText";
import AppButton from "@/core/AppButton";
import VectorIcons from "@/theme/vectorIcon";
import { screenNames } from "@/navigation/screenNames";

const dummyMembers = [
  { id: "1", name: "Ali Khan" },
  { id: "2", name: "Sara Ahmed" },
  { id: "3", name: "Bilal Sheikh" },
  { id: "4", name: "Fatima Noor" },
  { id: "5", name: "Hassan Raza" },
];

const Members = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { onDone, existingMembers } = route.params || {};

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(existingMembers);

  const toggleSelect = (member) => {
    if (selected.some((m) => m.id === member.id)) {
      setSelected(selected.filter((m) => m.id !== member.id));
    } else {
      setSelected([...selected, member]);
    }
  };

  const filtered = dummyMembers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDone = () => {
  navigation.navigate({
    name: screenNames.SQUAD_SETTINGS,
    params: { updatedGroup: { id: route.params.groupId, members: selected } },
    merge: true,
  });
};


  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppHeader
        title="Add Members"
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={handleDone}>
            <AppText variant={Variant.bodySmall} style={{ color: colors.primary }}>
              Done
            </AppText>
          </TouchableOpacity>
        }
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <VectorIcons name="Feather" iconName="search" size={20} color={colors.gray} />
        <TextInput
          placeholder="Search members..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Members List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selected.some((m) => m.id === item.id);
          return (
            <TouchableOpacity
              style={styles.memberCard}
              onPress={() => toggleSelect(item)}
            >
              <AppText variant={Variant.body} style={{ flex: 1 }}>
                {item.name}
              </AppText>
              {isSelected && (
                <VectorIcons
                  name="Feather"
                  iconName="check-circle"
                  size={22}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ padding: wp(4) }}
      />
    </View>
  );
};

export default Members;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    margin: wp(4),
    paddingHorizontal: wp(3),
  },
  searchInput: {
    flex: 1,
    padding: hp(1),
    color: colors.secondary,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: wp(3),
    marginBottom: hp(1),
  },
});
