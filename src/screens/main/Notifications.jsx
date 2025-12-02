import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { 
  selectAllNotifications, 
  markAsRead, 
  markAllAsRead,
  removeNotification 
} from '@/store/notificationsSlice';
import { screenNames } from '@/navigation/screenNames';

const Notifications = ({ navigation }) => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectAllNotifications);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const groups = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    notifications.forEach(notification => {
      const notifDate = new Date(notification.createdAt);
      let groupKey = '';

      if (notifDate >= today) {
        groupKey = 'Today';
      } else if (notifDate >= yesterday) {
        groupKey = 'Yesterday';
      } else {
        groupKey = notifDate.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    });

    return groups;
  }, [notifications]);

  const flatNotifications = useMemo(() => {
    const result = [];
    Object.keys(groupedNotifications).forEach(date => {
      result.push({ type: 'date', date, id: `date-${date}` });
      groupedNotifications[date].forEach(notif => {
        result.push(notif);
      });
    });
    return result;
  }, [groupedNotifications]);

  const handleNotificationPress = (notification) => {
    if (!notification.read) {
      dispatch(markAsRead(notification.id));
    }

    // Navigate based on notification type
    if (notification.jobId) {
      if (notification.type === 'application_received') {
        // Navigate to job candidates screen
        navigation.navigate(screenNames.MANUAL_MATCH_LIST, { jobId: notification.jobId });
      } else if (notification.type === 'offer_accepted' || notification.type === 'offer_declined') {
        // Navigate to job details or offers screen
        navigation.navigate(screenNames.ACTIVE_OFFERS);
      }
    } else if (notification.type === 'chat_message') {
      // Navigate to chat
      navigation.navigate(screenNames.MESSAGES, { chatData: notification.chatData });
    }
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_received':
        return { name: iconLibName.Ionicons, iconName: 'person-add-outline', color: '#3B82F6' };
      case 'offer_accepted':
        return { name: iconLibName.Ionicons, iconName: 'checkmark-circle-outline', color: '#10B981' };
      case 'offer_declined':
        return { name: iconLibName.Ionicons, iconName: 'close-circle-outline', color: '#EF4444' };
      case 'chat_message':
        return { name: iconLibName.Ionicons, iconName: 'chatbubble-outline', color: '#8B5CF6' };
      default:
        return { name: iconLibName.Ionicons, iconName: 'notifications-outline', color: colors.primary };
    }
  };

  const renderNotification = ({ item }) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateHeader}>
          <AppText variant={Variant.bodyMedium} style={styles.dateText}>
            {item.date}
          </AppText>
        </View>
      );
    }

    const icon = getNotificationIcon(item.type);

    return (
      <TouchableOpacity
        style={[styles.notificationItem, !item.read && styles.unreadNotification]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <VectorIcons
            name={icon.name}
            iconName={icon.iconName}
            size={24}
            color={icon.color}
          />
        </View>
        <View style={styles.contentContainer}>
          <AppText variant={Variant.bodyMedium} style={styles.notificationTitle}>
            {item.title}
          </AppText>
          <AppText variant={Variant.body} style={styles.notificationMessage}>
            {item.message}
          </AppText>
          <AppText variant={Variant.caption} style={styles.notificationTime}>
            {formatTime(item.createdAt)}
          </AppText>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader 
        title="Notifications" 
        showTopIcons={false}
        rightComponent={
          notifications.some(n => !n.read) ? (
            <TouchableOpacity onPress={handleMarkAllAsRead}>
              <AppText variant={Variant.body} style={styles.markAllRead}>
                Mark all read
              </AppText>
            </TouchableOpacity>
          ) : null
        }
      />
      {flatNotifications.length === 0 ? (
        <View style={styles.emptyState}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="notifications-off-outline"
            size={64}
            color={colors.gray}
          />
          <AppText variant={Variant.bodyMedium} style={styles.emptyText}>
            No Notifications
          </AppText>
          <AppText variant={Variant.body} style={styles.emptySubText}>
            You'll receive notifications here when there are updates on your jobs or applications.
          </AppText>
        </View>
      ) : (
        <FlatList
          data={flatNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    paddingBottom: hp(5),
  },
  dateHeader: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.5),
    backgroundColor: colors.grayE8 || '#F3F4F6',
  },
  dateText: {
    fontWeight: '600',
    color: colors.gray || '#6B7280',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: wp(5),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#F3F4F6',
    backgroundColor: colors.white,
  },
  unreadNotification: {
    backgroundColor: colors.grayE8 || '#F9FAFB',
  },
  iconContainer: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: colors.grayE8 || '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4),
  },
  contentContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: '600',
    marginBottom: hp(0.5),
    color: colors.black || '#111827',
  },
  notificationMessage: {
    color: colors.gray || '#6B7280',
    marginBottom: hp(0.5),
  },
  notificationTime: {
    color: colors.gray || '#9CA3AF',
  },
  unreadDot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: colors.primary || '#FF6B35',
    marginLeft: wp(2),
    alignSelf: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(10),
  },
  emptyText: {
    marginTop: hp(2),
    fontWeight: '600',
    color: colors.black || '#111827',
  },
  emptySubText: {
    marginTop: hp(1),
    textAlign: 'center',
    color: colors.gray || '#6B7280',
  },
  markAllRead: {
    color: colors.primary || '#FF6B35',
    fontWeight: '600',
  },
});

