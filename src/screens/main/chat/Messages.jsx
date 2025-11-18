import React, {useEffect, useMemo, useState} from 'react'
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native'
import { colors } from '@/theme'
import { 
  TextMessage, 
  VoiceMessage, 
  ImageMessage, 
  DateSeparator, 
  MessageTimestamp 
} from '@/components/chat/TextMessageComp'
import ChatHeader from '@/core/ChatHeader'
import ChatInput from '@/components/chat/ChatInput'

const Messages = ({ navigation, route }) => {
  const { chatData } = route.params || {}

  const buildInitialMessages = useMemo(() => {
    if (chatData?.isSupport) {
      return [
        {
          id: 1,
          type: 'date',
          date: 'Today'
        },
        {
          id: 2,
          type: 'text',
          message: "Hi! You're connected to SquadGoo support. How can we help you today?",
          isOwn: false,
          showAvatar: true,
          timestamp: '09:25 AM'
        },
        {
          id: 3,
          type: 'text',
          message: 'Share a few more details and we will guide you through.',
          isOwn: false,
          showAvatar: false,
          timestamp: '09:26 AM'
        }
      ]
    }

    return [
      {
        id: 1,
        type: 'date',
        date: 'Today'
      },
      {
        id: 2,
        type: 'text',
        message: 'Have a great working week!!',
        isOwn: false,
        showAvatar: true,
        timestamp: '09:25 AM'
      },
      {
        id: 3,
        type: 'text',
        message: 'Hope you like it',
        isOwn: false,
        showAvatar: false,
        timestamp: '09:25 AM'
      },
      {
        id: 4,
        type: 'voice',
        duration: '00:16',
        isOwn: true,
        showAvatar: false,
        timestamp: '09:25 AM'
      },
      {
        id: 5,
        type: 'image',
        message: 'Look at my work man!!',
        images: [
          'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=300&fit=crop',
          'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop'
        ],
        isOwn: false,
        showAvatar: true,
        timestamp: '09:25 AM'
      },
      {
        id: 6,
        type: 'text',
        message: 'Hello! Jhon abraham',
        isOwn: true,
        showAvatar: false,
        timestamp: '09:25 AM'
      }
    ]
  }, [chatData])

  const [messages, setMessages] = useState(buildInitialMessages)

  useEffect(() => {
    setMessages(buildInitialMessages)
  }, [buildInitialMessages])

  const [isRecording, setIsRecording] = useState(false)

  const userInfo = {
    name: chatData?.name || 'Jhon Abraham',
    avatar: chatData?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isOnline: chatData?.isOnline ?? true,
    status: chatData?.status || (chatData?.isOnline ? 'Active now' : 'Offline')
  }

  const handleSendMessage = (messageText) => {
    const newMessage = {
      id: Date.now(),
      type: 'text',
      message: messageText,
      isOwn: true,
      showAvatar: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleBackPress = () => {
    navigation.goBack()
  }

  const handleCallPress = () => {
    console.log('Voice call pressed')
    // Handle voice call
  }

  const handleVideoPress = () => {
    console.log('Video call pressed')
    // Handle video call
  }

  const handleAttachFile = () => {
    console.log('Attach file pressed')
    // Handle file attachment
  }

  const handleOpenCamera = () => {
    console.log('Camera pressed')
    // Handle camera
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    console.log('Start recording')
    // Handle voice recording start
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    console.log('Stop recording')
    // Handle voice recording stop
  }

  const handleVoicePlay = () => {
    console.log('Play voice message')
    // Handle voice message play
  }

  const renderMessage = ({ item, index }) => {
    const showTimestamp = index === messages.length - 1 || 
      messages[index + 1]?.timestamp !== item.timestamp ||
      messages[index + 1]?.isOwn !== item.isOwn

    switch (item.type) {
      case 'date':
        return <DateSeparator date={item.date} />
      
      case 'text':
        return (
          <View>
            <TextMessage
              message={item.message}
              isOwn={item.isOwn}
              showAvatar={item.showAvatar}
              userAvatar={userInfo.avatar}
            />
            {showTimestamp && (
              <MessageTimestamp 
                timestamp={item.timestamp} 
                isOwn={item.isOwn} 
              />
            )}
          </View>
        )
      
      case 'voice':
        return (
          <View>
            <VoiceMessage
              duration={item.duration}
              isOwn={item.isOwn}
              showAvatar={item.showAvatar}
              userAvatar={userInfo.avatar}
              onPlay={handleVoicePlay}
            />
            {showTimestamp && (
              <MessageTimestamp 
                timestamp={item.timestamp} 
                isOwn={item.isOwn} 
              />
            )}
          </View>
        )
      
      case 'image':
        return (
          <View>
            <ImageMessage
              message={item.message}
              images={item.images}
              isOwn={item.isOwn}
              showAvatar={item.showAvatar}
              userAvatar={userInfo.avatar}
            />
            {showTimestamp && (
              <MessageTimestamp 
                timestamp={item.timestamp} 
                isOwn={item.isOwn} 
              />
            )}
          </View>
        )
      
      default:
        return null
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Chat Header */}
      <ChatHeader
        userName={userInfo.name}
        userAvatar={userInfo.avatar}
        isOnline={userInfo.isOnline}
        status={userInfo.status}
        onBackPress={handleBackPress}
        onCallPress={handleCallPress}
        onVideoPress={handleVideoPress}
      />

      {/* Messages List */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        showsVerticalScrollIndicator={false}
        inverted={false}
      />

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onAttachFile={handleAttachFile}
        onOpenCamera={handleOpenCamera}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        isRecording={isRecording}
      />
    </KeyboardAvoidingView>
  )
}

export default Messages

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  messagesList: {
    flex: 1,
    // paddingVertical: 10,
  },
})