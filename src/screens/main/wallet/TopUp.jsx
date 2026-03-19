import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '@/core/PoolHeader';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { screenNames } from '@/navigation/screenNames';

const TopUp = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.screen}>
            <PoolHeader title="Top Up Your Wallet" />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Option 1: Top Up by Card */}
                <TouchableOpacity
                    style={styles.optionCard}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate(screenNames.PURCHASE_COINS)}
                >
                    <LinearGradient
                        colors={['#F97316', '#FB923C']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.optionIconCircle}
                    >
                        <VectorIcons name={iconLibName.Ionicons} iconName="card-outline" size={28} color={colors.white} />
                    </LinearGradient>
                    <View style={styles.optionContent}>
                        <AppText variant={Variant.bodyMedium} style={styles.optionTitle}>
                            Top Up by Card
                        </AppText>
                        <AppText variant={Variant.caption} style={styles.optionSubtitle}>
                            Instant top-up with debit/credit card
                        </AppText>
                    </View>
                    <VectorIcons name={iconLibName.Ionicons} iconName="chevron-forward" size={18} color="#C4C4C4" />
                </TouchableOpacity>

                {/* Option 2: Deposit Using PayID */}
                <TouchableOpacity
                    style={styles.optionCard}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate(screenNames.PAYID_DEPOSIT)}
                >
                    <LinearGradient
                        colors={['#7C3AED', '#A78BFA']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.optionIconCircle}
                    >
                        <VectorIcons name={iconLibName.Ionicons} iconName="business-outline" size={28} color={colors.white} />
                    </LinearGradient>
                    <View style={styles.optionContent}>
                        <AppText variant={Variant.bodyMedium} style={styles.optionTitle}>
                            Deposit Using PayID
                        </AppText>
                        <AppText variant={Variant.caption} style={styles.optionSubtitle}>
                            Deposit via your bank using PayID
                        </AppText>
                    </View>
                    <VectorIcons name={iconLibName.Ionicons} iconName="chevron-forward" size={18} color="#C4C4C4" />
                </TouchableOpacity>

                {/* Info note */}
                <View style={styles.infoCard}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="information-circle-outline" size={18} color={colors.primary} />
                    <AppText variant={Variant.caption} style={styles.infoText}>
                        1 SG Coin = 1 AUD. Minimum top-up: $15. No purchase fee. $1 withdrawal fee.
                    </AppText>
                </View>
            </ScrollView>
        </View>
    );
};

export default TopUp;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F4F2F9',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: wp(5),
        gap: hp(1.5),
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 16,
        paddingVertical: hp(2.5),
        paddingHorizontal: wp(4),
        gap: wp(3.5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    optionIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        color: '#111',
        fontWeight: '700',
        fontSize: getFontSize(15),
    },
    optionSubtitle: {
        color: '#888',
        fontSize: getFontSize(12),
        marginTop: hp(0.3),
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(2),
        backgroundColor: '#F5F3FF',
        borderRadius: 12,
        padding: wp(3.5),
        marginTop: hp(1),
        borderWidth: 1,
        borderColor: '#E8E5F0',
    },
    infoText: {
        flex: 1,
        color: '#555',
        fontSize: getFontSize(12),
        lineHeight: getFontSize(18),
    },
});
