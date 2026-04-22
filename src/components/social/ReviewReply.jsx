import React, {memo, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AppText, {Variant} from '@/core/AppText';
import VectorIcons, {iconLibName} from '@/theme/vectorIcon';
import {colors, getFontSize, hp, wp} from '@/theme';

const ReviewReply = ({
  reply = null,
  canReply = false,
  onSubmit,
  onReport,
  placeholder = 'Write a reply…',
  emptyText = 'No reply yet.',
  style,
}) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    const value = text.trim();
    if (!value) return;
    onSubmit?.(value);
    setText('');
  };

  if (reply) {
    const initial = (reply.author || 'R').slice(0, 1).toUpperCase();
    return (
      <View style={[styles.container, style]}>
        <View style={styles.replyRow}>
          <View style={styles.avatar}>
            <AppText
              variant={Variant.smallCaptionSemi}
              style={styles.avatarText}>
              {initial}
            </AppText>
          </View>
          <View style={styles.replyBody}>
            <View style={styles.replyHead}>
              <AppText variant={Variant.bodySemiBold} style={styles.author}>
                {reply.author || 'Reviewee'}
              </AppText>
              {reply.date ? (
                <AppText variant={Variant.smallCaption} style={styles.date}>
                  {reply.date}
                </AppText>
              ) : null}
            </View>
            <AppText variant={Variant.caption} style={styles.text}>
              {reply.text}
            </AppText>
            {onReport ? (
              <TouchableOpacity
                onPress={onReport}
                hitSlop={6}
                style={styles.reportBtn}
                activeOpacity={0.7}>
                <VectorIcons
                  name={iconLibName.Feather}
                  iconName="flag"
                  size={12}
                  color={colors.gray}
                />
                <AppText
                  variant={Variant.smallCaption}
                  style={styles.reportText}>
                  Report
                </AppText>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  }

  if (!canReply) {
    return (
      <View style={[styles.container, style]}>
        <AppText variant={Variant.caption} style={styles.empty}>
          {emptyText}
        </AppText>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray}
          style={styles.input}
          multiline
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!text.trim()}
          activeOpacity={0.8}
          style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="send"
            size={16}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(ReviewReply);

const styles = StyleSheet.create({
  container: {
    marginTop: hp(1),
  },
  empty: {
    color: colors.gray,
  },
  replyRow: {
    flexDirection: 'row',
    gap: wp(2),
  },
  avatar: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: colors.lightPurpul,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.secondary,
    fontWeight: '700',
  },
  replyBody: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: hp(1.2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
  },
  replyHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    color: colors.secondary,
    fontSize: getFontSize(13),
  },
  date: {
    color: colors.gray,
  },
  text: {
    color: colors.textPrimary,
    marginTop: hp(0.3),
    lineHeight: hp(2),
  },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    marginTop: hp(0.6),
    alignSelf: 'flex-start',
  },
  reportText: {
    color: colors.gray,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: wp(2),
  },
  input: {
    flex: 1,
    minHeight: hp(4.6),
    maxHeight: hp(14),
    borderWidth: 1,
    borderColor: colors.gray02,
    borderRadius: hp(2.6),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    fontSize: getFontSize(13),
    color: colors.black,
    backgroundColor: colors.white,
  },
  sendBtn: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.gray,
  },
});
