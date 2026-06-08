import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ChatHeader = ({
  userName,
  userAvatar,
  isOnline = false,
  status = 'Active now',
  onBackPress,
  onCallPress,
  onVideoPress
}) => {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="arrow-back"
            size={24}
            color={colors.black}
          />
        </TouchableOpacity>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: userAvatar }} style={styles.avatar} />
            {isOnline && <View style={styles.onlineIndicator} />}
          </View>
          
          <View style={styles.userDetails}>
            <AppText variant={Variant.subTitle} style={styles.userName}>
              {userName}
            </AppText>
            <AppText variant={Variant.caption} style={styles.userStatus}>
              {status}
            </AppText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onCallPress}
            activeOpacity={0.7}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="call"
              size={20}
              color="#F59E0B"
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onVideoPress}
            activeOpacity={0.7}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="videocam"
              size={20}
              color="#F59E0B"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ChatHeader

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingBottom: wp(2.5)
    // paddingVertical: hp(2),
  },
  backButton: {
    padding: wp(1),
    marginRight: wp(2),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: wp(3),
  },
  avatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: colors.grayE8,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: wp(3.5),
    height: wp(3.5),
    borderRadius: wp(1.75),
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: colors.white,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: colors.black,
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginBottom: hp(0.2),
  },
  userStatus: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  actionButtons: {
    flexDirection: 'row',
    gap: wp(2),
  },
  actionButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: colors.grayE8 || '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
})