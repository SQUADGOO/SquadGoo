import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { colors, hp, wp, getFontSize, borders } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'

// Text Message Component
const TextMessage = ({ message, timestamp, isOwn = false, showAvatar = true, userAvatar }) => (
  <View style={[styles.messageContainer, isOwn && styles.ownMessageContainer]}>
    {showAvatar && !isOwn && (
      <Image source={{ uri: userAvatar }} style={styles.messageAvatar} />
    )}
    
    <View style={[styles.messageBubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
      <AppText variant={Variant.body} style={[styles.messageText, isOwn && styles.ownMessageText]}>
        {message}
      </AppText>
    </View>
    
    {isOwn && <View style={styles.avatarSpacer} />}
  </View>
)

// Voice Message Component
const VoiceMessage = ({ duration = '00:16', isOwn = false, onPlay, showAvatar = true, userAvatar }) => {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
    onPlay && onPlay()
  }

  return (
    <View style={[styles.messageContainer, isOwn && styles.ownMessageContainer]}>
      {showAvatar && !isOwn && (
        <Image source={{ uri: userAvatar }} style={styles.messageAvatar} />
      )}
      
      <View style={[styles.voiceBubble, isOwn ? styles.ownVoiceBubble : styles.otherVoiceBubble]}>
        <TouchableOpacity style={styles.playButton} onPress={handlePlay} activeOpacity={0.7}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName={isPlaying ? "pause" : "play"}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        
        <View style={styles.waveform}>
          {Array.from({ length: 20 }).map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.waveBar,
                { height: Math.random() * 20 + 8 }
              ]} 
            />
          ))}
        </View>
        
        <AppText variant={Variant.caption} style={styles.durationText}>
          {duration}
        </AppText>
      </View>
      
      {isOwn && <View style={styles.avatarSpacer} />}
    </View>
  )
}

// Image Message Component
const ImageMessage = ({ images, message, isOwn = false, showAvatar = true, userAvatar }) => (
  <View style={[styles.messageContainer, isOwn && styles.ownMessageContainer]}>
    {showAvatar && !isOwn && (
      <Image source={{ uri: userAvatar }} style={styles.messageAvatar} />
    )}
    
    <View style={styles.imageMessageContainer}>
      {message && (
        <View style={[styles.messageBubble, isOwn ? styles.ownBubble : styles.otherBubble, styles.imageMessageText]}>
          <AppText variant={Variant.body} style={[styles.messageText, isOwn && styles.ownMessageText]}>
            {message}
          </AppText>
        </View>
      )}
      
      <View style={styles.imagesContainer}>
        {images.map((imageUri, index) => (
          <TouchableOpacity key={index} style={styles.imageWrapper} activeOpacity={0.8}>
            <Image source={{ uri: imageUri }} style={styles.messageImage} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
    
    {isOwn && <View style={styles.avatarSpacer} />}
  </View>
)

// Date Separator Component
const DateSeparator = ({ date }) => (
  <View style={styles.dateSeparatorContainer}>
    <View style={styles.dateSeparator}>
      <AppText variant={Variant.caption} style={styles.dateText}>
        {date}
      </AppText>
    </View>
  </View>
)

// Message Timestamp Component
const MessageTimestamp = ({ timestamp, isOwn = false }) => (
  <View style={[styles.timestampContainer, isOwn && styles.ownTimestampContainer]}>
    <AppText variant={Variant.caption} style={styles.timestampText}>
      {timestamp}
    </AppText>
  </View>
)

export { TextMessage, VoiceMessage, ImageMessage, DateSeparator, MessageTimestamp }

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: hp(0.5),
    paddingHorizontal: wp(4),
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    marginRight: wp(2),
    marginBottom: hp(0.5),
  },
  avatarSpacer: {
    width: wp(10),
  },
  messageBubble: {
    maxWidth: wp(70),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderRadius: hp(2.5),
  },
  otherBubble: {
    backgroundColor: '#F2F7FB',
    borderBottomLeftRadius: hp(0.5),
  },
  ownBubble: {
    backgroundColor: '#20A090',
    borderBottomRightRadius: hp(0.5),
  },
  messageText: {
    color: colors.textPrimary,
    fontSize: getFontSize(14),
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  
  // Voice Message Styles
  voiceBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    borderRadius: hp(2.5),
    minWidth: wp(50),
  },
  otherVoiceBubble: {
    backgroundColor: '#20A090',
    borderBottomLeftRadius: hp(0.5),
  },
  ownVoiceBubble: {
    backgroundColor: '#20A090',
    borderBottomRightRadius: hp(0.5),
  },
  playButton: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2),
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: wp(2),
  },
  waveBar: {
    width: wp(0.8),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(0.4),
    opacity: 0.8,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: getFontSize(12),
    marginLeft: wp(2),
  },
  
  // Image Message Styles
  imageMessageContainer: {
    maxWidth: wp(70),
  },
  imageMessageText: {
    marginBottom: hp(1),
  },
  imagesContainer: {
    flexDirection: 'row',
    gap: wp(2),
  },
  imageWrapper: {
    flex: 1,
  },
  messageImage: {
    width: wp(32),
    height: wp(32),
    borderRadius: hp(2),
    backgroundColor: colors.grayE8,
  },
  
  // Date Separator Styles
  dateSeparatorContainer: {
    alignItems: 'center',
    marginVertical: hp(2),
  },
  dateSeparator: {
    backgroundColor: colors.grayE8 || '#F3F4F6',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: borders.borderMainradius,
  },
  dateText: {
    color: '#797C7B',
    fontSize: getFontSize(12),
  },
  
  // Timestamp Styles
  timestampContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.5),
    alignItems: 'flex-start',
  },
  ownTimestampContainer: {
    alignItems: 'flex-end',
  },
  timestampText: {
    color: '#797C7B',
    fontSize: getFontSize(11),
  },
})