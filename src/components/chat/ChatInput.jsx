import React, { useState } from 'react'
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ChatInput = ({
  onSendMessage,
  onAttachFile,
  onOpenCamera,
  onStartRecording,
  onStopRecording,
  isRecording = false,
  placeholder = "Write your message"
}) => {
  const [message, setMessage] = useState('')
  const insets = useSafeAreaInsets()

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage && onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleMicPress = () => {
    if (isRecording) {
      onStopRecording && onStopRecording()
    } else {
      onStartRecording && onStartRecording()
    }
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.inputContainer}>
        {/* Attachment Button */}
        <TouchableOpacity 
          style={styles.attachButton}
          onPress={onAttachFile}
          activeOpacity={0.7}
        >
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="attach"
            size={20}
            color={colors.gray}
          />
        </TouchableOpacity>

        {/* Text Input */}
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor={colors.gray}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
        </View>

        {/* Right Actions */}
        <View style={styles.rightActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onOpenCamera}
            activeOpacity={0.7}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="camera"
              size={20}
              color={colors.gray}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.actionButton,
              isRecording && styles.recordingButton
            ]}
            onPress={message.trim() ? handleSend : handleMicPress}
            activeOpacity={0.7}
          >
            {message.trim() ? (
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="send"
                size={20}
                color="#10B981"
              />
            ) : (
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="mic"
                size={20}
                color={isRecording ? "#FFFFFF" : colors.gray}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ChatInput

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.grayE8 || '#F3F4F6',
    // paddingTop: hp(1.5),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingBottom: hp(1),
  },
  attachButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: colors.grayE8 || '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2),
    // marginBottom: hp(0.5),
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: colors.grayE8 || '#F3F4F6',
    borderRadius: hp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.5),
    maxHeight: hp(12),
    marginRight: wp(2),
  },
  textInput: {
    fontSize: getFontSize(14),
    color: colors.black,
    // minHeight: hp(2.5),
    textAlignVertical: 'top',
  },
  rightActions: {
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
    // marginBottom: hp(0.5),
  },
  recordingButton: {
    backgroundColor: '#EF4444',
  },
})