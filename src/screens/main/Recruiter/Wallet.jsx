import React, { useMemo, useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Dimensions
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
import CodeSharing from '@/components/QuickSearch/CodeSharing'
import EscrowStatusBadge from '@/components/escrow/EscrowStatusBadge'
import EscrowActionButton from '@/components/escrow/EscrowActionButton'
import EscrowTimeline from '@/components/escrow/EscrowTimeline'
import { useSelector } from 'react-redux'
import RNFS from 'react-native-fs'
import Share from 'react-native-share'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { showToast, toastTypes } from '@/utilities/toastConfig'
import { Platform } from 'react-native'

const Wallet = ({ navigation }) => {
  const { coins, transactions = [], withdrawRequests = [] } = useSelector((state) => state.wallet)
  const { userInfo } = useSelector((state) => state.auth)
  const bankAccounts = useSelector((state) => state.bank.accounts)
  const selectedAccount = bankAccounts.find(acc => acc.isSelected)

  const combinedTransactions = transactions && transactions.length > 0 ? transactions : [
    { id: 101, name: 'Job post charge', type: 'Debit', amount: 'AUD 0.50' },
    { id: 102, name: 'Withdraw pending', type: 'Debit', amount: 'AUD 0.50' },
  ]

  const formatEscrowTimestamp = (isoString) => {
    if (!isoString) return '—';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '—';
    const day = date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
    const time = date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
    return `${day} · ${time}`;
  };

  const mockEscrowEntries = useMemo(
    () => [
      {
        id: 'escrow-js-01',
        persona: 'jobseeker',
        jobTitle: 'Commercial Painting · Emergency Shift',
        counterpart: 'BuildRight Pty Ltd',
        stageLabel: 'Stage 6 · Awaiting Code',
        stageValue: 'Waiting on recruiter response',
        stageTone: 'warning',
        heldAmount: 0,
        hourlyRate: 38,
        expectedHours: 12,
        requestedAtLabel: formatEscrowTimestamp('2025-12-04T05:15:00+11:00'),
        holdStartedLabel: null,
        codeCountdown: '08:45',
        resumeCountdown: null,
        code: '641208',
        codeExpiry: '2025-12-04T07:00:00+11:00',
        showCodeSharing: true,
        readOnlyCode: false,
        helperText: 'Enter the recruiter code to start the hold.',
        timeline: [
          {
            key: 'request',
            title: 'Request sent',
            description: 'Job seeker asked SquadGoo to hold payment',
            timestampLabel: formatEscrowTimestamp('2025-12-04T05:15:00+11:00'),
            status: 'done',
          },
          {
            key: 'code',
            title: 'Code pending',
            description: 'Recruiter has 10 min to share 6-digit code',
            timestampLabel: 'Code expires in 08:45',
            status: 'current',
          },
          {
            key: 'hold',
            title: 'Hold awaiting',
            description: 'Coins held once code is verified',
            timestampLabel: 'Hold start pending',
            status: 'upcoming',
          },
        ],
        actions: [
          { label: 'Request Recharge', icon: 'cash-outline' },
          { label: 'Acknowledge & Continue', icon: 'checkmark-circle-outline' },
          { label: 'Decline Offer', icon: 'close-outline' },
        ],
        notice: 'If the recruiter ignores this stage the job seeker can cancel without penalties.',
      },
      {
        id: 'escrow-js-02',
        persona: 'jobseeker',
        jobTitle: 'Warehouse Inventory Support',
        counterpart: 'Northside Logistics',
        stageLabel: 'Stage 7 · Hold Active',
        stageValue: 'Timer paused · resume within 00:32',
        stageTone: 'info',
        heldAmount: 560,
        hourlyRate: 40,
        expectedHours: 14,
        requestedAtLabel: formatEscrowTimestamp('2025-12-03T19:10:00+11:00'),
        holdStartedLabel: formatEscrowTimestamp('2025-12-03T20:02:00+11:00'),
        codeCountdown: null,
        resumeCountdown: '00:32',
        showCodeSharing: false,
        timeline: [
          {
            key: 'request',
            title: 'Request sent',
            description: 'Platform handling payment',
            timestampLabel: formatEscrowTimestamp('2025-12-03T19:10:00+11:00'),
            status: 'done',
          },
          {
            key: 'code',
            title: 'Code verified',
            description: 'Recruiter shared code with job seeker',
            timestampLabel: formatEscrowTimestamp('2025-12-03T19:52:00+11:00'),
            status: 'done',
          },
          {
            key: 'hold',
            title: 'Hold active',
            description: 'SG 560 locked while clock paused',
            timestampLabel: 'Resume window closes in 00:32',
            status: 'current',
          },
          {
            key: 'release',
            title: 'Release pending',
            description: 'Coins auto-release 7 days after completion',
            timestampLabel: 'Release scheduled · 10 Dec',
            status: 'upcoming',
          },
        ],
        actions: [
          { label: 'Resume Clock', icon: 'play-outline' },
          { label: 'Request Recharge', icon: 'cash-outline' },
          { label: 'Release Hold', icon: 'lock-open-outline' },
        ],
        notice: 'Balance warning sent to recruiter before hold ends.',
      },
      {
        id: 'escrow-rec-01',
        persona: 'recruiter',
        jobTitle: 'Night Shift Cleaners',
        counterpart: 'Squad Courier Team',
        stageLabel: 'Stage 7 · Hold Active',
        stageValue: 'Provide stop-code before ending shift',
        stageTone: 'success',
        heldAmount: 680,
        hourlyRate: 45,
        expectedHours: 15,
        requestedAtLabel: formatEscrowTimestamp('2025-12-03T18:30:00+11:00'),
        holdStartedLabel: formatEscrowTimestamp('2025-12-03T19:00:00+11:00'),
        codeCountdown: 'Code shared 06:45 PM',
        resumeCountdown: 'Auto release in 6d 22h',
        code: '982144',
        codeExpiry: '2025-12-09T06:00:00+11:00',
        showCodeSharing: true,
        readOnlyCode: true,
        helperText: 'Share this QR or six-digit code with the job seeker.',
        timeline: [
          {
            key: 'request',
            title: 'Job seeker request',
            description: 'Payment request accepted by recruiter',
            timestampLabel: formatEscrowTimestamp('2025-12-03T18:30:00+11:00'),
            status: 'done',
          },
          {
            key: 'share',
            title: 'Code shared',
            description: 'QR + numeric code sent to job seeker',
            timestampLabel: formatEscrowTimestamp('2025-12-03T18:45:00+11:00'),
            status: 'done',
          },
          {
            key: 'hold',
            title: 'Hold active',
            description: 'Coins locked until timer stops',
            timestampLabel: 'Release scheduled · 09 Dec',
            status: 'current',
          },
          {
            key: 'release',
            title: 'Release pending',
            description: 'Review window 7 days',
            timestampLabel: 'Auto-release 09 Dec · 6:00 AM',
            status: 'upcoming',
          },
        ],
        actions: [
          { label: 'Provide Code', icon: 'qr-code-outline' },
          { label: 'Recharge Now', icon: 'card-outline' },
          { label: 'Release Hold', icon: 'lock-open-outline' },
        ],
        notice: 'Recruiter can recharge anytime to increase hold buffer.',
      },
    ],
    [],
  )

  const jobSeekerEscrows = useMemo(
    () => mockEscrowEntries.filter((entry) => entry.persona === 'jobseeker'),
    [mockEscrowEntries],
  )
  const recruiterEscrows = useMemo(
    () => mockEscrowEntries.filter((entry) => entry.persona === 'recruiter'),
    [mockEscrowEntries],
  )

  const [selectedEscrow, setSelectedEscrow] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  // Calculate release date from escrow data
  const getReleaseDate = (entry) => {
    if (!entry.timeline) return null
    const releaseStep = entry.timeline.find(step => step.key === 'release')
    if (releaseStep?.timestampLabel) {
      // Extract date from timestamp label like "Auto-release 09 Dec · 6:00 AM"
      return releaseStep.timestampLabel
    }
    // If hold started, calculate 7 days from hold start
    if (entry.holdStartedLabel) {
      try {
        // Try to parse the holdStartedLabel format: "Wed 3 Dec · 08:02 PM"
        const parts = entry.holdStartedLabel.split(' · ')
        if (parts.length === 2) {
          const datePart = parts[0] // "Wed 3 Dec"
          const timePart = parts[1] // "08:02 PM"
          // Create a date object (approximate parsing)
          const now = new Date()
          const releaseDate = new Date(now)
          releaseDate.setDate(releaseDate.getDate() + 7)
          return releaseDate.toLocaleDateString('en-AU', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      } catch (e) {
        // Fallback
      }
    }
    return null
  }

  const handleEscrowPress = (entry) => {
    setSelectedEscrow(entry)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedEscrow(null)
  }

  // Simplified escrow card renderer
  const renderSimpleEscrowCard = (entry) => (
    <TouchableOpacity
      key={entry.id}
      style={styles.simpleEscrowCard}
      activeOpacity={0.7}
      onPress={() => handleEscrowPress(entry)}
    >
      <View style={styles.simpleCardHeader}>
        <View style={styles.simpleCardLeft}>
          <AppText variant={Variant.bodyMedium} style={styles.simpleJobTitle}>
            {entry.jobTitle}
          </AppText>
          <AppText variant={Variant.caption} style={styles.simpleCounterparty}>
            {entry.counterpart}
          </AppText>
        </View>
        <EscrowStatusBadge
          label={entry.stageLabel}
          value={entry.stageValue}
          tone={entry.stageTone}
        />
      </View>
      <View style={styles.simpleCardFooter}>
        <View>
          <AppText variant={Variant.caption} style={styles.amountLabel}>
            Held Amount
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.amountValue}>
            {entry.heldAmount ? `${entry.heldAmount.toFixed(2)} SG` : 'Awaiting hold'}
          </AppText>
        </View>
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName="chevron-forward"
          size={20}
          color={colors.gray}
        />
      </View>
    </TouchableOpacity>
  )

  // Modal component for escrow details
  const renderEscrowDetailModal = () => {
    if (!selectedEscrow) return null

    const releaseDate = getReleaseDate(selectedEscrow)

    return (
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeModal}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <AppText variant={Variant.title} style={styles.modalTitle}>
                Escrow Details
              </AppText>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="close"
                  size={24}
                  color={colors.secondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Job Info */}
              <View style={styles.modalSection}>
                <AppText variant={Variant.bodyMedium} style={styles.modalJobTitle}>
                  {selectedEscrow.jobTitle}
                </AppText>
                <AppText variant={Variant.caption} style={styles.modalCounterparty}>
                  Counterparty: {selectedEscrow.counterpart}
                </AppText>
              </View>

              {/* Status Badge */}
              <View style={styles.modalSection}>
                <EscrowStatusBadge
                  label={selectedEscrow.stageLabel}
                  value={selectedEscrow.stageValue}
                  tone={selectedEscrow.stageTone}
                />
              </View>

              {/* Amount Info */}
              <View style={styles.modalSection}>
                <View style={styles.modalAmountRow}>
                  <View>
                    <AppText variant={Variant.caption} style={styles.amountLabel}>
                      Held SG Coins
                    </AppText>
                    <AppText variant={Variant.title} style={styles.amountValue}>
                      {selectedEscrow.heldAmount ? `${selectedEscrow.heldAmount.toFixed(2)} SG` : 'Awaiting hold'}
                    </AppText>
                  </View>
                  <View style={styles.amountMeta}>
                    <AppText variant={Variant.caption} style={styles.metaLabel}>
                      Hourly Rate: {selectedEscrow.hourlyRate} SG
                    </AppText>
                    <AppText variant={Variant.caption} style={styles.metaLabel}>
                      Expected Hours: {selectedEscrow.expectedHours}h
                    </AppText>
                  </View>
                </View>
              </View>

              {/* Timeline */}
              <View style={styles.modalSection}>
                <AppText variant={Variant.bodyMedium} style={styles.modalSectionTitle}>
                  Escrow Timeline
                </AppText>
                <EscrowTimeline steps={selectedEscrow.timeline} />
              </View>

              {/* Release Date */}
              {releaseDate && (
                <View style={styles.modalSection}>
                  <View style={styles.releaseDateCard}>
                    <View style={styles.releaseDateHeader}>
                      <VectorIcons
                        name={iconLibName.Ionicons}
                        iconName="calendar-outline"
                        size={20}
                        color={colors.primary}
                      />
                      <AppText variant={Variant.bodyMedium} style={styles.releaseDateTitle}>
                        Payment Release Date
                      </AppText>
                    </View>
                    <AppText variant={Variant.title} style={styles.releaseDateValue}>
                      {releaseDate}
                    </AppText>
                  </View>
                </View>
              )}

              {/* Code Sharing if applicable */}
              {selectedEscrow.showCodeSharing && (
                <View style={styles.modalSection}>
                  <CodeSharing
                    code={selectedEscrow.code}
                    codeLabel="Escrow Code"
                    helperText={selectedEscrow.helperText}
                    codeExpiry={selectedEscrow.codeExpiry}
                    showKeypad={!selectedEscrow.readOnlyCode}
                    readOnly={!!selectedEscrow.readOnlyCode}
                  />
                </View>
              )}

              {/* Notice */}
              {selectedEscrow.notice && (
                <View style={styles.modalSection}>
                  <View style={styles.noticeCard}>
                    <AppText variant={Variant.caption} style={styles.noticeText}>
                      {selectedEscrow.notice}
                    </AppText>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    )
  }

  const renderEscrowOverviewCard = (title, entry) => {
    if (!entry) return null
    return (
      <View key={`${entry.id}-overview`} style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <AppText variant={Variant.bodyMedium} style={styles.overviewTitle}>
            {title}
          </AppText>
          <EscrowStatusBadge
            label={entry.stageLabel}
            value={entry.stageValue}
            tone={entry.stageTone}
          />
        </View>
        <View style={styles.overviewAmounts}>
          <View>
            <AppText variant={Variant.caption} style={styles.amountLabel}>
              Held SG Coins
            </AppText>
            <AppText variant={Variant.title} style={styles.amountValue}>
              {entry.heldAmount ? `${entry.heldAmount.toFixed(2)} SG` : 'Awaiting hold'}
            </AppText>
          </View>
          <View>
            <AppText variant={Variant.caption} style={styles.metaLabel}>
              Requested
            </AppText>
            <AppText variant={Variant.bodyMedium} style={styles.metaValue}>
              {entry.requestedAtLabel}
            </AppText>
          </View>
        </View>
        <View style={styles.timersRow}>
          {entry.codeCountdown ? (
            <EscrowStatusBadge
              label="Code timer"
              value={entry.codeCountdown}
              tone="warning"
              compact
            />
          ) : null}
          {entry.resumeCountdown ? (
            <EscrowStatusBadge
              label="Resume window"
              value={entry.resumeCountdown}
              tone="info"
              compact
            />
          ) : null}
          {entry.holdStartedLabel ? (
            <EscrowStatusBadge
              label="Hold started"
              value={entry.holdStartedLabel}
              tone="default"
              compact
            />
          ) : null}
        </View>
        <View style={styles.actionsRow}>
          {entry.actions?.slice(0, 2).map((action) => (
            <EscrowActionButton
              key={`${entry.id}-overview-${action.label}`}
              label={action.label}
              icon={action.icon}
              disabled
            />
          ))}
        </View>
      </View>
    )
  }

  const renderEscrowCard = (entry) => (
    <View key={entry.id} style={styles.escrowCard}>
      <View style={styles.escrowCardHeader}>
        <View style={styles.headerColumn}>
          <AppText variant={Variant.bodyMedium} style={styles.jobTitle}>
            {entry.jobTitle}
          </AppText>
          <AppText variant={Variant.caption} style={styles.counterpartyText}>
            Counterparty: {entry.counterpart}
          </AppText>
        </View>
        <View>
          <EscrowStatusBadge
            label={entry.stageLabel}
            value={entry.stageValue}
            tone={entry.stageTone}
          />
        </View>
      </View>

      <View style={styles.amountRow}>
        <View>
          <AppText variant={Variant.caption} style={styles.amountLabel}>
            Held SG Coins
          </AppText>
          <AppText variant={Variant.title} style={styles.amountValue}>
            {entry.heldAmount ? `${entry.heldAmount.toFixed(2)} SG` : 'Awaiting hold'}
          </AppText>
        </View>
        <View style={styles.amountMeta}>
          <AppText variant={Variant.caption} style={styles.metaLabel}>
            Hourly · {entry.hourlyRate} SG
          </AppText>
          <AppText variant={Variant.caption} style={styles.metaLabel}>
            Expected hours · {entry.expectedHours}h
          </AppText>
        </View>
      </View>

      <View style={styles.timersRow}>
        {entry.codeCountdown ? (
          <EscrowStatusBadge label="Code timer" value={entry.codeCountdown} tone="warning" compact />
        ) : null}
        {entry.resumeCountdown ? (
          <EscrowStatusBadge label="Resume window" value={entry.resumeCountdown} tone="info" compact />
        ) : null}
        <EscrowStatusBadge label="Requested" value={entry.requestedAtLabel} compact />
        {entry.holdStartedLabel ? (
          <EscrowStatusBadge label="Hold started" value={entry.holdStartedLabel} compact />
        ) : null}
      </View>

      {entry.showCodeSharing ? (
        <CodeSharing
          code={entry.code}
          codeLabel="Escrow Code"
          helperText={entry.helperText}
          codeExpiry={entry.codeExpiry}
          showKeypad={!entry.readOnlyCode}
          readOnly={!!entry.readOnlyCode}
        />
      ) : null}

      <EscrowTimeline steps={entry.timeline} />

      <View style={styles.actionsRow}>
        {entry.actions?.map((action) => (
          <EscrowActionButton
            key={`${entry.id}-${action.label}`}
            label={action.label}
            icon={action.icon}
            disabled={action.disabled !== false}
          />
        ))}
      </View>

      {entry.notice ? (
        <View style={styles.noticeCard}>
          <AppText variant={Variant.caption} style={styles.noticeText}>
            {entry.notice}
          </AppText>
        </View>
      ) : null}
    </View>
  )

  const renderEscrowSection = (title, entries) => {
    if (!entries?.length) return null
    return (
      <View style={styles.escrowSection}>
        <AppText variant={Variant.title} style={styles.sectionTitle}>
          {title}
        </AppText>
        {entries.map(renderEscrowCard)}
      </View>
    )
  }

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

  const handleReferNow = async () => {
    try {
      const referralCode =
        userInfo?.referralCode ||
        userInfo?.referral_code ||
        userInfo?.referCode ||
        userInfo?.refer_code ||
        ''

      const message = referralCode
        ? `Join SquadGoo using my referral code: ${referralCode}`
        : 'Join SquadGoo!'

      await Share.open({
        title: 'Invite to SquadGoo',
        message,
        failOnCancel: false,
      })
    } catch {
      // user-cancel is fine; ignore
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
        {/* Simplified Escrow Sections */}
        {jobSeekerEscrows.length > 0 && (
          <View style={styles.escrowSection}>
            <AppText variant={Variant.title} style={styles.sectionTitle}>
              Job Seeker Escrows
            </AppText>
            {jobSeekerEscrows.map(renderSimpleEscrowCard)}
          </View>
        )}

        {recruiterEscrows.length > 0 && (
          <View style={styles.escrowSection}>
            <AppText variant={Variant.title} style={styles.sectionTitle}>
              Recruiter Escrows
            </AppText>
            {recruiterEscrows.map(renderSimpleEscrowCard)}
          </View>
        )}

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
              onPress={handleReferNow}
            />
          </View>
        </View>
      </ScrollView>

      {/* Escrow Detail Modal */}
      {renderEscrowDetailModal()}
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
  escrowOverviewContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  overviewCard: {
    backgroundColor: colors.white,
    borderRadius: hp(2),
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overviewTitle: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '600',
    width: '48%'
  },
  overviewAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: hp(1.5),
  },
  amountLabel: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  amountValue: {
    color: colors.secondary,
    fontSize: getFontSize(22),
    fontWeight: '700',
    marginTop: hp(0.3),
  },
  metaLabel: {
    color: colors.gray,
    fontSize: getFontSize(12),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    color: colors.secondary,
    fontSize: getFontSize(13),
    marginTop: hp(0.3),
  },
  timersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: hp(1),
  },
  escrowSection: {
    paddingHorizontal: wp(4),
    marginBottom: hp(2),
  },
  escrowCard: {
    backgroundColor: colors.white,
    borderRadius: hp(2),
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
  },
  headerColumn: {
    width: '48%',
  },
  escrowCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobTitle: {
    color: colors.secondary,
    fontSize: getFontSize(15),
    fontWeight: '600',
  },
  counterpartyText: {
    color: colors.gray,
    marginTop: hp(0.2),
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: hp(1.2),
  },
  amountMeta: {
    alignItems: 'flex-end',
  },
  noticeCard: {
    marginTop: hp(1.2),
    padding: wp(3),
    borderRadius: hp(1.5),
    backgroundColor: colors.grayE8 || '#F3F4F6',
  },
  noticeText: {
    color: colors.gray,
    fontSize: getFontSize(12),
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
  // Simple Escrow Card Styles
  simpleEscrowCard: {
    backgroundColor: colors.white,
    borderRadius: hp(2),
    padding: wp(4),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  simpleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(1.5),
  },
  simpleCardLeft: {
    flex: 1,
    marginRight: wp(2),
  },
  simpleJobTitle: {
    color: colors.secondary,
    fontSize: getFontSize(15),
    fontWeight: '600',
    marginBottom: hp(0.3),
  },
  simpleCounterparty: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  simpleCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: hp(3),
    borderTopRightRadius: hp(3),
    maxHeight: Dimensions.get('window').height * 0.9,
    paddingBottom: hp(2),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#E5E7EB',
  },
  modalTitle: {
    color: colors.secondary,
    fontSize: getFontSize(20),
    fontWeight: '700',
  },
  closeButton: {
    padding: wp(1),
  },
  modalContent: {
    paddingHorizontal: wp(4),
  },
  modalSection: {
    marginTop: hp(2),
  },
  modalJobTitle: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginBottom: hp(0.5),
  },
  modalCounterparty: {
    color: colors.gray,
    fontSize: getFontSize(13),
  },
  modalSectionTitle: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginBottom: hp(1),
  },
  modalAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  releaseDateCard: {
    backgroundColor: colors.grayE8 || '#F3F4F6',
    borderRadius: hp(2),
    padding: wp(4),
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  releaseDateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  releaseDateTitle: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
    marginLeft: wp(2),
  },
  releaseDateValue: {
    color: colors.primary,
    fontSize: getFontSize(18),
    fontWeight: '700',
  },
})