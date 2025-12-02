import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { selectUnreadCount } from '@/store/notificationsSlice';
import { colors, hp, wp, getFontSize } from '@/theme';

const NotificationBadge = ({ style }) => {
  const unreadCount = useSelector(selectUnreadCount);

  if (unreadCount === 0) {
    return null;
  }

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.badgeText}>
        {unreadCount > 99 ? '99+' : unreadCount}
      </Text>
    </View>
  );
};

export default NotificationBadge;

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.primary || '#FF6B35',
    borderRadius: hp(1.5),
    minWidth: hp(3),
    height: hp(3),
    paddingHorizontal: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -hp(0.5),
    right: -wp(2),
    borderWidth: 2,
    borderColor: colors.white || '#FFFFFF',
  },
  badgeText: {
    color: colors.white || '#FFFFFF',
    fontSize: getFontSize(10),
    fontWeight: 'bold',
  },
});

