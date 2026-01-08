import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Pressable,
  Dimensions,
} from "react-native";
import VectorIcons, { iconLibName } from "@/theme/vectorIcon";
import { colors, hp, wp, getFontSize } from "@/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MoreMenu = ({ navigation, onExit }) => {
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  const menuItems = [
    {
      id: "support",
      label: "Support",
      icon: "help-circle-outline",
      route: "MARKETPLACE_SUPPORT",
      divider: false,
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: "wallet-outline",
      route: "Wallet",
      divider: false,
    },
    {
      id: "settings",
      label: "Settings",
      icon: "settings-outline",
      route: null, // Coming soon
      disabled: true,
      divider: true,
    },
    {
      id: "exit",
      label: "Exit Marketplace",
      icon: "exit-outline",
      route: null,
      isExit: true,
      divider: false,
    },
  ];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(-20);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    });
  };

  const handleItemPress = (item) => {
    handleClose();
    
    if (item.disabled) {
      return;
    }

    if (item.isExit) {
      if (onExit) {
        onExit();
      } else {
        navigation.goBack();
      }
      return;
    }

    if (item.route) {
      setTimeout(() => {
        navigation.navigate(item.route);
      }, 200);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName="ellipsis-vertical"
          size={22}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="none"
        onRequestClose={handleClose}
      >
        <Pressable style={styles.overlay} onPress={handleClose}>
          <Animated.View
            style={[
              styles.menuContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {menuItems.map((item, index) => (
              <React.Fragment key={item.id}>
                {item.divider && index > 0 && <View style={styles.divider} />}
                <TouchableOpacity
                  style={[
                    styles.menuItem,
                    item.disabled && styles.menuItemDisabled,
                    item.isExit && styles.menuItemExit,
                  ]}
                  onPress={() => handleItemPress(item)}
                  disabled={item.disabled}
                  activeOpacity={0.7}
                >
                  <VectorIcons
                    name={iconLibName.Ionicons}
                    iconName={item.icon}
                    size={20}
                    color={
                      item.disabled
                        ? colors.gray
                        : item.isExit
                        ? colors.red
                        : colors.black
                    }
                  />
                  <Text
                    style={[
                      styles.menuItemText,
                      item.disabled && styles.menuItemTextDisabled,
                      item.isExit && styles.menuItemTextExit,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.disabled && (
                    <Text style={styles.comingSoon}>Soon</Text>
                  )}
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
};

export default MoreMenu;

const styles = StyleSheet.create({
  menuButton: {
    padding: wp(2),
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  menuContainer: {
    position: "absolute",
    top: hp(12),
    right: wp(4),
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: hp(1),
    minWidth: wp(50),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    gap: wp(3),
  },
  menuItemDisabled: {
    opacity: 0.6,
  },
  menuItemExit: {
    // No special style, handled by text color
  },
  menuItemText: {
    fontSize: getFontSize(15),
    fontWeight: "500",
    color: colors.black,
    flex: 1,
  },
  menuItemTextDisabled: {
    color: colors.gray,
  },
  menuItemTextExit: {
    color: colors.red,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayE8,
    marginVertical: hp(0.5),
    marginHorizontal: wp(4),
  },
  comingSoon: {
    fontSize: getFontSize(10),
    color: colors.gray,
    backgroundColor: colors.grayE8,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: 4,
  },
});

