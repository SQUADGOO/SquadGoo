// screens/SquadSettings.jsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Image,
  ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm, FormProvider } from "react-hook-form";
import ImagePicker from "react-native-image-crop-picker";
import { colors, hp, wp } from "@/theme";
import AppHeader from "@/core/AppHeader";
import AppText, { Variant } from "@/core/AppText";
import AppButton from "@/core/AppButton";
import VectorIcons from "@/theme/vectorIcon";
import { screenNames } from "@/navigation/screenNames";

const jobList = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Mobile App Developer",
  "DevOps Engineer",
  "Data Scientist",
  "QA Engineer",
  "Project Manager",
  "Business Analyst",
  "Cloud Engineer",
  "Cyber Security Specialist",
  "Database Administrator",
  "Technical Support",
];

const SquadSettings = () => {
  const navigation = useNavigation();
  const methods = useForm({
    defaultValues: {
      name: "",
      description: "",
      taxType: "ABN",
      experience: "",
      preferredJobs: [],
    },
  });

  const { watch, setValue, handleSubmit, reset } = methods;

  const [groups, setGroups] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [jobsModalVisible, setJobsModalVisible] = useState(false);

  const taxType = watch("taxType");
  const preferredJobs = watch("preferredJobs");

  // pick image with cropper
  const handlePickImage = async () => {
    try {
      const img = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: "photo",
      });
      setProfileImage(img.path);
    } catch (err) {
      console.log("Image pick cancelled", err);
    }
  };

  const toggleJobSelection = (job) => {
    let updated = [...preferredJobs];
    if (updated.includes(job)) {
      updated = updated.filter((j) => j !== job);
    } else {
      updated.push(job);
    }
    setValue("preferredJobs", updated);
  };

  const handleCreateGroup = (data) => {
    if (!data.name) return;

    const newGroup = {
      ...data,
      id: Date.now().toString(),
      image: profileImage,
    };

    setGroups([...groups, newGroup]);
    reset();
    setProfileImage(null);
    setModalVisible(false);
  };

  const renderGroup = ({ item }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() =>
        navigation.navigate(screenNames.GROUP_DETAIL, { group: item })
      }
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.groupImage} />
      ) : (
        <View style={styles.groupImagePlaceholder}>
          <VectorIcons
            name="Feather"
            iconName="users"
            size={20}
            color={colors.gray}
          />
        </View>
      )}
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
        style={styles.addMemberBtn}
      >
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

      {groups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AppText variant={Variant.h3} style={styles.emptyText}>
            No squads yet
          </AppText>
          <AppButton
            style={{ backgroundColor: colors.primary, width: "60%" }}
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
{/* Create Group Modal */}
<Modal visible={modalVisible} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <FormProvider {...methods}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp(2) }}
        >
          <AppText variant={Variant.h2} style={styles.modalTitle}>
            Create Squad
          </AppText>

          {/* Profile Image Picker */}
          <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.preview} />
            ) : (
              <AppText style={{ color: colors.gray }}>
                Upload Squad Image
              </AppText>
            )}
          </TouchableOpacity>

          <TextInput
            placeholder="Squad Name"
            value={watch("name")}
            onChangeText={(t) => setValue("name", t)}
            style={styles.input}
            placeholderTextColor={colors.gray}
          />
          <TextInput
            placeholder="Description"
            value={watch("description")}
            onChangeText={(t) => setValue("description", t)}
            style={styles.input}
            placeholderTextColor={colors.gray}
          />

          <AppText variant={Variant.h2} style={styles.sectionTitle}>
            Required Tax type
          </AppText>
          <View style={styles.taxTypeRow}>
            {["ABN", "TFN", "Both"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.taxTypeBtn,
                  taxType === type && styles.taxTypeBtnActive,
                ]}
                onPress={() => setValue("taxType", type)}
              >
                <AppText
                  style={[
                    styles.taxTypeText,
                    taxType === type && styles.taxTypeTextActive,
                  ]}
                >
                  {type}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Squad Experience"
            value={watch("experience")}
            onChangeText={(t) => setValue("experience", t)}
            style={styles.input}
            placeholderTextColor={colors.gray}
          />

          {/* Preferred Jobs Dropdown */}
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setJobsModalVisible(true)}
          >
            <AppText style={{ color: colors.gray }}>
              {preferredJobs.length > 0
                ? `Selected Jobs (${preferredJobs.length})`
                : "Select Preferred Jobs"}
            </AppText>
          </TouchableOpacity>

          {/* Selected jobs as tags (scrollable if too many) */}
          <ScrollView
            style={styles.tagsScroll}
            contentContainerStyle={styles.tagsContainer}
            showsVerticalScrollIndicator={false}
          >
            {preferredJobs.map((job) => (
              <View key={job} style={styles.tag}>
                <AppText style={styles.tagText}>{job}</AppText>
                <TouchableOpacity onPress={() => toggleJobSelection(job)}>
                  <VectorIcons
                    name="Feather"
                    iconName="x"
                    size={14}
                    color="#FFF"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

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
        </ScrollView>
      </FormProvider>
    </View>
  </View>
</Modal>

      {/* Jobs Selection Modal */}
      <Modal visible={jobsModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppText variant={Variant.h2} style={styles.modalTitle}>
              Select Preferred Jobs
            </AppText>
            <FlatList
              data={jobList}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.jobItem}
                  onPress={() => toggleJobSelection(item)}
                >
                  <AppText style={styles.jobText}>{item}</AppText>
                  {preferredJobs.includes(item) && (
                    <VectorIcons
                      name="Feather"
                      iconName="check-circle"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
            />

            <AppButton
              text="Done"
              onPress={() => setJobsModalVisible(false)}
              style={{ marginTop: hp(2) }}
              textColor="#FFF"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SquadSettings;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp(6),
  },
  emptyText: {
    color: colors.gray,
    marginBottom: hp(2),
    textAlign: "center",
  },
  groupCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    padding: wp(4),
    marginBottom: hp(1.5),
  },
  groupImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: wp(3),
  },
  groupImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  groupTitle: { color: colors.secondary, fontWeight: "600" },
  groupDesc: { color: colors.gray, marginTop: 4 },
  addMemberBtn: { marginLeft: wp(2) },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000077",
    justifyContent: "center",
    padding: wp(6),
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: wp(5),
    maxHeight: hp(80),
  },
  modalTitle: {
    color: colors.secondary,
    marginBottom: hp(2),
    textAlign: "center",
  },
  imagePicker: {
    height: 120,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  preview: { width: "100%", height: "100%", borderRadius: 8 },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    marginBottom: hp(1.5),
    color: colors.secondary,
  },
  sectionTitle: { color: colors.secondary, marginBottom: hp(0.5) },
  taxTypeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: hp(2),
  },
  taxTypeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: hp(1.5),
    borderRadius: 50,
    marginHorizontal: wp(1),
    alignItems: "center",
  },
  taxTypeBtnActive: { backgroundColor: colors.primary },
  taxTypeText: { color: colors.primary, fontWeight: "600" },
  taxTypeTextActive: { color: colors.white },
  modalButtons: { flexDirection: "row", marginTop: hp(2) },
  dropdown: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: wp(3),
    marginBottom: hp(1.5),
  },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: hp(1) },
  tag: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: 20,
    alignItems: "center",
    margin: 3,
  },
  tagText: { color: "#FFF", marginRight: 5, fontSize: 10 },
  jobItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  jobText: { color: colors.secondary },
  tagsScroll: {
  maxHeight: hp(15), // prevent overflow
  marginBottom: hp(1.5),
},
tagsContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
},

});
