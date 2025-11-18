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
import { useSelector } from 'react-redux'
import RNFS from 'react-native-fs'
import Share from 'react-native-share'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { showToast, toastTypes } from '@/utilities/toastConfig'
import { Platform } from 'react-native'

const Wallet = ({ navigation }) => {
  const { coins, transactions = [], withdrawRequests = [] } = useSelector((state) => state.wallet)
  const bankAccounts = useSelector((state) => state.bank.accounts)
  const selectedAccount = bankAccounts.find(acc => acc.isSelected)

  const combinedTransactions = transactions && transactions.length > 0 ? transactions : [
    { id: 101, name: 'Job post charge', type: 'Debit', amount: 'AUD 0.50' },
    { id: 102, name: 'Withdraw pending', type: 'Debit', amount: 'AUD 0.50' },
  ]

  // 🧾 Export Transactions as CSV
  const exportToCSV = async () => {
    try {
      if (combinedTransactions.length === 0) {
        showToast('No transactions to export', 'Error', toastTypes.error)
        return
      }

      // Escape commas and quotes in CSV
      const escapeCSV = (str) => {
        const stringValue = String(str || '')
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      }

      const headers = 'Transaction Name,Type,Amount\n'
      const rows = combinedTransactions
        .map(t => `${escapeCSV(t.name)},${escapeCSV(t.type)},${escapeCSV(t.amount)}`)
        .join('\n')

      const csvContent = headers + rows
      const fileName = `transactions_${new Date().toISOString().split('T')[0]}.csv`
      
      // Use CacheDirectoryPath for better compatibility
      const baseDir = Platform.OS === 'android' 
        ? RNFS.CachesDirectoryPath 
        : RNFS.DocumentDirectoryPath
      const path = `${baseDir}/${fileName}`

      // Ensure directory exists
      const dirExists = await RNFS.exists(baseDir)
      if (!dirExists) {
        await RNFS.mkdir(baseDir)
      }

      await RNFS.writeFile(path, csvContent, 'utf8')
      
      // Use proper file URI format
      const fileUri = Platform.OS === 'ios' 
        ? `file://${path}` 
        : `file://${path}`
      
      const shareOptions = {
        url: fileUri,
        type: 'text/csv',
        filename: fileName.replace('.csv', ''),
        showAppsToView: true,
        failOnCancel: false,
      }

      if (Platform.OS === 'android') {
        shareOptions.title = 'Share CSV File'
      }

      await Share.open(shareOptions)
      
      showToast('CSV exported successfully', 'Success', toastTypes.success)
    } catch (error) {
      console.error('CSV export error:', error)
      const errorMessage = error?.message || String(error)
      if (errorMessage !== 'User did not share' && !errorMessage.includes('User did not share')) {
        showToast(`Failed to export CSV: ${errorMessage}`, 'Error', toastTypes.error)
      }
    }
  }

  // 📄 Export Transactions as PDF
  const exportToPDF = async () => {
    try {
      if (combinedTransactions.length === 0) {
        showToast('No transactions to export', 'Error', toastTypes.error)
        return
      }

      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const fontSize = 11
      const lineHeight = 18
      const margin = 50
      const itemsPerPage = 35
      let currentPage = pdfDoc.addPage()
      let { width, height } = currentPage.getSize()
      let y = height - margin
      let itemIndex = 0

      // Helper function to add new page if needed
      const checkNewPage = () => {
        if (y < margin + 50) {
          currentPage = pdfDoc.addPage()
          y = height - margin
          return true
        }
        return false
      }

      // Title
      currentPage.drawText('Transaction History', {
        x: margin,
        y: y,
        size: 20,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.8),
      })
      y -= 30

      // Date
      const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      currentPage.drawText(`Generated on: ${dateStr}`, {
        x: margin,
        y: y,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5),
      })
      y -= 25

      // Table Header
      currentPage.drawText('No.', { x: margin, y: y, size: fontSize, font: boldFont, color: rgb(0, 0, 0) })
      currentPage.drawText('Transaction Name', { x: margin + 40, y: y, size: fontSize, font: boldFont, color: rgb(0, 0, 0) })
      currentPage.drawText('Type', { x: margin + 200, y: y, size: fontSize, font: boldFont, color: rgb(0, 0, 0) })
      currentPage.drawText('Amount', { x: margin + 280, y: y, size: fontSize, font: boldFont, color: rgb(0, 0, 0) })
      y -= lineHeight

      // Draw line under header
      currentPage.drawLine({
        start: { x: margin, y: y + 5 },
        end: { x: width - margin, y: y + 5 },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      })
      y -= 10

      // Table data
      combinedTransactions.forEach((item, index) => {
        checkNewPage()
        
        const rowY = y
        currentPage.drawText(`${index + 1}.`, { x: margin, y: rowY, size: fontSize, font })
        currentPage.drawText(item.name || 'N/A', { x: margin + 40, y: rowY, size: fontSize, font })
        currentPage.drawText(item.type || 'N/A', { x: margin + 200, y: rowY, size: fontSize, font })
        currentPage.drawText(item.amount || 'N/A', { x: margin + 280, y: rowY, size: fontSize, font })
        y -= lineHeight
      })

      // Summary
      checkNewPage()
      y -= 10
      currentPage.drawLine({
        start: { x: margin, y: y },
        end: { x: width - margin, y: y },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      })
      y -= 15
      currentPage.drawText(`Total Transactions: ${combinedTransactions.length}`, {
        x: margin,
        y: y,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0),
      })

      const pdfBytes = await pdfDoc.save()
      const fileName = `transactions_${new Date().toISOString().split('T')[0]}.pdf`
      
      // Use CacheDirectoryPath for better compatibility
      const baseDir = Platform.OS === 'android' 
        ? RNFS.CachesDirectoryPath 
        : RNFS.DocumentDirectoryPath
      const path = `${baseDir}/${fileName}`

      // Ensure directory exists
      const dirExists = await RNFS.exists(baseDir)
      if (!dirExists) {
        await RNFS.mkdir(baseDir)
      }
      
      // Convert Uint8Array to base64 for RNFS (React Native compatible)
      const uint8ArrayToBase64 = (uint8Array) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
        let result = ''
        let i = 0
        const len = uint8Array.length
        
        while (i < len) {
          const a = uint8Array[i++]
          const b = i < len ? uint8Array[i++] : 0
          const c = i < len ? uint8Array[i++] : 0
          
          const bitmap = (a << 16) | (b << 8) | c
          result += chars.charAt((bitmap >> 18) & 63)
          result += chars.charAt((bitmap >> 12) & 63)
          result += i - 2 < len ? chars.charAt((bitmap >> 6) & 63) : '='
          result += i - 1 < len ? chars.charAt(bitmap & 63) : '='
        }
        return result
      }
      
      const base64String = uint8ArrayToBase64(pdfBytes)
      await RNFS.writeFile(path, base64String, 'base64')
      
      // Use proper file URI format
      const fileUri = `file://${path}`
      
      const shareOptions = {
        url: fileUri,
        type: 'application/pdf',
        filename: fileName.replace('.pdf', ''),
        showAppsToView: true,
        failOnCancel: false,
      }

      if (Platform.OS === 'android') {
        shareOptions.title = 'Share PDF File'
      }
      
      await Share.open(shareOptions)
      
      showToast('PDF exported successfully', 'Success', toastTypes.success)
    } catch (error) {
      console.error('PDF export error:', error)
      const errorMessage = error?.message || String(error)
      if (errorMessage !== 'User did not share' && !errorMessage.includes('User did not share')) {
        showToast(`Failed to export PDF: ${errorMessage}`, 'Error', toastTypes.error)
      }
    }
  }


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

  const renderExportButton = (type, icon, color, onPress) => (
    <TouchableOpacity style={styles.exportButton} activeOpacity={0.7} onPress={onPress}>
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
        {/* Bank Account Info Section */}
        {selectedAccount && (
          <View style={styles.bankInfoCard}>
            <View style={styles.bankInfoHeader}>
              <AppText variant={Variant.title} style={styles.bankInfoTitle}>
                Selected Bank Account
              </AppText>
              {selectedAccount.isVerified && (
                <View style={styles.verifiedBadge}>
                  <AppText variant={Variant.bodySmall} style={styles.verifiedText}>
                    Verified
                  </AppText>
                </View>
              )}
            </View>
            <AppText variant={Variant.body} style={styles.bankInfoText}>
              {selectedAccount.bankName}
            </AppText>
            <AppText variant={Variant.bodySmall} style={styles.bankInfoDetail}>
              Account: {selectedAccount.accountNumber} | BSB: {selectedAccount.bsbCode}
            </AppText>
            <AppText variant={Variant.bodySmall} style={styles.bankInfoDetail}>
              {selectedAccount.branch}, {selectedAccount.city}
            </AppText>
          </View>
        )}

        {/* Withdrawal Requests Section */}
        {/* {withdrawRequests && withdrawRequests.length > 0 && (
          <View style={styles.withdrawSection}>
            <AppText variant={Variant.title} style={styles.sectionTitle}>
              Recent Withdrawals
            </AppText>
            {withdrawRequests.slice(0, 3).map((request) => (
              <View key={request.id} style={styles.withdrawItem}>
                <View style={styles.withdrawItemLeft}>
                  <AppText variant={Variant.bodyMedium} style={styles.withdrawAmount}>
                    ${request.totalUsdAmount.toFixed(2)}
                  </AppText>
                  <AppText variant={Variant.bodySmall} style={styles.withdrawStatus}>
                    {request.status}
                  </AppText>
                </View>
                <AppText variant={Variant.bodySmall} style={styles.withdrawDate}>
                  {new Date(request.createdAt).toLocaleDateString()}
                </AppText>
              </View>
            ))}
          </View>
        )} */}
        {/* Coin Cards */}
        <View style={styles.coinCardsContainer}>
          {renderCoinCard('Coins\nPurchases', `${coins}`, '#10B981', Icons.purchasecoins)}
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
            data={combinedTransactions}
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
              {renderExportButton('PDF', Icons.pdfexport, '#DC2626', exportToPDF)}
              {renderExportButton('Excel', Icons.excelexport, '#059669', exportToCSV)}
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

          <View style={{ width: '100%' }}>

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
  bankInfoCard: {
    marginHorizontal: wp(4),
    marginTop: hp(2),
    marginBottom: hp(2),
    padding: wp(4),
    backgroundColor: colors.white,
    borderRadius: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bankInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  bankInfoTitle: {
    color: colors.secondary,
    fontSize: getFontSize(18),
    fontWeight: '600',
  },
  verifiedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: hp(1),
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: getFontSize(12),
    fontWeight: '600',
  },
  bankInfoText: {
    color: colors.textPrimary,
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginBottom: hp(0.5),
  },
  bankInfoDetail: {
    color: colors.gray || '#6B7280',
    fontSize: getFontSize(13),
    marginTop: hp(0.3),
  },
  withdrawSection: {
    marginHorizontal: wp(4),
    marginBottom: hp(2),
    padding: wp(4),
    backgroundColor: colors.white,
    borderRadius: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    color: colors.secondary,
    fontSize: getFontSize(18),
    fontWeight: '600',
    marginBottom: hp(2),
  },
  withdrawItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#F3F4F6',
  },
  withdrawItemLeft: {
    flex: 1,
  },
  withdrawAmount: {
    color: colors.textPrimary,
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginBottom: hp(0.3),
  },
  withdrawStatus: {
    color: colors.gray || '#6B7280',
    fontSize: getFontSize(12),
    textTransform: 'capitalize',
  },
  withdrawDate: {
    color: colors.gray || '#6B7280',
    fontSize: getFontSize(12),
  },
})