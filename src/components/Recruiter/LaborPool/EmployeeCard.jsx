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
 * EmployeeCard — Displays TFN-verified employee information
 * matching the client's PDF page 47 design.
 */
const EmployeeCard = ({
    name,
    employeeId,
    tfnMasked,
    phone,
    email,
    badge,
    employmentType,
    skills = [],
    rating,
    experienceYears,
    reviewCount = 0,
    onViewProfile,
    onHire,
    onPressRating,
}) => {
    const visibleSkills = useMemo(() => (skills || []).filter(Boolean).slice(0, 4), [skills]);
    const initials = useMemo(() => {
        const parts = (name || '').split(' ');
        return parts.length >= 2
            ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
            : (name || 'E').charAt(0).toUpperCase();
    }, [name]);

    const badgeColor = BADGE_COLORS[badge] || BADGE_COLORS.Bronze;

    const empTypeColor = (employmentType || '').toLowerCase() === 'full-time'
        ? { bg: '#DBEAFE', text: '#1D4ED8' }
        : { bg: '#FEF3C7', text: '#92400E' };

    return (
        <View style={styles.card}>
            {/* Top row: Verified badge + Employment type */}
            <View style={styles.topRow}>
                <View style={styles.verifiedPill}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="shield-checkmark" size={12} color="#0D9488" />
                    <AppText variant={Variant.caption} style={styles.verifiedText}>TFN VERIFIED</AppText>
                </View>
                <View style={styles.topRowRight}>
                    {badge ? (
                        <View style={[styles.badgePill, { backgroundColor: badgeColor }]}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="ribbon" size={11} color="#FFFFFF" />
                            <AppText variant={Variant.caption} style={styles.badgeText}>{badge}</AppText>
                        </View>
                    ) : null}
                    {employmentType ? (
                        <View style={[styles.empTypePill, { backgroundColor: empTypeColor.bg }]}>
                            <AppText variant={Variant.caption} style={[styles.empTypeText, { color: empTypeColor.text }]}>{employmentType}</AppText>
                        </View>
                    ) : null}
                </View>
            </View>

            {/* Person row */}
            <View style={styles.personRow}>
                <View style={styles.avatarCircle}>
                    <AppText variant={Variant.caption} style={styles.avatarText}>{initials}</AppText>
                </View>
                <View style={styles.personInfo}>
                    <AppText variant={Variant.subTitle} style={styles.personName}>{name}</AppText>
                    <AppText variant={Variant.caption} style={styles.idText}>
                        ID: {employeeId} | TFN: {tfnMasked}
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

            {/* Rating + Experience row */}
            <View style={styles.rateRatingRow}>
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

                <View style={styles.experienceBadge}>
                    <AppText variant={Variant.caption} style={styles.experienceText}>
                        {experienceYears || 0} years exp
                    </AppText>
                </View>
            </View>

            {/* Reviews link */}
            {reviewCount > 0 && (
                <TouchableOpacity disabled={!onPressRating} onPress={onPressRating} activeOpacity={0.7} style={styles.reviewsRow}>
                    <AppText variant={Variant.caption} style={styles.reviewsLink}>{reviewCount} reviews →</AppText>
                </TouchableOpacity>
            )}

            {/* Action buttons */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.viewBtn} activeOpacity={0.8} onPress={onViewProfile}>
                    <AppText variant={Variant.bodyMedium} style={styles.viewBtnText}>View Profile</AppText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.hireBtn} activeOpacity={0.8} onPress={onHire}>
                    <AppText variant={Variant.bodyMedium} style={styles.hireBtnText}>Hire Employee</AppText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default EmployeeCard;

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
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(1.2),
    },
    verifiedPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
        backgroundColor: '#CCFBF1',
        paddingHorizontal: wp(2.5),
        paddingVertical: hp(0.4),
        borderRadius: hp(1.5),
    },
    verifiedText: {
        color: '#0D9488',
        fontWeight: '700',
        fontSize: getFontSize(10),
        letterSpacing: 0.3,
    },
    topRowRight: {
        flexDirection: 'row',
        gap: wp(2),
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
    empTypePill: {
        paddingHorizontal: wp(2.5),
        paddingVertical: hp(0.4),
        borderRadius: hp(1.5),
    },
    empTypeText: {
        fontWeight: '700',
        fontSize: getFontSize(10),
    },
    personRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(1.5),
        paddingBottom: hp(1.5),
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    avatarCircle: {
        width: wp(12),
        height: wp(12),
        borderRadius: wp(6),
        backgroundColor: '#0D9488',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: wp(3),
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: getFontSize(16),
        fontWeight: '700',
    },
    personInfo: {
        flex: 1,
    },
    personName: {
        color: colors.secondary,
        fontWeight: '700',
        fontSize: getFontSize(17),
        marginBottom: hp(0.3),
    },
    idText: {
        color: colors.gray,
        fontSize: getFontSize(11),
        marginBottom: hp(0.2),
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
        backgroundColor: '#F0FDFA',
        borderWidth: 1,
        borderColor: '#99F6E4',
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.5),
        borderRadius: 999,
    },
    skillChipText: {
        color: '#0D9488',
        fontWeight: '600',
        fontSize: getFontSize(11),
    },
    rateRatingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(0.5),
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
    experienceBadge: {
        backgroundColor: '#F5F3FF',
        paddingHorizontal: wp(2.5),
        paddingVertical: hp(0.4),
        borderRadius: hp(1.5),
    },
    experienceText: {
        color: '#7C3AED',
        fontWeight: '600',
        fontSize: getFontSize(11),
    },
    reviewsRow: {
        marginBottom: hp(1.5),
    },
    reviewsLink: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: getFontSize(11),
    },
    actions: {
        flexDirection: 'column',
        gap: hp(1),
        marginTop: hp(0.5),
    },
    viewBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(1.5),
        borderRadius: hp(2),
        backgroundColor: '#0D9488',
    },
    viewBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    hireBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(1.5),
        borderRadius: hp(2),
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#0D9488',
    },
    hireBtnText: {
        color: '#0D9488',
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
});
