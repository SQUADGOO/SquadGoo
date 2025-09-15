import React from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'

const menuItems = [
  {
    id: 1,
    title: 'My Profile',
    icon: 'person-outline',
    lib: iconLibName.Ionicons,
  },
  {
    id: 2,
    title: 'Documents',
    icon: 'document-text-outline',
    lib: iconLibName.Ionicons,
  },
  {
    id: 3,
    title: 'Reviews',
    icon: 'star-outline',
    lib: iconLibName.Ionicons,
  },
  {
    id: 4,
    title: 'My Requests',
    icon: 'help-circle-outline',
    lib: iconLibName.Ionicons,
  },
  {
    id: 5,
    title: 'Support',
    icon: 'call-outline',
    lib: iconLibName.Ionicons,
  },
]

const JobSeekerSettings = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header with Profile */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/300' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editIcon}>
              <VectorIcons
                name={iconLibName.MaterialIcons}
                iconName="edit"
                size={16}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.userInfo}>
            <AppText variant={Variant.title} style={styles.userName}>
              Alex Linderson
            </AppText>
            <AppText variant={Variant.body} style={styles.userRole}>
              Job Seeker
            </AppText>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() => console.log(item.title)}
          >
            <View style={styles.iconWrapper}>
              <VectorIcons
                name={item.lib}
                iconName={item.icon}
                size={20}
                color={colors.secondary}
              />
            </View>
            <AppText variant={Variant.bodyMedium} style={styles.menuText}>
              {item.title}
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <AppButton
          text="Logout"
          onPress={() => console.log('Logout')}
          bgColor="#F59E0B"
          textColor="#FFFFFF"
          leftIcon={() => (
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="log-out-outline"
              size={20}
              color="#fff"
            />
          )}
        />
      </View>
    </View>
  )
}

export default JobSeekerSettings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: '#C13584', // gradient substitute
    paddingVertical: hp(4),
    paddingHorizontal: wp(5),
    borderBottomRightRadius: wp(10),
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.secondary,
    borderRadius: wp(4),
    padding: wp(1),
  },
  userInfo: {
    marginLeft: wp(4),
  },
  userName: {
    color: colors.white,
    fontSize: getFontSize(16),
    fontWeight: '600',
  },
  userRole: {
    color: colors.white,
    fontSize: getFontSize(13),
  },
  menuContainer: {
    flex: 1,
    marginTop: hp(2),
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
  },
  iconWrapper: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: colors.grayE8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4),
  },
  menuText: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '500',
  },
  logoutContainer: {
    padding: wp(5),
    borderTopWidth: 1,
    borderTopColor: colors.grayE8,
  },
})
