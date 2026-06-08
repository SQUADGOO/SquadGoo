import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '../../../../core/PoolHeader';

const PRIVACY_POLICY_URL = 'https://squadgoo.com.au/privacy-policy';
const TERMS_URL = 'https://squadgoo.com.au/terms-of-service';
const LICENSES_URL = 'https://squadgoo.com.au/open-source-licenses';
const DPA_URL = 'https://squadgoo.com.au/data-processing-agreement';

const LegalCompliance = ({ navigation }) => {

    const openLink = (url, title) => {
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert(title, `${title} will be available at:\n${url}`);
                }
            })
            .catch(() => {
                Alert.alert(title, `${title} will be available at:\n${url}`);
            });
    };

    const sections = [
        {
            icon: 'shield-checkmark-outline',
            iconBg: '#E8F5E9',
            iconColor: '#2E7D32',
            title: 'Privacy Policy',
            description: 'How we collect, use, and protect your personal data',
            lastUpdated: 'Last updated: January 15, 2024',
            url: PRIVACY_POLICY_URL,
        },
        {
            icon: 'document-text-outline',
            iconBg: '#E3F2FD',
            iconColor: '#1565C0',
            title: 'Terms of Service',
            description: 'Rules and guidelines for using SquadGoo',
            lastUpdated: 'Last updated: January 10, 2024',
            url: TERMS_URL,
        },
        {
            icon: 'code-slash-outline',
            iconBg: '#F3E5F5',
            iconColor: '#7B1FA2',
            title: 'Open Source Licenses',
            description: 'Third-party libraries and their licenses',
            lastUpdated: '',
            url: LICENSES_URL,
        },
        {
            icon: 'server-outline',
            iconBg: '#FFF3E0',
            iconColor: '#E65100',
            title: 'Data Processing Agreement',
            description: 'How we handle data processing on your behalf',
            lastUpdated: 'Last updated: December 1, 2023',
            url: DPA_URL,
        },
    ];

    return (
        <View style={styles.container}>
            <PoolHeader title="Legal & Compliance" />

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Header info */}
                <View style={styles.headerCard}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="information-circle" size={20} color={colors.primary} />
                    <View style={{ flex: 1 }}>
                        <AppText variant={Variant.bodyMedium} style={styles.headerTitle}>
                            Your Rights & Our Policies
                        </AppText>
                        <AppText variant={Variant.caption} style={styles.headerDesc}>
                            Review our legal documents to understand how SquadGoo protects your data and your rights as a user.
                        </AppText>
                    </View>
                </View>

                {/* Legal sections */}
                {sections.map((section, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => openLink(section.url, section.title)}
                    >
                        <View style={styles.cardRow}>
                            <View style={[styles.iconCircle, { backgroundColor: section.iconBg }]}>
                                <VectorIcons
                                    name={iconLibName.Ionicons}
                                    iconName={section.icon}
                                    size={22}
                                    color={section.iconColor}
                                />
                            </View>
                            <View style={styles.cardContent}>
                                <AppText variant={Variant.bodyMedium} style={styles.cardTitle}>{section.title}</AppText>
                                <AppText variant={Variant.caption} style={styles.cardDesc}>{section.description}</AppText>
                                {section.lastUpdated ? (
                                    <AppText variant={Variant.caption} style={styles.cardDate}>{section.lastUpdated}</AppText>
                                ) : null}
                            </View>
                            <VectorIcons name={iconLibName.Ionicons} iconName="open-outline" size={18} color={colors.gray} />
                        </View>
                    </TouchableOpacity>
                ))}

                {/* GDPR / Compliance note */}
                <View style={styles.complianceCard}>
                    <View style={styles.complianceHeader}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-done-circle" size={20} color="#166534" />
                        <AppText variant={Variant.bodyMedium} style={styles.complianceTitle}>
                            Compliance Standards
                        </AppText>
                    </View>
                    <View style={styles.complianceBadgeRow}>
                        {['GDPR', 'CCPA', 'Australian Privacy Act'].map((badge) => (
                            <View key={badge} style={styles.complianceBadge}>
                                <AppText variant={Variant.caption} style={styles.complianceBadgeText}>{badge}</AppText>
                            </View>
                        ))}
                    </View>
                    <AppText variant={Variant.caption} style={styles.complianceDesc}>
                        SquadGoo adheres to international data protection regulations to safeguard your information.
                    </AppText>
                </View>

                {/* Contact */}
                <View style={styles.contactCard}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="mail-outline" size={16} color={colors.primary} />
                    <AppText variant={Variant.caption} style={styles.contactText}>
                        Questions? Contact our legal team at{' '}
                        <AppText variant={Variant.caption} style={styles.contactEmail}>legal@squadgoo.com.au</AppText>
                    </AppText>
                </View>
            </ScrollView>
        </View>
    );
};

export default LegalCompliance;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray || '#F6F7FB',
    },
    scroll: {
        padding: wp(4),
        paddingBottom: hp(10),
    },
    headerCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(2.5),
        backgroundColor: '#EEF4FF',
        borderRadius: 14,
        padding: wp(4),
        marginBottom: hp(2),
    },
    headerTitle: {
        color: colors.primary,
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    headerDesc: {
        color: colors.primary,
        fontSize: getFontSize(12),
        marginTop: hp(0.3),
        lineHeight: getFontSize(17),
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        padding: wp(4),
        marginBottom: hp(1.5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        color: colors.black || '#111',
        fontWeight: '700',
        fontSize: getFontSize(15),
    },
    cardDesc: {
        color: colors.gray,
        fontSize: getFontSize(12),
        marginTop: hp(0.2),
    },
    cardDate: {
        color: colors.primary,
        fontSize: getFontSize(10),
        fontWeight: '500',
        marginTop: hp(0.4),
    },
    complianceCard: {
        backgroundColor: '#F0FDF4',
        borderWidth: 1,
        borderColor: '#BBF7D0',
        borderRadius: 14,
        padding: wp(4),
        marginTop: hp(1),
        marginBottom: hp(1.5),
    },
    complianceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        marginBottom: hp(1),
    },
    complianceTitle: {
        color: '#166534',
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    complianceBadgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wp(2),
        marginBottom: hp(1),
    },
    complianceBadge: {
        backgroundColor: '#DCFCE7',
        borderRadius: 8,
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.4),
    },
    complianceBadgeText: {
        color: '#166534',
        fontWeight: '600',
        fontSize: getFontSize(11),
    },
    complianceDesc: {
        color: '#15803D',
        fontSize: getFontSize(12),
        lineHeight: getFontSize(17),
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        paddingHorizontal: wp(1),
    },
    contactText: {
        color: colors.gray,
        fontSize: getFontSize(12),
        flex: 1,
    },
    contactEmail: {
        color: colors.primary,
        fontWeight: '600',
    },
});
