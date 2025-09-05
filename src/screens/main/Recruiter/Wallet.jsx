import React, { useState } from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  Image
} from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
// import AppHeader from '@/components/AppHeader'
import { LinearGradient } from 'react-native-linear-gradient'
import AppHeader from '@/core/AppHeader'
import { Icons } from '@/assets'
import AppButton from '@/core/AppButton'
import WalletBalanceComponent from '@/components/wallet/WalletBalanceComponent'

const Wallet = ({ navigation }) => {
  const [transactions] = useState([
    { id: 1, name: 'Job post charge', type: 'Debit', amount: 'AUD 0.50' },
    { id: 2, name: 'Withdraw pending', type: 'Debit', amount: 'AUD 0.50' },
    { id: 3, name: 'Job post charge', type: 'Debit', amount: 'AUD 0.50' },
    { id: 4, name: 'Withdraw pending', type: 'Debit', amount: 'AUD 0.50' },
    { id: 5, name: 'Job post charge', type: 'Debit', amount: 'AUD 0.50' },
    { id: 6, name: 'Coin purchased', type: 'Debit', amount: 'AUD 0.50' },
  ])

  const renderCoinCard = (title, amount, color, icon) => (
    <View style={[styles.coinCard, { borderColor: color }]}>
      <View style={styles.coinCardHeader}>
        <View>
          <AppText variant={Variant.bodyMedium} style={[styles.coinCardTitle, { color }]}>
            {title}
          </AppText>
         
        </View>
        <View style={[styles.coinIcon, { backgroundColor: color + '20' }]}>
          <Image source={icon} style={styles.coinImage} />
        </View>
      </View>
      
      <View style={styles.coinAmount}>
        <AppText variant={Variant.title} style={[styles.amountText, { color }]}>
          {amount}
        </AppText>
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName="arrow-down"
          size={20}
          color={color}
        />
      </View>
    </View>
  )

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionRow}>
      <AppText variant={Variant.body} style={styles.transactionName}>
        {item.name}
      </AppText>
      <AppText variant={Variant.body} style={styles.transactionType}>
        {item.type}
      </AppText>
      <AppText variant={Variant.bodyMedium} style={styles.transactionAmount}>
        {item.amount}
      </AppText>
    </View>
  )

  const renderExportButton = (type, icon, color) => (
    <TouchableOpacity style={styles.exportButton} activeOpacity={0.7}>
     <Image source={icon} style={{
       width: wp(7),
       height: wp(7),
       resizeMode: 'contain'
     }} />
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <AppHeader
        title="Wallet"
        showTopIcons={true}
        showBackButton={false}
        onMenuPress={() => navigation.openDrawer()}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onSearchPress={() => navigation.navigate('Search')}
        gradientColors={['#8B5CF6', '#EC4899']}
        children={
          <View style={{}}>
          <WalletBalanceComponent />
            </View>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Coin Cards */}
        <View style={styles.coinCardsContainer}>
          {renderCoinCard('Coins\nPurchases', '100', '#10B981', Icons.purchasecoins)}
          {renderCoinCard('Referred\nCoins', '100', '#EC4899', Icons.referredcoins)}
        </View>

        {/* Transaction Table */}
        <View style={styles.transactionSection}>
          {/* Table Header */}
          <View
            style={styles.tableHeader}
          >
            <AppText variant={Variant.bodyMedium} style={styles.tableHeaderText}>
             {"Transaction\nName"}
            </AppText>
            <AppText variant={Variant.bodyMedium} style={styles.tableHeaderText}>
              Type
            </AppText>
            <AppText variant={Variant.bodyMedium} style={styles.tableHeaderText}>
              Amount
            </AppText>
          </View>

          {/* Transaction List */}
          <FlatList
            data={transactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />

          {/* Export Section */}
          <View style={styles.exportSection}>
            <AppText variant={Variant.bodyMedium} style={styles.exportTitle}>
              Export In
            </AppText>
            <View style={styles.exportButtons}>
              {renderExportButton('PDF', Icons.pdfexport, '#DC2626')}
              {renderExportButton('Excel',Icons.excelexport, '#059669')}
            </View>
          </View>
        </View>

        {/* Referral Section */}
        <View
          style={styles.referralCard}
        >
          <AppText variant={Variant.title} style={styles.referralTitle}>
            Refer & Earn Coins Now!
          </AppText>
          <AppText variant={Variant.body} style={styles.referralDescription}>
            Don't miss out on the excitement - the more friends you bring, the more coins you earn. Let the referrals begin!
          </AppText>

          {/* Referral Illustration */}
          <View style={styles.referralIllustration}>
            <Image source={Icons.refertoearn} style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }} />
          </View>

            <View style={{width: '100%'}}>

          <AppButton
            text={'Refer Now'}
            />
            </View>
        </View>
      </ScrollView>

    
    </View>
  )
}

export default Wallet

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  coinCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    gap: wp(3),
  },
  coinCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: hp(2),
    borderWidth: 2,
    padding: wp(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coinCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(2),
  },
  coinCardTitle: {
    fontSize: getFontSize(16),
    fontWeight: '600',
  },
  coinCardSubtitle: {
    fontSize: getFontSize(12),
    color: colors.gray,
    marginTop: hp(0.3),
  },
  coinIcon: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinImage: {
    width: wp(6),
    height: wp(6),
    resizeMode: 'contain'
   
   
  },
  coinAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  amountText: {
    fontSize: getFontSize(28),
    fontWeight: 'bold',
  },
  transactionSection: {
    marginHorizontal: wp(4),
    marginBottom: hp(3),
    borderRadius: hp(2),
    overflow: 'hidden',
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: hp(2),
    backgroundColor: colors.secondary,
    paddingHorizontal: wp(4),
  },
  tableHeaderText: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: getFontSize(13),
  },
  transactionRow: {
    flexDirection: 'row',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    backgroundColor: '#DBDBE9',
  },
  transactionName: {
    flex: 1,
    marginRight: 20,
    // backgroundColor: 'red',
    color: "#65799B",
    fontSize: getFontSize(13),
  },
  transactionType: {
    flex: 1,
     color: "#65799B",
    fontSize: getFontSize(14),
  },
  transactionAmount: {
    flex: 1,
     color: "#65799B",
    fontSize: getFontSize(14),
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: colors.grayE8 || '#F3F4F6',
  },
  exportSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    backgroundColor: colors.white,
  },
  exportTitle: {
    color: colors.black,
    fontSize: getFontSize(16),
    fontWeight: '500',
  },
  exportButtons: {
    flexDirection: 'row',
    gap: wp(3),
  },
  exportButton: {
    width: wp(10),
    height: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grayE8,
    borderRadius: wp(2),
  },
  referralCard: {
    marginHorizontal: wp(4),
    marginBottom: hp(3),
    borderRadius: hp(3),
    padding: wp(6),
    backgroundColor: colors.secondary,
    alignItems: 'center',
  },
  referralTitle: {
    color: '#FFFFFF',
    fontSize: getFontSize(22),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp(2),
  },
  referralDescription: {
    color: '#FFFFFF',
    fontSize: getFontSize(14),
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 20,
    marginBottom: hp(4),
  },
  referralIllustration: {
    position: 'relative',
    width: wp(40),
    height: wp(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(4),
  },
  phoneContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  phone: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -wp(8),
    marginLeft: -wp(6),
    width: wp(12),
    height: wp(16),
    backgroundColor: '#1F2937',
    borderRadius: wp(2),
    padding: wp(1),
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: wp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneText: {
    fontSize: getFontSize(8),
    color: '#1F2937',
    marginTop: hp(0.5),
  },
  avatar: {
    position: 'absolute',
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: '#F59E0B',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatar1: { top: '10%', left: '20%', backgroundColor: '#EF4444' },
  avatar2: { top: '20%', right: '15%', backgroundColor: '#10B981' },
  avatar3: { bottom: '20%', right: '20%', backgroundColor: '#3B82F6' },
  avatar4: { bottom: '10%', left: '15%', backgroundColor: '#F59E0B' },
  avatar5: { top: '50%', left: '5%', backgroundColor: '#8B5CF6' },
  avatar6: { top: '50%', right: '5%', backgroundColor: '#EC4899' },
  referButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: wp(12),
    paddingVertical: hp(2),
    borderRadius: hp(3),
  },
  referButtonText: {
    color: '#FFFFFF',
    fontSize: getFontSize(16),
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderTopWidth: 1,
    borderTopColor: colors.grayE8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp(1),
  },
  activeNav: {
    // Active state styling
  },
  navText: {
    fontSize: getFontSize(10),
    color: colors.gray,
    marginTop: hp(0.5),
  },
})