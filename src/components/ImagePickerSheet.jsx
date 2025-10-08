import React, { forwardRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { colors, wp } from "@/theme";
import VectorIcons, { iconLibName } from "@/theme/vectorIcon";
import { openCamera, openGallery } from "@/utilities/helperFunctions";
import RbSheetComponent from "@/core/RbSheetComponent";

const ImagePickerSheet = forwardRef(({ onSelect }, ref) => {
  const [loading, setLoading] = useState(false);

  const handleCamera = async () => {
    try {
      setLoading(true);
      const image = await openCamera();
      onSelect?.(image);
      ref.current?.close();
    } catch (err) {
      console.log("Camera error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGallery = async () => {
    try {
      setLoading(true);
      const image = await openGallery();
      onSelect?.(image);
      ref.current?.close();
    } catch (err) {
      console.log("Gallery error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RbSheetComponent ref={ref} height={220} bgColor={colors.white}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => ref.current?.close()} style={{ position: "absolute", top: 15, right: 10 }}>
          <VectorIcons name={iconLibName.Ionicons} iconName="close-circle" size={wp(7)} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Choose an Option</Text>

        <TouchableOpacity style={styles.button} onPress={handleCamera}>
          <VectorIcons
            name={iconLibName.Feather}
            iconName="camera"
            size={20}
            color={colors.primaryDark}
          />
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleGallery}>
          <VectorIcons
            name="Feather"
            iconName="image"
            size={20}
            color={colors.primaryDark}
          />
          <Text style={styles.buttonText}>Open Gallery</Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={{ marginTop: 10 }}
          />
        )}
      </View>
    </RbSheetComponent>
  );
});

export default ImagePickerSheet;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 16,
    color: colors.black,
  },
  button: {
    width: "90%",
    flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.primaryDark,
  },
});
