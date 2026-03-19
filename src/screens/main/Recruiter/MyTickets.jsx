import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { screenNames } from '@/navigation/screenNames';
import { defaultTickets } from './supportData';

const getStatusStyle = (status) => {
    switch (status) {
        case 'Open':
            return { bg: '#FEF9C3', text: '#A16207', border: '#FDE047' };
        case 'In Progress':
            return { bg: '#FFF7ED', text: '#EA580C', border: '#FDBA74' };
        case 'Resolved':
            return { bg: '#F0FDF4', text: '#16A34A', border: '#86EFAC' };
        case 'Closed':
            return { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' };
        default:
            return { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' };
    }
};

const getPriorityDot = (priority) => {
    switch (priority) {
        case 'High': return '#DC2626';
        case 'Medium': return '#F59E0B';
        case 'Low': return '#16A34A';
        default: return '#999';
    }
};

const MyTickets = () => {
    const navigation = useNavigation();
    const [tickets] = useState(defaultTickets);

    return (
        <View style={styles.screen}>
            <PoolHeader title="My Tickets" />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {tickets.length === 0 ? (
                    <View style={styles.emptyState}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="ticket-outline" size={50} color="#D1D5DB" />
                        <AppText variant={Variant.bodyMedium} style={styles.emptyTitle}>
                            No tickets yet
                        </AppText>
                        <AppText variant={Variant.caption} style={styles.emptySubtitle}>
                            Create a support ticket to get help from our team.
                        </AppText>
                    </View>
                ) : (
                    tickets.map((ticket) => {
                        const statusStyle = getStatusStyle(ticket.status);
                        const priorityColor = getPriorityDot(ticket.priority);

                        return (
                            <TouchableOpacity
                                key={ticket.id}
                                style={styles.ticketCard}
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate(screenNames.TICKET_DETAILS, { ticket })}
                            >
                                <View style={styles.ticketHeader}>
                                    <AppText variant={Variant.bodyMedium} style={styles.ticketSubject} numberOfLines={2}>
                                        {ticket.subject}
                                    </AppText>
                                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
                                        <AppText variant={Variant.caption} style={[styles.statusText, { color: statusStyle.text }]}>
                                            {ticket.status}
                                        </AppText>
                                    </View>
                                </View>

                                <View style={styles.ticketMeta}>
                                    <AppText variant={Variant.caption} style={styles.ticketId}>
                                        #{ticket.id}
                                    </AppText>
                                    <View style={styles.dot} />
                                    <View style={styles.priorityRow}>
                                        <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
                                        <AppText variant={Variant.caption} style={styles.ticketPriority}>
                                            {ticket.priority}
                                        </AppText>
                                    </View>
                                </View>

                                <View style={styles.ticketFooter}>
                                    <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={13} color="#999" />
                                    <AppText variant={Variant.caption} style={styles.ticketUpdated}>
                                        Last updated {ticket.lastUpdated}
                                    </AppText>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}

                <View style={{ height: hp(4) }} />
            </ScrollView>
        </View>
    );
};

export default MyTickets;

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
    },
    // Empty
    emptyState: {
        alignItems: 'center',
        paddingTop: hp(10),
        gap: hp(1),
    },
    emptyTitle: {
        color: '#555',
        fontWeight: '700',
        fontSize: getFontSize(16),
    },
    emptySubtitle: {
        color: '#999',
        fontSize: getFontSize(13),
        textAlign: 'center',
    },
    // Ticket card
    ticketCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        padding: wp(4),
        marginBottom: hp(1.2),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    ticketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: wp(2),
        marginBottom: hp(0.8),
    },
    ticketSubject: {
        flex: 1,
        color: '#111',
        fontWeight: '700',
        fontSize: getFontSize(14),
        lineHeight: getFontSize(20),
    },
    statusBadge: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: wp(2.5),
        paddingVertical: hp(0.3),
    },
    statusText: {
        fontWeight: '600',
        fontSize: getFontSize(11),
    },
    ticketMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        marginBottom: hp(0.6),
    },
    ticketId: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: getFontSize(11),
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: '#CCC',
    },
    priorityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
    },
    priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    ticketPriority: {
        color: '#666',
        fontSize: getFontSize(11),
    },
    ticketFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1.5),
    },
    ticketUpdated: {
        color: '#999',
        fontSize: getFontSize(11),
    },
});
