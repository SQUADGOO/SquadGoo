import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'

const MessageItem = ({
  item,
  onPress,
  showBorder = true,
  containerStyle
}) => {
  const renderGroupAvatar = (groupMembers) => (
    <View style={styles.groupAvatarContainer}>
      <View style={styles.groupAvatarGrid}>
        <Image source={{ uri: groupMembers[0] }} style={styles.groupAvatarItem1} />
        <Image source={{ uri: groupMembers[1] }} style={styles.groupAvatarItem2} />
        <Image source={{ uri: groupMembers[2] }} style={styles.groupAvatarItem3} />
      </View>
      {item.isOnline && <View style={styles.onlineIndicator} />}
    </View>
  )

  const renderSingleAvatar = (avatar, isOnline) => (
    <View style={styles.avatarContainer}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      {isOnline && <View style={styles.onlineIndicator} />}
    </View>
  )

  return (
    <TouchableOpacity
      style={[
        styles.messageItem,
        showBorder && styles.messageItemBorder,
        containerStyle
      ]}
      onPress={() => onPress && onPress(item)}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      {item.isGroup ? 
        renderGroupAvatar(item.groupMembers) : 
        renderSingleAvatar(item.avatar, item.isOnline)
      }

      {/* Message Content */}
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <AppText variant={Variant.subTitle} style={styles.userName}>
            {item.name}
          </AppText>
          <View>

          <AppText variant={Variant.caption} style={styles.timestamp}>
            {item.timestamp}
          </AppText>
          {/* Unread Count */}
      
          </View>
        </View>
        
        <AppText variant={Variant.body} style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </AppText>
      </View>

{/* {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <AppText variant={Variant.caption} style={styles.unreadCount}>
            {item.unreadCount}
          </AppText>
        </View>
      )}
       */}
    </TouchableOpacity>
  )
}

export default MessageItem

const styles = StyleSheet.create({
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  messageItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#F3F4F6',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: wp(3),
  },
  avatar: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: colors.grayE8,
  },
  groupAvatarContainer: {
    position: 'relative',
    marginRight: wp(3),
    width: wp(14),
    height: wp(14),
  },
  groupAvatarGrid: {
    width: wp(14),
    height: wp(14),
    position: 'relative',
  },
  groupAvatarItem1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: colors.grayE8,
  },
  groupAvatarItem2: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
    backgroundColor: colors.grayE8,
    borderWidth: 1,
    borderColor: colors.white,
  },
  groupAvatarItem3: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
    backgroundColor: colors.grayE8,
    borderWidth: 1,
    borderColor: colors.white,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: wp(1),
    right: wp(1),
    width: wp(3.5),
    height: wp(3.5),
    borderRadius: wp(1.75),
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: colors.white,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  userName: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
    flex: 1,
  },
  timestamp: {
   color: colors.textPrimary,
    fontSize: getFontSize(11),
  },
  lastMessage: {
    color: colors.textPrimary,
    fontSize: getFontSize(11),
    lineHeight: 18,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: wp(3),
    minWidth: wp(6),
    width: wp(6),
    height: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: wp(1.5),
    marginLeft: wp(2),
    top: 10,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: getFontSize(11),
    fontWeight: 'bold',
  },
})