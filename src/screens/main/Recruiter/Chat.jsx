import MessageItem from '@/components/chat/MessageItem';
import AppHeader from '@/core/AppHeader';
import { screenNames } from '@/navigation/screenNames';
import { colors } from '@/theme';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { fetchJobChatThreads } from '@/api/jobChatsApi';
import { selectActiveChatSessions } from '@/store/chatSlice';
import { supportAgentProfile } from './supportData';

function formatRelativeTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return d.toLocaleDateString();
}

function mapThreadToListItem(thread) {
  return {
    id: thread.threadId,
    threadId: thread.threadId,
    name: thread.otherUserName || 'Chat partner',
    lastMessage: thread.lastMessage || 'Start the conversation',
    timestamp: formatRelativeTime(thread.lastMessageAt),
    avatar: thread.otherUserPhoto,
    isOnline: false,
    unreadCount: thread.unread ? 1 : 0,
    isGroup: false,
    jobId: thread.jobId,
    otherUserId: thread.otherUserId,
    jobTitle: thread.jobTitle,
    searchType: thread.searchType,
  };
}

function mapSessionToListItem(session, userId) {
  const isSelf = session.userId === userId;
  return {
    id: session.id,
    threadId: session.threadId || session.id,
    name: session.jobTitle || 'Job chat',
    lastMessage: session.jobTitle ? `Chat for ${session.jobTitle}` : 'Job match chat',
    timestamp: formatRelativeTime(session.createdAt),
    avatar: `https://i.pravatar.cc/120?u=${encodeURIComponent(session.otherUserId || session.jobId)}`,
    isOnline: false,
    unreadCount: 0,
    isGroup: false,
    jobId: session.jobId,
    otherUserId: isSelf ? session.otherUserId : session.userId,
    jobTitle: session.jobTitle,
    searchType: session.searchType,
  };
}

const Chat = ({ navigation }) => {
  const userId = useSelector(state => state?.auth?.userInfo?._id || state?.auth?.userInfo?.id || '');
  const localSessions = useSelector(state => selectActiveChatSessions(state, userId));
  const [messages, setMessages] = useState([
    {
      ...supportAgentProfile,
      unreadCount: 1,
      lastMessage: "We're here to help - tap to start the chat.",
      isSupport: true,
    },
  ]);

  const loadThreads = useCallback(async () => {
    try {
      const threads = await fetchJobChatThreads();
      const apiRows = threads.map(mapThreadToListItem);
      if (apiRows.length) {
        setMessages([
          {
            ...supportAgentProfile,
            unreadCount: 1,
            lastMessage: "We're here to help - tap to start the chat.",
            isSupport: true,
          },
          ...apiRows,
        ]);
        return;
      }
    } catch (err) {
      if (__DEV__) {
        console.warn('[Chat] API threads failed, using local sessions', err?.message);
      }
    }

    const localRows = (localSessions || []).map(s => mapSessionToListItem(s, userId));
    setMessages([
      {
        ...supportAgentProfile,
        unreadCount: 1,
        lastMessage: "We're here to help - tap to start the chat.",
        isSupport: true,
      },
      ...localRows,
    ]);
  }, [localSessions, userId]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const handleChatPress = chatItem => {
    navigation.navigate(screenNames.MESSAGES, { chatData: chatItem });
  };

  const renderMessageItem = ({ item, index }) => (
    <MessageItem
      item={item}
      onPress={handleChatPress}
      showBorder={index !== messages.length - 1}
    />
  );

  return (
    <>
      <AppHeader title="Chat" showTopIcons={false} />
      <View style={styles.container}>
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={item => String(item.threadId || item.id)}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
