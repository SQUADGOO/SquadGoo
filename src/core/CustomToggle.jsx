import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, hp, wp, getFontSize } from "@/theme";
import AppText from "./AppText";

const CustomToggle = ({ label = "Public holidays", onChange, defaultValue = "Yes" }) => {
  const [selected, setSelected] = useState(defaultValue);

  const handlePress = (value) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Toggle container */}
      <View style={styles.toggleContainer}>
        {/* Yes */}
        <TouchableOpacity
          style={[
            styles.option,
            selected === "Yes" && styles.activeOption,
            // { borderTopLeftRadius: 30, borderBottomLeftRadius: 30 }
          ]}
          onPress={() => handlePress("Yes")}
        >
          <AppText
            style={[
              styles.optionText,
              selected === "Yes" && styles.activeText
            ]}
          >
            Yes
          </AppText>
        </TouchableOpacity>

        {/* No */}
        <TouchableOpacity
          style={[
            styles.option,
            selected === "No" && styles.activeOption,
          ]}
          onPress={() => handlePress("No")}
        >
          <AppText
            style={[
              styles.optionText,
              selected === "No" && styles.activeText
            ]}
          >
            No
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomToggle;

const styles = StyleSheet.create({
  container: {
    // marginVertical: hp(2),
  },
  label: {
    fontSize: getFontSize(14),
    fontWeight: "500",
    color: colors.secondary || "#374151",
    marginBottom: hp(1),
  },
  toggleContainer: {
    flexDirection: "row",
    borderWidth: 2,
    padding: 2,
    borderColor: colors.primary,
    borderRadius: 30,
    overflow: "hidden",
  },
  option: {
    flex: 1,
    paddingVertical: hp(1),
    alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "transparent",
  },
  activeOption: {
    backgroundColor: colors.primary,
    borderRadius: 50,
  },
  optionText: {
    fontSize: getFontSize(13),
    color: colors.primary,
    fontWeight: "600",
  },
  activeText: {
    color: "#FFFFFF",
  },
});
