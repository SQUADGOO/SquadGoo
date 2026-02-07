import React, { useMemo, useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Platform,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppHeader from '@/core/AppHeader'
import AppText, { Variant } from '@/core/AppText'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import RNFS from 'react-native-fs'
import Share from 'react-native-share'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { showToast, toastTypes } from '@/utilities/toastConfig'

const DATE_PRESETS = [
  { key: 'week', label: 'This week' },
  { key: 'month', label: 'This month' },
  { key: '3months', label: '3 months' },
  { key: 'ytd', label: 'YTD' },
  { key: 'custom', label: 'Custom' },
]

const STATUS_FILTERS = ['All', 'Paid', 'Pending', 'Held', 'Disputed']
const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest' },
  { key: 'highest', label: 'Highest' },
  { key: 'status', label: 'Status' },
]

const formatCurrency = (value) => {
  const n = Number(value || 0)
  return `AUD ${n.toFixed(2)}`
}

const formatShortDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })
}

const startOfDay = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

const endOfDay = (date) => {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

const getStatusTone = (status) => {
  const normalized = String(status || '').toLowerCase()
  if (normalized === 'paid') return { bg: '#ECFDF5', fg: '#047857', border: '#A7F3D0' }
  if (normalized === 'pending') return { bg: '#FFFBEB', fg: '#B45309', border: '#FDE68A' }
  if (normalized === 'held') return { bg: '#EFF6FF', fg: '#1D4ED8', border: '#BFDBFE' }
  if (normalized === 'disputed') return { bg: '#FEF2F2', fg: '#B91C1C', border: '#FECACA' }
  return { bg: colors.grayE8 || '#F3F4F6', fg: colors.gray || '#6B7280', border: '#E5E7EB' }
}

const isInRange = (dateISO, fromDate, toDate) => {
  if (!dateISO) return false
  const d = new Date(dateISO)
  if (Number.isNaN(d.getTime())) return false
  return d >= fromDate && d <= toDate
}

const buildPresetRange = (presetKey) => {
  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)

  if (presetKey === 'week') {
    const day = todayStart.getDay()
    const mondayOffset = (day + 6) % 7
    const from = new Date(todayStart)
    from.setDate(from.getDate() - mondayOffset)
    return { from: startOfDay(from), to: todayEnd }
  }

  if (presetKey === 'month') {
    const from = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1)
    return { from: startOfDay(from), to: todayEnd }
  }

  if (presetKey === '3months') {
    const from = new Date(todayStart)
    from.setMonth(from.getMonth() - 3)
    return { from: startOfDay(from), to: todayEnd }
  }

  if (presetKey === 'ytd') {
    const from = new Date(todayStart.getFullYear(), 0, 1)
    return { from: startOfDay(from), to: todayEnd }
  }

  return { from: startOfDay(new Date(0)), to: todayEnd }
}

const JobSeekerEarningReports = ({ navigation }) => {
  const [datePreset, setDatePreset] = useState('month')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortKey, setSortKey] = useState('newest')

  const [customModalVisible, setCustomModalVisible] = useState(false)
  const [customFrom, setCustomFrom] = useState(startOfDay(new Date(new Date().setDate(new Date().getDate() - 30))))
  const [customTo, setCustomTo] = useState(endOfDay(new Date()))
  const [showFromPicker, setShowFromPicker] = useState(false)
  const [showToPicker, setShowToPicker] = useState(false)

  // Dummy dataset (v1)
  const dummyEarnings = useMemo(
    () => [
      {
        id: 'js-er-001',
        jobTitle: 'Night Shift Cleaners',
        recruiterName: 'BuildRight Pty Ltd',
        status: 'Paid',
        dateISO: '2026-01-09T19:00:00+11:00',
        gross: 980,
        fee: 49,
        net: 931,
      },
      {
        id: 'js-er-002',
        jobTitle: 'Warehouse Inventory Support',
        recruiterName: 'Northside Logistics',
        status: 'Pending',
        dateISO: '2026-01-08T08:20:00+11:00',
        gross: 880,
        fee: 44,
        net: 836,
      },
      {
        id: 'js-er-003',
        jobTitle: 'Commercial Painting · Emergency Shift',
        recruiterName: 'PrimeCo Builders',
        status: 'Held',
        dateISO: '2025-12-24T07:40:00+11:00',
        gross: 1140,
        fee: 57,
        net: 1083,
      },
      {
        id: 'js-er-004',
        jobTitle: 'Event Setup Crew',
        recruiterName: 'City Events AU',
        status: 'Paid',
        dateISO: '2026-01-07T16:10:00+11:00',
        gross: 640,
        fee: 32,
        net: 608,
      },
      {
        id: 'js-er-005',
        jobTitle: 'Café Barista Cover',
        recruiterName: 'Brew & Co.',
        status: 'Disputed',
        dateISO: '2026-01-05T06:00:00+11:00',
        gross: 380,
        fee: 19,
        net: 361,
      },
      {
        id: 'js-er-006',
        jobTitle: 'Forklift Operator',
        recruiterName: 'Dockside Warehouse',
        status: 'Paid',
        dateISO: '2026-01-03T09:30:00+11:00',
        gross: 520,
        fee: 26,
        net: 494,
      },
      {
        id: 'js-er-007',
        jobTitle: 'Hospitality Floor Staff',
        recruiterName: 'Harbour Venue Group',
        status: 'Pending',
        dateISO: '2025-12-02T18:30:00+11:00',
        gross: 540,
        fee: 27,
        net: 513,
      },
      {
        id: 'js-er-008',
        jobTitle: 'Event Pack-down Crew',
        recruiterName: 'City Events AU',
        status: 'Paid',
        dateISO: '2025-12-06T23:20:00+11:00',
        gross: 390,
        fee: 19.5,
        net: 370.5,
      },
      {
        id: 'js-er-009',
        jobTitle: 'Delivery Route Support',
        recruiterName: 'Metro Couriers',
        status: 'Disputed',
        dateISO: '2025-12-09T07:10:00+11:00',
        gross: 610,
        fee: 30.5,
        net: 579.5,
      },
      {
        id: 'js-er-010',
        jobTitle: 'High-rise Window Cleaning',
        recruiterName: 'ClearView Services',
        status: 'Paid',
        dateISO: '2026-01-02T06:30:00+11:00',
        gross: 1020,
        fee: 51,
        net: 969,
      },
    ],
    [],
  )

  const activeRange = useMemo(() => {
    if (datePreset === 'custom') return { from: customFrom, to: customTo }
    return buildPresetRange(datePreset)
  }, [customFrom, customTo, datePreset])

  const filteredAndSorted = useMemo(() => {
    const { from, to } = activeRange
    const status = String(statusFilter || 'All')

    const filtered = dummyEarnings
      .filter((item) => isInRange(item.dateISO, from, to))
      .filter((item) => (status === 'All' ? true : item.status === status))

    const sorted = [...filtered]
    if (sortKey === 'highest') {
      sorted.sort((a, b) => Number(b.net || 0) - Number(a.net || 0))
    } else if (sortKey === 'status') {
      sorted.sort((a, b) => String(a.status || '').localeCompare(String(b.status || '')))
    } else {
      sorted.sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime())
    }

    return sorted
  }, [activeRange, dummyEarnings, sortKey, statusFilter])

  const totals = useMemo(() => {
    const gross = filteredAndSorted.reduce((sum, x) => sum + Number(x.gross || 0), 0)
    const fee = filteredAndSorted.reduce((sum, x) => sum + Number(x.fee || 0), 0)
    const net = filteredAndSorted.reduce((sum, x) => sum + Number(x.net || 0), 0)
    const pendingOrHeld = filteredAndSorted
      .filter((x) => x.status === 'Pending' || x.status === 'Held')
      .reduce((sum, x) => sum + Number(x.net || 0), 0)

    return { gross, fee, net, pendingOrHeld }
  }, [filteredAndSorted])

  const setPreset = (presetKey) => {
    setDatePreset(presetKey)
    if (presetKey === 'custom') {
      setCustomModalVisible(true)
    }
  }

  const exportToCSV = async () => {
    try {
      if (!filteredAndSorted.length) {
        showToast('No records to export', 'Error', toastTypes.error)
        return
      }

      const escapeCSV = (str) => {
        const stringValue = String(str || '')
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      }

      const headers = 'Date,Job,Recruiter,Status,Gross,Fee,Net\n'
      const rows = filteredAndSorted
        .map((r) =>
          [
            escapeCSV(formatShortDate(r.dateISO)),
            escapeCSV(r.jobTitle),
            escapeCSV(r.recruiterName),
            escapeCSV(r.status),
            escapeCSV(formatCurrency(r.gross)),
            escapeCSV(formatCurrency(r.fee)),
            escapeCSV(formatCurrency(r.net)),
          ].join(','),
        )
        .join('\n')

      const csvContent = headers + rows
      const fileName = `jobseeker_earning_reports_${new Date().toISOString().split('T')[0]}.csv`

      const baseDir = Platform.OS === 'android' ? RNFS.CachesDirectoryPath : RNFS.DocumentDirectoryPath
      const path = `${baseDir}/${fileName}`

      const dirExists = await RNFS.exists(baseDir)
      if (!dirExists) {
        await RNFS.mkdir(baseDir)
      }

      await RNFS.writeFile(path, csvContent, 'utf8')
      const fileUri = `file://${path}`

      await Share.open({
        url: fileUri,
        type: 'text/csv',
        filename: fileName.replace('.csv', ''),
        showAppsToView: true,
        failOnCancel: false,
        ...(Platform.OS === 'android' ? { title: 'Share CSV File' } : {}),
      })

      showToast('CSV exported successfully', 'Success', toastTypes.success)
    } catch (error) {
      const errorMessage = error?.message || String(error)
      if (errorMessage !== 'User did not share' && !errorMessage.includes('User did not share')) {
        showToast(`Failed to export CSV: ${errorMessage}`, 'Error', toastTypes.error)
      }
    }
  }

  const exportToPDF = async () => {
    try {
      if (!filteredAndSorted.length) {
        showToast('No records to export', 'Error', toastTypes.error)
        return
      }

      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

      let page = pdfDoc.addPage()
      const { width, height } = page.getSize()
      const margin = 40
      const fontSize = 10
      const lineHeight = 16
      let y = height - margin

      const addNewPageIfNeeded = () => {
        if (y < margin + 60) {
          page = pdfDoc.addPage()
          y = height - margin
        }
      }

      page.drawText('Earning Reports', {
        x: margin,
        y,
        size: 18,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2),
      })
      y -= 24

      page.drawText(
        `Period: ${formatShortDate(activeRange.from.toISOString())} - ${formatShortDate(activeRange.to.toISOString())}`,
        { x: margin, y, size: 10, font, color: rgb(0.45, 0.45, 0.45) },
      )
      y -= 18

      page.drawText(
        `Gross: ${formatCurrency(totals.gross)}   Fees: ${formatCurrency(totals.fee)}   Net: ${formatCurrency(totals.net)}`,
        { x: margin, y, size: 10, font: boldFont, color: rgb(0.1, 0.1, 0.1) },
      )
      y -= 22

      page.drawText('Date', { x: margin, y, size: fontSize, font: boldFont })
      page.drawText('Job', { x: margin + 70, y, size: fontSize, font: boldFont })
      page.drawText('Status', { x: width - margin - 150, y, size: fontSize, font: boldFont })
      page.drawText('Net', { x: width - margin - 60, y, size: fontSize, font: boldFont })
      y -= 10

      page.drawLine({
        start: { x: margin, y },
        end: { x: width - margin, y },
        thickness: 1,
        color: rgb(0.85, 0.85, 0.85),
      })
      y -= 12

      filteredAndSorted.forEach((r) => {
        addNewPageIfNeeded()
        page.drawText(formatShortDate(r.dateISO), { x: margin, y, size: fontSize, font })
        page.drawText(String(r.jobTitle || '').slice(0, 34), { x: margin + 70, y, size: fontSize, font })
        page.drawText(String(r.status || ''), { x: width - margin - 150, y, size: fontSize, font })
        page.drawText(formatCurrency(r.net), { x: width - margin - 60, y, size: fontSize, font })
        y -= lineHeight
      })

      const pdfBytes = await pdfDoc.save()
      const fileName = `jobseeker_earning_reports_${new Date().toISOString().split('T')[0]}.pdf`
      const baseDir = Platform.OS === 'android' ? RNFS.CachesDirectoryPath : RNFS.DocumentDirectoryPath
      const path = `${baseDir}/${fileName}`

      const dirExists = await RNFS.exists(baseDir)
      if (!dirExists) {
        await RNFS.mkdir(baseDir)
      }

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

      await RNFS.writeFile(path, uint8ArrayToBase64(pdfBytes), 'base64')

      const fileUri = `file://${path}`
      await Share.open({
        url: fileUri,
        type: 'application/pdf',
        filename: fileName.replace('.pdf', ''),
        showAppsToView: true,
        failOnCancel: false,
        ...(Platform.OS === 'android' ? { title: 'Share PDF File' } : {}),
      })

      showToast('PDF exported successfully', 'Success', toastTypes.success)
    } catch (error) {
      const errorMessage = error?.message || String(error)
      if (errorMessage !== 'User did not share' && !errorMessage.includes('User did not share')) {
        showToast(`Failed to export PDF: ${errorMessage}`, 'Error', toastTypes.error)
      }
    }
  }

  const renderPill = ({ label, active, onPress }) => (
    <TouchableOpacity
      key={label}
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
    >
      <AppText
        variant={Variant.bodySmall}
        style={[styles.pillText, active ? styles.pillTextActive : styles.pillTextInactive]}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  )

  const renderSummaryCard = ({ title, value, icon, tone = 'primary' }) => {
    const palette =
      tone === 'success'
        ? { bg: '#ECFDF5', fg: '#047857' }
        : tone === 'warning'
          ? { bg: '#FFFBEB', fg: '#B45309' }
          : tone === 'info'
            ? { bg: '#EFF6FF', fg: '#1D4ED8' }
            : { bg: '#F5F3FF', fg: colors.primary || '#7C3AED' }

    return (
      <View style={[styles.summaryCard, { backgroundColor: palette.bg }]}>
        <View style={styles.summaryTopRow}>
          <AppText variant={Variant.caption} style={styles.summaryTitle}>
            {title}
          </AppText>
          <View style={[styles.summaryIconWrap, { backgroundColor: `${palette.fg}15` }]}>
            <VectorIcons name={iconLibName.Ionicons} iconName={icon} size={18} color={palette.fg} />
          </View>
        </View>
        <AppText variant={Variant.title} style={[styles.summaryValue, { color: palette.fg }]}>
          {value}
        </AppText>
      </View>
    )
  }

  const renderRow = ({ item }) => {
    const tone = getStatusTone(item.status)
    return (
      <View style={styles.rowCard}>
        <View style={styles.rowHeader}>
          <View style={styles.rowTitleCol}>
            <AppText variant={Variant.bodyMedium} style={styles.rowJobTitle} numberOfLines={2}>
              {item.jobTitle}
            </AppText>
            <AppText variant={Variant.caption} style={styles.rowMeta}>
              {item.recruiterName} · {formatShortDate(item.dateISO)}
            </AppText>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: tone.bg, borderColor: tone.border }]}>
            <AppText variant={Variant.caption} style={[styles.statusText, { color: tone.fg }]}>
              {item.status}
            </AppText>
          </View>
        </View>

        <View style={styles.rowFooter}>
          <View style={styles.rowAmountsLeft}>
            <AppText variant={Variant.caption} style={styles.amountMeta}>
              Gross {formatCurrency(item.gross)} · Fees {formatCurrency(item.fee)}
            </AppText>
          </View>
          <AppText variant={Variant.bodyMedium} style={styles.netAmount}>
            {formatCurrency(item.net)}
          </AppText>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Earning Reports"
        showTopIcons={true}
        showBackButton={false}
        onMenuPress={() => navigation.openDrawer()}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onSearchPress={() => navigation.navigate('Search')}
        gradientColors={['#10B981', '#3B82F6']}
        children={
          <View style={styles.headerSub}>
            <AppText variant={Variant.bodySmall} style={styles.headerSubText}>
              Track your earnings across jobs, fees, and payouts.
            </AppText>
          </View>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <AppText variant={Variant.title} style={styles.sectionTitle}>
              Period
            </AppText>
            <TouchableOpacity
              style={styles.customRangeButton}
              activeOpacity={0.75}
              onPress={() => {
                setDatePreset('custom')
                setCustomModalVisible(true)
              }}
            >
              <VectorIcons name={iconLibName.Ionicons} iconName="calendar-outline" size={18} color={colors.primary} />
              <AppText variant={Variant.bodySmall} style={styles.customRangeText}>
                {formatShortDate(activeRange.from.toISOString())} - {formatShortDate(activeRange.to.toISOString())}
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.pillRow}>
            {DATE_PRESETS.map((p) =>
              renderPill({
                label: p.label,
                active: datePreset === p.key,
                onPress: () => setPreset(p.key),
              }),
            )}
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant={Variant.title} style={styles.sectionTitle}>
            Summary
          </AppText>
          <View style={styles.summaryGrid}>
            {renderSummaryCard({
              title: 'Gross earned',
              value: formatCurrency(totals.gross),
              icon: 'trending-up-outline',
              tone: 'info',
            })}
            {renderSummaryCard({
              title: 'Fees',
              value: formatCurrency(totals.fee),
              icon: 'pricetag-outline',
              tone: 'warning',
            })}
            {renderSummaryCard({
              title: 'Net earned',
              value: formatCurrency(totals.net),
              icon: 'cash-outline',
              tone: 'success',
            })}
            {renderSummaryCard({
              title: 'Pending / on-hold',
              value: formatCurrency(totals.pendingOrHeld),
              icon: 'time-outline',
              tone: 'primary',
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.filtersHeader}>
            <AppText variant={Variant.title} style={styles.sectionTitle}>
              Jobs
            </AppText>
            <View style={styles.exportButtons}>
              <TouchableOpacity style={styles.exportButton} activeOpacity={0.75} onPress={exportToPDF}>
                <VectorIcons name={iconLibName.Ionicons} iconName="document-text-outline" size={18} color={colors.secondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportButton} activeOpacity={0.75} onPress={exportToCSV}>
                <VectorIcons name={iconLibName.Ionicons} iconName="download-outline" size={18} color={colors.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.pillRow}>
            {STATUS_FILTERS.map((s) =>
              renderPill({
                label: s,
                active: statusFilter === s,
                onPress: () => setStatusFilter(s),
              }),
            )}
          </View>

          <View style={styles.pillRow}>
            {SORT_OPTIONS.map((s) =>
              renderPill({
                label: s.label,
                active: sortKey === s.key,
                onPress: () => setSortKey(s.key),
              }),
            )}
          </View>
        </View>

        <View style={[styles.section, { paddingBottom: hp(3) }]}>
          <FlatList
            data={filteredAndSorted}
            keyExtractor={(item) => item.id}
            renderItem={renderRow}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <AppText variant={Variant.title} style={styles.emptyTitle}>
                  No earnings found
                </AppText>
                <AppText variant={Variant.bodySmall} style={styles.emptySub}>
                  Try changing the period or status filter.
                </AppText>
              </View>
            }
          />
        </View>
      </ScrollView>

      <Modal visible={customModalVisible} transparent animationType="fade" onRequestClose={() => setCustomModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <AppText variant={Variant.title} style={styles.modalTitle}>
                Custom Range
              </AppText>
              <TouchableOpacity onPress={() => setCustomModalVisible(false)} style={styles.modalClose}>
                <VectorIcons name={iconLibName.Ionicons} iconName="close" size={22} color={colors.secondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <TouchableOpacity
                style={styles.dateField}
                activeOpacity={0.75}
                onPress={() => {
                  setShowFromPicker(true)
                  setShowToPicker(false)
                }}
              >
                <AppText variant={Variant.caption} style={styles.dateFieldLabel}>
                  From
                </AppText>
                <AppText variant={Variant.bodyMedium} style={styles.dateFieldValue}>
                  {formatShortDate(customFrom.toISOString())}
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateField}
                activeOpacity={0.75}
                onPress={() => {
                  setShowToPicker(true)
                  setShowFromPicker(false)
                }}
              >
                <AppText variant={Variant.caption} style={styles.dateFieldLabel}>
                  To
                </AppText>
                <AppText variant={Variant.bodyMedium} style={styles.dateFieldValue}>
                  {formatShortDate(customTo.toISOString())}
                </AppText>
              </TouchableOpacity>

              {(showFromPicker || showToPicker) && (
                <View style={styles.pickerWrap}>
                  <DateTimePicker
                    value={showFromPicker ? customFrom : customTo}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={(_, selected) => {
                      if (!selected) {
                        setShowFromPicker(false)
                        setShowToPicker(false)
                        return
                      }
                      if (showFromPicker) {
                        const nextFrom = startOfDay(selected)
                        setCustomFrom(nextFrom)
                        if (nextFrom > customTo) setCustomTo(endOfDay(selected))
                      } else {
                        const nextTo = endOfDay(selected)
                        setCustomTo(nextTo)
                        if (nextTo < customFrom) setCustomFrom(startOfDay(selected))
                      }
                      if (Platform.OS !== 'ios') {
                        setShowFromPicker(false)
                        setShowToPicker(false)
                      }
                    }}
                  />
                </View>
              )}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalAction, styles.modalSecondary]}
                activeOpacity={0.8}
                onPress={() => {
                  const { from, to } = buildPresetRange('month')
                  setCustomFrom(from)
                  setCustomTo(to)
                }}
              >
                <AppText variant={Variant.bodyMedium} style={styles.modalSecondaryText}>
                  Reset
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalAction, styles.modalPrimary]}
                activeOpacity={0.8}
                onPress={() => {
                  setDatePreset('custom')
                  setCustomModalVisible(false)
                }}
              >
                <AppText variant={Variant.bodyMedium} style={styles.modalPrimaryText}>
                  Apply
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default JobSeekerEarningReports

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white || '#FFFFFF' },
  content: { flex: 1 },
  headerSub: { paddingHorizontal: wp(4), paddingTop: hp(0.8), paddingBottom: hp(1.2) },
  headerSubText: { color: '#FFFFFF', opacity: 0.92 },
  section: { paddingHorizontal: wp(4), paddingTop: hp(2) },
  sectionTitle: { color: colors.secondary, fontSize: getFontSize(18), fontWeight: '700' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: wp(2) },
  customRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: hp(2),
    backgroundColor: colors.grayE8 || '#F3F4F6',
  },
  customRangeText: { color: colors.secondary },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: hp(1.2), gap: wp(2) },
  pill: { paddingHorizontal: wp(3.2), paddingVertical: hp(0.9), borderRadius: hp(2), borderWidth: 1 },
  pillActive: { backgroundColor: colors.primary || '#7C3AED', borderColor: colors.primary || '#7C3AED' },
  pillInactive: { backgroundColor: colors.white, borderColor: colors.grayE8 || '#E5E7EB' },
  pillText: { fontSize: getFontSize(12) },
  pillTextActive: { color: '#FFFFFF', fontWeight: '600' },
  pillTextInactive: { color: colors.secondary, fontWeight: '500' },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: hp(1.5), gap: wp(3) },
  summaryCard: { width: '48%', borderRadius: hp(2), padding: wp(4) },
  summaryTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTitle: { color: colors.gray || '#6B7280' },
  summaryIconWrap: { width: wp(9), height: wp(9), borderRadius: wp(4.5), justifyContent: 'center', alignItems: 'center' },
  summaryValue: { marginTop: hp(1), fontSize: getFontSize(18), fontWeight: '800' },
  filtersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exportButtons: { flexDirection: 'row', gap: wp(2) },
  exportButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(2.5),
    backgroundColor: colors.grayE8 || '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowCard: {
    backgroundColor: colors.white,
    borderRadius: hp(2),
    padding: wp(4),
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    marginBottom: hp(1.5),
  },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: wp(2) },
  rowTitleCol: { flex: 1 },
  rowJobTitle: { color: colors.secondary, fontSize: getFontSize(14), fontWeight: '700' },
  rowMeta: { color: colors.gray || '#6B7280', marginTop: hp(0.4) },
  statusBadge: { paddingHorizontal: wp(2.8), paddingVertical: hp(0.6), borderRadius: hp(2), borderWidth: 1 },
  statusText: { fontWeight: '700' },
  rowFooter: { marginTop: hp(1.2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  rowAmountsLeft: { flex: 1, marginRight: wp(2) },
  amountMeta: { color: colors.gray || '#6B7280' },
  netAmount: { color: colors.secondary, fontWeight: '800' },
  emptyState: { paddingVertical: hp(4), paddingHorizontal: wp(2), alignItems: 'center' },
  emptyTitle: { color: colors.secondary, fontWeight: '800' },
  emptySub: { marginTop: hp(1), color: colors.gray || '#6B7280', textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', paddingHorizontal: wp(5) },
  modalCard: { backgroundColor: colors.white || '#FFFFFF', borderRadius: hp(2.2), overflow: 'hidden' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.6),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#E5E7EB',
  },
  modalTitle: { color: colors.secondary, fontWeight: '800' },
  modalClose: { padding: wp(1) },
  modalBody: { padding: wp(4), gap: hp(1.2) },
  dateField: {
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    borderRadius: hp(1.6),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    backgroundColor: colors.white,
  },
  dateFieldLabel: { color: colors.gray || '#6B7280' },
  dateFieldValue: { color: colors.secondary, marginTop: hp(0.4), fontWeight: '700' },
  pickerWrap: { borderWidth: 1, borderColor: colors.grayE8 || '#E5E7EB', borderRadius: hp(1.6), overflow: 'hidden' },
  modalFooter: { flexDirection: 'row', gap: wp(3), padding: wp(4), borderTopWidth: 1, borderTopColor: colors.grayE8 || '#E5E7EB' },
  modalAction: { flex: 1, paddingVertical: hp(1.4), borderRadius: hp(1.8), alignItems: 'center', justifyContent: 'center' },
  modalPrimary: { backgroundColor: colors.primary || '#7C3AED' },
  modalPrimaryText: { color: '#FFFFFF', fontWeight: '800' },
  modalSecondary: { backgroundColor: colors.grayE8 || '#F3F4F6' },
  modalSecondaryText: { color: colors.secondary, fontWeight: '800' },
})

