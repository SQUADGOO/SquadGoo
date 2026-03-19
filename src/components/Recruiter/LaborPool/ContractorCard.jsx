import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';

const BADGE_COLORS = {
    Bronze: '#CD7F32',
    Silver: '#A0AEC0',
    Gold: '#F59E0B',
    Platinum: '#8B5CF6',
};

/**
 * ContractorCard — Displays ABN-verified contractor information
 * matching the client's PDF page 46 design.
 *
 * Props:
 * - businessName: Company / trading name
 * - abnNumber: ABN string
 * - name: Person name (Sole Trader)
 * - phone: Contact phone
 * - email: Contact email
 * - badge: Bronze | Silver | Gold | Platinum
 * - skills: string[] — key skills
 * - rate: formatted rate string e.g. "$85/hr"
 * - rating: number (0–5)
 * - reviewCount: number
 * - onHire: callback
 * - onViewProfile: callback
 * - onPressRating: callback (star / reviews link)
 */
const ContractorCard = ({
    businessName,
    abnNumber,
    name,
    phone,
    email,
    badge,
    skills = [],
    rate,
    rating,
    reviewCount = 0,
    onHire,
    onViewProfile,
    onPressRating,
}) => {
    const visibleSkills = useMemo(() => (skills || []).filter(Boolean).slice(0, 4), [skills]);
    const initials = useMemo(() => {
        const parts = (name || '').split(' ');
        return parts.length >= 2
            ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
            : (name || 'C').charAt(0).toUpperCase();
    }, [name]);

    const badgeColor = BADGE_COLORS[badge] || BADGE_COLORS.Bronze;

    return (
        <View style={styles.card}>
            {/* ABN Verified Badge */}
            <View style={styles.verifiedBadgeRow}>
                <View style={styles.verifiedPill}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="shield-checkmark" size={12} color="#16A34A" />
                    <AppText variant={Variant.caption} style={styles.verifiedText}>ABN VERIFIED</AppText>
                </View>
                {badge ? (
                    <View style={[styles.badgePill, { backgroundColor: badgeColor }]}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="ribbon" size={11} color="#FFFFFF" />
                        <AppText variant={Variant.caption} style={styles.badgeText}>{badge}</AppText>
                    </View>
                ) : null}
            </View>

            {/* Business Name + ABN */}
            <AppText variant={Variant.subTitle} style={styles.businessName}>{businessName}</AppText>
            <AppText variant={Variant.caption} style={styles.abnText}>ABN: {abnNumber}</AppText>

            {/* Person row */}
            <View style={styles.personRow}>
                <View style={styles.avatarCircle}>
                    <AppText variant={Variant.caption} style={styles.avatarText}>{initials}</AppText>
                </View>
                <View style={styles.personInfo}>
                    <AppText variant={Variant.bodyMedium} style={styles.personName}>
                        {name} <AppText variant={Variant.caption} style={styles.soleTrader}>(Sole Trader)</AppText>
                    </AppText>
                    <AppText variant={Variant.caption} style={styles.contactText}>
                        📞 {phone} | ✉ {email}
                    </AppText>
                </View>
            </View>

            {/* Key Skills */}
            {visibleSkills.length > 0 && (
                <View style={styles.skillsSection}>
                    <AppText variant={Variant.caption} style={styles.skillsLabel}>Key Skills:</AppText>
                    <View style={styles.skillsRow}>
                        {visibleSkills.map((s) => (
                            <View key={s} style={styles.skillChip}>
                                <AppText variant={Variant.caption} style={styles.skillChipText}>{s}</AppText>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Rate + Rating row */}
            <View style={styles.rateRatingRow}>
                {/* Rate */}
                <View style={styles.rateBadge}>
                    <AppText variant={Variant.caption} style={styles.rateIcon}>💰</AppText>
                    <AppText variant={Variant.bodyMedium} style={styles.rateText}>{rate}</AppText>
                </View>

                {/* Rating + reviews */}
                <View style={styles.ratingGroup}>
                    <TouchableOpacity disabled={!onPressRating} onPress={onPressRating} activeOpacity={0.8} style={styles.ratingPill}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <VectorIcons
                                key={i}
                                name={iconLibName.Ionicons}
                                iconName={i <= Math.round(rating || 0) ? 'star' : 'star-outline'}
                                size={13}
                                color="#F59E0B"
                            />
                        ))}
                        <AppText variant={Variant.caption} style={styles.ratingNum}>({(rating || 0).toFixed(1)})</AppText>
                    </TouchableOpacity>
                    {reviewCount > 0 && (
                        <TouchableOpacity disabled={!onPressRating} onPress={onPressRating} activeOpacity={0.7}>
                            <AppText variant={Variant.caption} style={styles.reviewsLink}>{reviewCount} reviews →</AppText>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Action buttons */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.hireBtn} activeOpacity={0.8} onPress={onHire}>
                    <AppText variant={Variant.bodyMedium} style={styles.hireBtnText}>Hire Contractor</AppText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewBtn} activeOpacity={0.8} onPress={onViewProfile}>
                    <AppText variant={Variant.bodyMedium} style={styles.viewBtnText}>View Profile</AppText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ContractorCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: hp(2.5),
        padding: wp(4.5),
        marginBottom: hp(2),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    verifiedBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(1.2),
    },
    verifiedPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
        backgroundColor: '#DCFCE7',
        paddingHorizontal: wp(2.5),
        paddingVertical: hp(0.4),
        borderRadius: hp(1.5),
    },
    verifiedText: {
        color: '#16A34A',
        fontWeight: '700',
        fontSize: getFontSize(10),
        letterSpacing: 0.3,
    },
    badgePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
        paddingHorizontal: wp(2.5),
        paddingVertical: hp(0.4),
        borderRadius: hp(1.5),
    },
    badgeText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: getFontSize(10),
    },
    businessName: {
        fontSize: getFontSize(18),
        fontWeight: '700',
        color: colors.secondary,
        marginBottom: hp(0.3),
    },
    abnText: {
        color: colors.gray,
        fontSize: getFontSize(12),
        marginBottom: hp(1.5),
    },
    personRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(1.5),
        paddingVertical: hp(1),
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F3F4F6',
    },
    avatarCircle: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: wp(2.5),
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: getFontSize(14),
        fontWeight: '700',
    },
    personInfo: {
        flex: 1,
    },
    personName: {
        color: colors.secondary,
        fontWeight: '600',
        fontSize: getFontSize(14),
        marginBottom: hp(0.2),
    },
    soleTrader: {
        color: colors.gray,
        fontWeight: '400',
        fontSize: getFontSize(12),
    },
    contactText: {
        color: colors.gray,
        fontSize: getFontSize(11),
    },
    skillsSection: {
        marginBottom: hp(1.5),
    },
    skillsLabel: {
        color: colors.secondary,
        fontWeight: '700',
        marginBottom: hp(0.8),
        fontSize: getFontSize(12),
    },
    skillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wp(2),
    },
    skillChip: {
        backgroundColor: '#EEF2FF',
        borderWidth: 1,
        borderColor: '#C7D2FE',
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.5),
        borderRadius: 999,
    },
    skillChipText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: getFontSize(11),
    },
    rateRatingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(1.5),
    },
    rateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
        backgroundColor: '#FFF9E6',
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.6),
        borderRadius: hp(1.5),
    },
    rateIcon: {
        fontSize: getFontSize(12),
    },
    rateText: {
        color: colors.secondary,
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    ratingGroup: {
        alignItems: 'flex-end',
    },
    ratingPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(0.3),
    },
    ratingNum: {
        color: '#F59E0B',
        fontWeight: '600',
        fontSize: getFontSize(11),
        marginLeft: wp(1),
    },
    reviewsLink: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: getFontSize(11),
        marginTop: hp(0.3),
    },
    actions: {
        flexDirection: 'column',
        gap: hp(1),
    },
    hireBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(1.5),
        borderRadius: hp(2),
        backgroundColor: colors.primary,
    },
    hireBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    viewBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(1.5),
        borderRadius: hp(2),
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: colors.primary,
    },
    viewBtnText: {
        color: colors.primary,
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
});
