import React from 'react';
import {StyleSheet, View} from 'react-native';
import AppHeader from '@/core/AppHeader';
import Scrollable from '@/core/Scrollable';
import AppText, {Variant} from '@/core/AppText';
import {colors, hp, wp} from '@/theme';
import {defaultTickets} from './supportData';

const SupportTickets = ({route}) => {
  const tickets =
    route?.params?.tickets?.length > 0 ? route.params.tickets : defaultTickets;

  return (
    <>
      <AppHeader title="Support Tickets" showTopIcons={false} />
      <Scrollable>
        <View style={styles.container}>
          <AppText variant={Variant.bodybold} style={styles.introTitle}>
            Recent Tickets
          </AppText>
          <AppText variant={Variant.caption} style={styles.introSubtitle}>
            Track your existing requests and their current status.
          </AppText>

          {tickets.map(ticket => (
            <View key={ticket.id} style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <AppText variant={Variant.bodybold} style={styles.ticketTitle}>
                  {ticket.subject}
                </AppText>
                <View
                  style={[
                    styles.badge,
                    ticket.status === 'Resolved' && styles.resolvedBadge,
                    ticket.status === 'In Progress' && styles.progressBadge,
                  ]}>
                  <AppText style={styles.badgeText}>{ticket.status}</AppText>
                </View>
              </View>
              <AppText variant={Variant.caption} style={styles.ticketMeta}>
                Ticket #{ticket.id} • Priority: {ticket.priority}
              </AppText>
              <AppText variant={Variant.caption} style={styles.ticketMeta}>
                Last updated {ticket.lastUpdated}
              </AppText>
            </View>
          ))}
        </View>
      </Scrollable>
    </>
  );
};

export default SupportTickets;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  introTitle: {
    marginTop: 4,
    color: colors.black,
  },
  introSubtitle: {
    color: colors.text,
    marginBottom: 16,
  },
  ticketCard: {
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: wp(2),
    padding: 14,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketTitle: {
    flex: 1,
    marginRight: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: colors.yellowBg,
  },
  resolvedBadge: {
    backgroundColor: colors.greenBg,
  },
  progressBadge: {
    backgroundColor: colors.orange,
  },
  badgeText: {
    fontSize: 12,
    color: colors.black,
  },
  ticketMeta: {
    color: colors.text,
    marginTop: 4,
  },
});

