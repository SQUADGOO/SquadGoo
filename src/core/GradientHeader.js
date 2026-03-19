import React from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

/**
 * GradientHeader – Reusable purple gradient header with optional back button,
 * title, subtitle/label, right actions, and children (e.g. search bar).
 *
 * Props:
 *  - title          (string)   Main title text
 *  - label          (string)   Small text above the title (e.g. "SQUADGOO")
 *  - showBackButton (bool)     Show back arrow, default true
 *  - onBackPress    (func)     Custom back handler
 *  - rightComponent (node)     Custom right-side content
 *  - gradientColors (array)    Override gradient, default purple
 *  - roundedBottom  (bool)     Round bottom corners, default true
 *  - centerTitle    (bool)     Center-align title, default false
 *  - children       (node)     Extra content below title (search bar, etc.)
 */
const GradientHeader = ({
    title = '',
    label = '',
    showBackButton = true,
    showMenuButton = false,
    onBackPress,
    rightComponent = null,
    gradientColors,
    roundedBottom = true,
    centerTitle = false,
    children,
}) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const defaultColors = [colors.primary || '#6C3CE1', '#8B5CF6', '#A78BFA'];

    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigation.goBack();
        }
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <LinearGradient
                colors={gradientColors || defaultColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.container,
                    roundedBottom && styles.rounded,
                ]}
            >
                {/* ─── Top row: back + title + right ─── */}
                <View style={[styles.topRow, { paddingTop: insets.top + hp(1) }]}>
                    {showBackButton ? (
                        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
                            <VectorIcons
                                name={iconLibName.Ionicons}
                                iconName="arrow-back"
                                size={22}
                                color={colors.white}
                            />
                        </TouchableOpacity>
                    ) : showMenuButton ? (
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.openDrawer()} activeOpacity={0.7}>
                            <VectorIcons
                                name={iconLibName.Ionicons}
                                iconName="menu"
                                size={22}
                                color={colors.white}
                            />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.placeholder} />
                    )}

                    {centerTitle && (
                        <AppText variant={Variant.h6} style={styles.centerTitleText}>
                            {title}
                        </AppText>
                    )}

                    {rightComponent ? (
                        <View style={styles.rightWrap}>{rightComponent}</View>
                    ) : (
                        <View style={styles.placeholder} />
                    )}
                </View>

                {/* ─── Label + Title (non-centered) ─── */}
                {!centerTitle && (
                    <View style={styles.titleSection}>
                        {!!label && (
                            <AppText variant={Variant.caption} style={styles.label}>
                                {label}
                            </AppText>
                        )}
                        {!!title && (
                            <AppText variant={Variant.h6} style={styles.title}>
                                {title}
                            </AppText>
                        )}
                    </View>
                )}

                {/* ─── Children (search bar, etc.) ─── */}
                {children && <View style={styles.childrenWrap}>{children}</View>}
            </LinearGradient>
        </>
    );
};

export default GradientHeader;

const styles = StyleSheet.create({
    container: {
        paddingBottom: hp(2),
    },
    rounded: {
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    // Top row
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(0.5),
        paddingHorizontal: wp(4),
        paddingTop: hp(0.5),
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholder: {
        width: 36,
    },
    rightWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    // Center title
    centerTitleText: {
        color: colors.white,
        fontWeight: '800',
        fontSize: getFontSize(18),
        textAlign: 'center',
    },
    // Label + Title
    titleSection: {
        alignItems: 'center',
        marginBottom: hp(0.5),
        paddingHorizontal: wp(4),
    },
    label: {
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '700',
        fontSize: getFontSize(10),
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: hp(0.2),
    },
    title: {
        color: colors.white,
        fontWeight: '800',
        fontSize: getFontSize(24),
        textAlign: 'center',
        paddingBottom: hp(3),
    },
    // Children
    childrenWrap: {
        marginTop: hp(1),
        paddingHorizontal: wp(4),
    },
});
