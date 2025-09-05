
import MessageItem from '@/components/chat/MessageItem'
import AppHeader from '@/core/AppHeader'
import { screenNames } from '@/navigation/screenNames'
import { colors } from '@/theme'
import { useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

const Chat = ({ navigation }) => {
  // ... your messages data
  const [messages] = useState([
  {
    id: 1,
    name: 'Alex Linderson',
    lastMessage: 'How are you today?',
    timestamp: '2 min ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    unreadCount: 3,
    isGroup: false
  },
  {
    id: 2,
    name: 'Team Align',
    lastMessage: "Don't miss to attend the meeting.",
    timestamp: '2 min ago',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3847ae2c4f71?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    unreadCount: 4,
    isGroup: true,
    groupMembers: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b578?w=50&h=50&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face'
    ]
  },
  {
    id: 3,
    name: 'John Ahraham',
    lastMessage: 'Hey! Can you join the meeting?',
    timestamp: '2 min ago',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    unreadCount: 0,
    isGroup: false
  },
  {
    id: 4,
    name: 'Sabila Sayma',
    lastMessage: 'How are you today?',
    timestamp: '2 min ago',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    unreadCount: 0,
    isGroup: false
  },
  {
    id: 5,
    name: 'John Borino',
    lastMessage: 'Have a good day 🌸',
    timestamp: '2 min ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    unreadCount: 0,
    isGroup: false
  },
  {
    id: 6,
    name: 'Angel Dayna',
    lastMessage: 'How are you today?',
    timestamp: '2 min ago',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b578?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    unreadCount: 0,
    isGroup: false
  },
  {
    id: 7,
    name: 'John Doe',
    lastMessage: 'How are you today?',
    timestamp: '2 min ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    unreadCount: 0,
    isGroup: false
  }
])

  const handleChatPress = (chatItem) => {
    console.log('Open chat with:', chatItem.name)
    navigation.navigate(screenNames.MESSAGES)

    // navigation.navigate('ChatDetail', { chatId: chatItem.id })
  }

  const renderMessageItem = ({ item, index }) => (
    <MessageItem
      item={item}
      onPress={handleChatPress}
      showBorder={index !== messages.length - 1} // No border on last item
    />
  )

  return (

    <>
    <AppHeader
      title="Chat"
      showTopIcons={false}
     
    />
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        />
    </View>
        </>
  )
}

export default Chat

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
})
