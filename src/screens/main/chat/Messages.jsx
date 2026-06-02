import React, {useEffect, useMemo, useState} from 'react'
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import { 
  TextMessage, 
  VoiceMessage, 
  ImageMessage, 
  DateSeparator, 
  MessageTimestamp 
} from '@/components/chat/TextMessageComp'
import ChatHeader from '@/core/ChatHeader'
import ChatInput from '@/components/chat/ChatInput'
import { selectContactRevealByJobId } from '@/store/contactRevealSlice'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import {
  fetchJobChatThread,
  sendJobChatMessage,
  upsertJobChatOnAccept,
} from '@/api/jobChatsApi'

function formatMsgTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function mapApiMessages(apiMessages = []) {
  const rows = [{ id: 'date-today', type: 'date', date: 'Today' }]
  apiMessages.forEach((m, idx) => {
    rows.push({
      id: m.id || `msg-${idx}`,
      type: 'text',
      message: m.text || '',
      isOwn: Boolean(m.isOwn),
      showAvatar: !m.isOwn && idx === 0,
      timestamp: formatMsgTime(m.createdAt),
    })
  })
  return rows
}

const emptyJobChat = () => [{ id: 'date-today', type: 'date', date: 'Today' }]

const JOBSEEKER_QUICK_REPLIES = [
  "Thank you for the offer details.",
  "What is the exact location for the job?",
  "What should I bring on my first day?",
  "Can you confirm the start time?",
  "Is there parking available at the site?",
  "Who should I contact when I arrive?",
  "Can you share more about the job duties?",
  "Do I need to wear specific clothing or uniform?",
  "Is there anything else I should prepare?",
  "Thank you, I'll update you if I have any issues.",
]

const RECRUITER_QUICK_REPLIES = [
  "Welcome to the team!",
  "Please confirm your start time.",
  "Let me know if you have any questions.",
  "Can you send your updated address/contact?",
  "Please remember to bring your ID.",
  "Do you have any allergies or restrictions we should know?",
  "Who should I contact in case of emergency?",
  "Please arrive 10 minutes early.",
  "Let me know when you arrive at the site.",
  "Looking forward to working with you!",
]

const Messages = ({ navigation, route }) => {
  const { chatData } = route.params || {}
  const authUserInfo = useSelector(state => state?.auth?.userInfo || {})
  const role = useSelector(state => state?.auth?.role)
  const isJobseeker = role?.toLowerCase() === 'jobseeker'
  const quickReplies = isJobseeker ? JOBSEEKER_QUICK_REPLIES : RECRUITER_QUICK_REPLIES
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const currentUserId = authUserInfo?._id || authUserInfo?.id || 'js-001'
  
  // Get job details if jobId is present
  const jobId = chatData?.jobId
  const job = jobId ? useSelector(state => {
    // Try to find job in different slices
    const manualJob = state?.manualOffers?.jobs?.find(j => j.id === jobId)
    const quickJob = state?.quickSearch?.quickJobs?.find(j => j.id === jobId)
    const activeJob = state?.jobs?.activeJobs?.find(j => j.id === jobId)
    return manualJob || quickJob || activeJob
  }) : null
  
  // Check if contact reveal is active
  const contactReveal = jobId ? useSelector(state => 
    selectContactRevealByJobId(state, jobId, currentUserId)
  ) : null
  const canSeeContacts = !!contactReveal

  const isJobOfferChat = !chatData?.isSupport
  const [activeThreadId, setActiveThreadId] = useState(
    () => (chatData?.threadId && String(chatData.threadId).startsWith('JCHAT') ? chatData.threadId : null)
  )

  const supportSeed = useMemo(
    () => [
      { id: 1, type: 'date', date: 'Today' },
      {
        id: 2,
        type: 'text',
        message: "Hi! You're connected to SquadGoo support. How can we help you today?",
        isOwn: false,
        showAvatar: true,
        timestamp: '09:25 AM',
      },
      {
        id: 3,
        type: 'text',
        message: 'Share a few more details and we will guide you through.',
        isOwn: false,
        showAvatar: false,
        timestamp: '09:26 AM',
      },
    ],
    []
  )

  const [messages, setMessages] = useState(() => (chatData?.isSupport ? supportSeed : emptyJobChat()))

  useEffect(() => {
    if (chatData?.isSupport) {
      setMessages(supportSeed)
      return
    }

    let cancelled = false

    async function loadJobChat() {
      let threadId = activeThreadId

      if (!threadId && chatData?.jobId && chatData?.otherUserId) {
        const upserted = await upsertJobChatOnAccept({
          jobId: chatData.jobId,
          otherUserId: chatData.otherUserId,
          jobTitle: chatData.jobTitle,
          searchType: chatData.searchType,
        })
        threadId = upserted?.threadId || null
        if (threadId && !cancelled) setActiveThreadId(threadId)
      }

      if (!threadId) {
        if (!cancelled) setMessages(emptyJobChat())
        return
      }

      try {
        const payload = await fetchJobChatThread(threadId)
        if (cancelled) return
        setMessages(mapApiMessages(payload?.messages || []))
      } catch (err) {
        if (__DEV__) console.warn('[Messages] load failed', err?.message)
        if (!cancelled) setMessages(emptyJobChat())
      }
    }

    loadJobChat()
    return () => {
      cancelled = true
    }
  }, [
    chatData?.isSupport,
    chatData?.jobId,
    chatData?.otherUserId,
    chatData?.jobTitle,
    chatData?.searchType,
    activeThreadId,
    supportSeed,
  ])

  const [isRecording, setIsRecording] = useState(false)

  const userInfo = {
    name: chatData?.name || 'Jhon Abraham',
    avatar: chatData?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isOnline: chatData?.isOnline ?? true,
    status: chatData?.status || (chatData?.isOnline ? 'Active now' : 'Offline')
  }

  const handleSendMessage = async (messageText) => {
    const text = String(messageText || '').trim()
    if (!text) return

    const optimistic = {
      id: Date.now(),
      type: 'text',
      message: text,
      isOwn: true,
      showAvatar: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, optimistic])

    if (!isJobOfferChat || !activeThreadId) return

    try {
      await sendJobChatMessage(activeThreadId, { text })
    } catch (err) {
      if (__DEV__) console.warn('[Messages] send failed', err?.message)
    }
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

      {/* Quick Reply Suggestions */}
      {showQuickReplies ? (
        <View style={styles.quickRepliesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRepliesScroll}>
            {quickReplies.map((reply, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.quickReplyChip}
                onPress={() => {
                  handleSendMessage(reply)
                  setShowQuickReplies(false)
                }}
                activeOpacity={0.7}
              >
                <AppText variant={Variant.caption} style={styles.quickReplyText}>{reply}</AppText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : null}

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
  jobBanner: {
    backgroundColor: colors.grayE8 || '#F3F4F6',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#E5E7EB',
  },
  jobBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  jobBannerText: {
    marginLeft: wp(3),
    flex: 1,
  },
  jobBannerTitle: {
    fontWeight: '600',
    color: colors.black || '#111827',
    fontSize: getFontSize(14),
  },
  jobBannerSubtitle: {
    color: colors.gray || '#6B7280',
    fontSize: getFontSize(12),
    marginTop: hp(0.2),
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messagesList: {
    flex: 1,
  },
  quickRepliesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FAFBFC',
    paddingVertical: hp(1),
  },
  quickRepliesScroll: {
    paddingHorizontal: wp(3),
    gap: wp(2),
  },
  quickReplyChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.primary || '#FF6B35',
    borderRadius: hp(2.5),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.8),
  },
  quickReplyText: {
    color: colors.primary || '#FF6B35',
    fontWeight: '600',
    fontSize: getFontSize(12),
  },
})