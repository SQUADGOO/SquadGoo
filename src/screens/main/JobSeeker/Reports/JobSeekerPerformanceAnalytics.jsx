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

const isInRange = (dateISO, fromDate, toDate) => {
  if (!dateISO) return false
  const d = new Date(dateISO)
  if (Number.isNaN(d.getTime())) return false
  return d >= fromDate && d <= toDate
}

const clampPercent = (n) => Math.max(0, Math.min(100, Number(n || 0)))

const JobSeekerPerformanceAnalytics = ({ navigation }) => {
  const [datePreset, setDatePreset] = useState('month')

  const [customModalVisible, setCustomModalVisible] = useState(false)
  const [customFrom, setCustomFrom] = useState(startOfDay(new Date(new Date().setDate(new Date().getDate() - 30))))
  const [customTo, setCustomTo] = useState(endOfDay(new Date()))
  const [showFromPicker, setShowFromPicker] = useState(false)
  const [showToPicker, setShowToPicker] = useState(false)

  // Dummy performance events / summaries (v1)
  const dummyJobEvents = useMemo(
    () => [
      { id: 'pa-001', dateISO: '2026-01-10T19:00:00+11:00', status: 'Completed', onTime: true, rating: 4.8, hours: 8, net: 342, category: 'Cleaning', recruiter: 'BuildRight Pty Ltd' },
      { id: 'pa-002', dateISO: '2026-01-09T08:20:00+11:00', status: 'Active', onTime: true, rating: null, hours: 4, net: 171, category: 'Warehouse', recruiter: 'Northside Logistics' },
      { id: 'pa-003', dateISO: '2026-01-05T07:40:00+11:00', status: 'Disputed', onTime: true, rating: 3.4, hours: 12, net: 513, category: 'Construction', recruiter: 'PrimeCo Builders' },
      { id: 'pa-004', dateISO: '2026-01-03T16:10:00+11:00', status: 'Completed', onTime: false, rating: 4.2, hours: 6, net: 228, category: 'Events', recruiter: 'City Events AU' },
      { id: 'pa-005', dateISO: '2025-12-28T06:00:00+11:00', status: 'Cancelled', onTime: null, rating: null, hours: 0, net: 0, category: 'Hospitality', recruiter: 'Brew & Co.' },
      { id: 'pa-006', dateISO: '2025-12-22T09:30:00+11:00', status: 'Completed', onTime: true, rating: 4.6, hours: 10, net: 399, category: 'Warehouse', recruiter: 'Dockside Warehouse' },
      { id: 'pa-007', dateISO: '2025-12-12T18:30:00+11:00', status: 'Completed', onTime: true, rating: 4.1, hours: 7.5, net: 299.25, category: 'Hospitality', recruiter: 'Harbour Venue Group' },
      { id: 'pa-008', dateISO: '2025-12-06T23:20:00+11:00', status: 'Completed', onTime: true, rating: 4.9, hours: 5, net: 180.5, category: 'Events', recruiter: 'City Events AU' },
      { id: 'pa-009', dateISO: '2025-12-02T17:15:00+11:00', status: 'Cancelled', onTime: null, rating: null, hours: 0, net: 0, category: 'Hospitality', recruiter: 'GreenFork Kitchen' },
      { id: 'pa-010', dateISO: '2025-11-28T06:30:00+11:00', status: 'Completed', onTime: true, rating: 4.4, hours: 9, net: 384.75, category: 'Cleaning', recruiter: 'ClearView Services' },
    ],
    [],
  )

  const activeRange = useMemo(() => {
    if (datePreset === 'custom') return { from: customFrom, to: customTo }
    return buildPresetRange(datePreset)
  }, [customFrom, customTo, datePreset])

  const filtered = useMemo(() => {
    const { from, to } = activeRange
    return dummyJobEvents.filter((x) => isInRange(x.dateISO, from, to))
  }, [activeRange, dummyJobEvents])

  const kpis = useMemo(() => {
    const completed = filtered.filter((x) => x.status === 'Completed')
    const totalJobs = filtered.length
    const completedJobs = completed.length
    const completionRate = totalJobs ? (completedJobs / totalJobs) * 100 : 0

    const rated = completed.filter((x) => typeof x.rating === 'number')
    const avgRating = rated.length ? rated.reduce((s, x) => s + x.rating, 0) / rated.length : 0

    const attended = filtered.filter((x) => x.status !== 'Cancelled')
    const onTimeCount = attended.filter((x) => x.onTime === true).length
    const onTimeRate = attended.length ? (onTimeCount / attended.length) * 100 : 0

    const disputedCount = filtered.filter((x) => x.status === 'Disputed').length
    const disputeRate = totalJobs ? (disputedCount / totalJobs) * 100 : 0

    const hours = filtered.reduce((s, x) => s + Number(x.hours || 0), 0)
    const net = filtered.reduce((s, x) => s + Number(x.net || 0), 0)

    return {
      totalJobs,
      completedJobs,
      hours,
      net,
      avgRating,
      completionRate: clampPercent(completionRate),
      onTimeRate: clampPercent(onTimeRate),
      disputeRate: clampPercent(disputeRate),
    }
  }, [filtered])

  const byCategory = useMemo(() => {
    const map = new Map()
    filtered.forEach((x) => {
      const key = x.category || 'Other'
      const prev = map.get(key) || { category: key, jobs: 0, completed: 0, hours: 0, net: 0 }
      map.set(key, {
        ...prev,
        jobs: prev.jobs + 1,
        completed: prev.completed + (x.status === 'Completed' ? 1 : 0),
        hours: prev.hours + Number(x.hours || 0),
        net: prev.net + Number(x.net || 0),
      })
    })
    return Array.from(map.values()).sort((a, b) => b.jobs - a.jobs)
  }, [filtered])

  const insights = useMemo(() => {
    const bestRating = filtered
      .filter((x) => typeof x.rating === 'number')
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))[0]

    const mostHours = filtered.sort((a, b) => Number(b.hours || 0) - Number(a.hours || 0))[0]

    const notes = []
    if (kpis.disputeRate > 10) notes.push('Your dispute rate is higher than usual. Consider double-checking shift requirements before accepting.')
    if (kpis.onTimeRate < 85) notes.push('Try improving your on-time rate—being early boosts recruiter confidence.')
    if (kpis.completedJobs >= 5) notes.push('Great consistency—keep your completion streak going.')

    return {
      bestRating,
      mostHours,
      notes: notes.length ? notes : ['Keep building your history—more completed jobs improve your profile ranking.'],
    }
  }, [filtered, kpis.completedJobs, kpis.disputeRate, kpis.onTimeRate])

  const setPreset = (presetKey) => {
    setDatePreset(presetKey)
    if (presetKey === 'custom') setCustomModalVisible(true)
  }

  const exportToCSV = async () => {
    try {
      if (!filtered.length) {
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

      const headers = 'Date,Category,Recruiter,Status,OnTime,Rating,Hours,Net\n'
      const rows = filtered
        .map((r) =>
          [
            escapeCSV(formatShortDate(r.dateISO)),
            escapeCSV(r.category),
            escapeCSV(r.recruiter),
            escapeCSV(r.status),
            escapeCSV(r.onTime === null ? '' : r.onTime ? 'Yes' : 'No'),
            escapeCSV(typeof r.rating === 'number' ? r.rating.toFixed(1) : ''),
            escapeCSV(Number(r.hours || 0).toString()),
            escapeCSV(Number(r.net || 0).toFixed(2)),
          ].join(','),
        )
        .join('\n')

      const csvContent = headers + rows
      const fileName = `jobseeker_performance_${new Date().toISOString().split('T')[0]}.csv`

      const baseDir = Platform.OS === 'android' ? RNFS.CachesDirectoryPath : RNFS.DocumentDirectoryPath
      const path = `${baseDir}/${fileName}`

      const dirExists = await RNFS.exists(baseDir)
      if (!dirExists) await RNFS.mkdir(baseDir)

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
      if (!filtered.length) {
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

      page.drawText('Performance Analytics', { x: margin, y, size: 18, font: boldFont, color: rgb(0.2, 0.2, 0.2) })
      y -= 24

      page.drawText(
        `Period: ${formatShortDate(activeRange.from.toISOString())} - ${formatShortDate(activeRange.to.toISOString())}`,
        { x: margin, y, size: 10, font, color: rgb(0.45, 0.45, 0.45) },
      )
      y -= 18

      page.drawText(
        `Avg rating: ${kpis.avgRating ? kpis.avgRating.toFixed(2) : '—'}   On-time: ${kpis.onTimeRate.toFixed(0)}%   Completion: ${kpis.completionRate.toFixed(0)}%   Disputes: ${kpis.disputeRate.toFixed(0)}%`,
        { x: margin, y, size: 10, font: boldFont, color: rgb(0.1, 0.1, 0.1) },
      )
      y -= 22

      page.drawText('Date', { x: margin, y, size: fontSize, font: boldFont })
      page.drawText('Category', { x: margin + 70, y, size: fontSize, font: boldFont })
      page.drawText('Status', { x: width - margin - 150, y, size: fontSize, font: boldFont })
      page.drawText('Rating', { x: width - margin - 70, y, size: fontSize, font: boldFont })
      y -= 10

      page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) })
      y -= 12

      filtered
        .slice()
        .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime())
        .forEach((r) => {
          addNewPageIfNeeded()
          page.drawText(formatShortDate(r.dateISO), { x: margin, y, size: fontSize, font })
          page.drawText(String(r.category || '').slice(0, 20), { x: margin + 70, y, size: fontSize, font })
          page.drawText(String(r.status || ''), { x: width - margin - 150, y, size: fontSize, font })
          page.drawText(typeof r.rating === 'number' ? r.rating.toFixed(1) : '—', { x: width - margin - 70, y, size: fontSize, font })
          y -= lineHeight
        })

      const pdfBytes = await pdfDoc.save()
      const fileName = `jobseeker_performance_${new Date().toISOString().split('T')[0]}.pdf`
      const baseDir = Platform.OS === 'android' ? RNFS.CachesDirectoryPath : RNFS.DocumentDirectoryPath
      const path = `${baseDir}/${fileName}`

      const dirExists = await RNFS.exists(baseDir)
      if (!dirExists) await RNFS.mkdir(baseDir)

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

  const renderCategoryRow = ({ item }) => {
    const completion = item.jobs ? (item.completed / item.jobs) * 100 : 0
    return (
      <View style={styles.categoryRow}>
        <View style={{ flex: 1 }}>
          <AppText variant={Variant.bodyMedium} style={styles.categoryTitle}>
            {item.category}
          </AppText>
          <AppText variant={Variant.caption} style={styles.categoryMeta}>
            Jobs {item.jobs} · Completion {clampPercent(completion).toFixed(0)}% · Hours {item.hours.toFixed(1)}
          </AppText>
        </View>
        <AppText variant={Variant.bodyMedium} style={styles.categoryNet}>
          {`AUD ${item.net.toFixed(2)}`}
        </AppText>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Performance Analytics"
        showTopIcons={true}
        showBackButton={false}
        onMenuPress={() => navigation.openDrawer()}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onSearchPress={() => navigation.navigate('Search')}
        gradientColors={['#8B5CF6', '#06B6D4']}
        children={
          <View style={styles.headerSub}>
            <AppText variant={Variant.bodySmall} style={styles.headerSubText}>
              Track rating, attendance, completion, and disputes.
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
          <View style={styles.filtersHeader}>
            <AppText variant={Variant.title} style={styles.sectionTitle}>
              KPIs
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

          <View style={styles.summaryGrid}>
            {renderSummaryCard({
              title: 'Avg rating',
              value: kpis.avgRating ? kpis.avgRating.toFixed(2) : '—',
              icon: 'star-outline',
              tone: 'warning',
            })}
            {renderSummaryCard({
              title: 'On-time rate',
              value: `${kpis.onTimeRate.toFixed(0)}%`,
              icon: 'alarm-outline',
              tone: 'info',
            })}
            {renderSummaryCard({
              title: 'Completion rate',
              value: `${kpis.completionRate.toFixed(0)}%`,
              icon: 'checkmark-circle-outline',
              tone: 'success',
            })}
            {renderSummaryCard({
              title: 'Dispute rate',
              value: `${kpis.disputeRate.toFixed(0)}%`,
              icon: 'alert-circle-outline',
              tone: 'primary',
            })}
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant={Variant.title} style={styles.sectionTitle}>
            Totals
          </AppText>
          <View style={styles.totalsRow}>
            <View style={styles.totalChip}>
              <AppText variant={Variant.caption} style={styles.totalLabel}>
                Jobs
              </AppText>
              <AppText variant={Variant.bodyMedium} style={styles.totalValue}>
                {String(kpis.totalJobs)}
              </AppText>
            </View>
            <View style={styles.totalChip}>
              <AppText variant={Variant.caption} style={styles.totalLabel}>
                Hours
              </AppText>
              <AppText variant={Variant.bodyMedium} style={styles.totalValue}>
                {kpis.hours.toFixed(1)}
              </AppText>
            </View>
            <View style={styles.totalChip}>
              <AppText variant={Variant.caption} style={styles.totalLabel}>
                Net earned
              </AppText>
              <AppText variant={Variant.bodyMedium} style={styles.totalValue}>
                {`AUD ${kpis.net.toFixed(2)}`}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant={Variant.title} style={styles.sectionTitle}>
            Breakdown by category
          </AppText>
          <FlatList
            data={byCategory}
            keyExtractor={(item) => item.category}
            renderItem={renderCategoryRow}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <AppText variant={Variant.title} style={styles.emptyTitle}>
                  No data for this period
                </AppText>
                <AppText variant={Variant.bodySmall} style={styles.emptySub}>
                  Try selecting a wider date range.
                </AppText>
              </View>
            }
          />
        </View>

        <View style={[styles.section, { paddingBottom: hp(3) }]}>
          <AppText variant={Variant.title} style={styles.sectionTitle}>
            Insights
          </AppText>

          <View style={styles.insightCard}>
            <AppText variant={Variant.bodyMedium} style={styles.insightTitle}>
              Highlights
            </AppText>
            <AppText variant={Variant.caption} style={styles.insightText}>
              {insights.bestRating
                ? `Best rating: ${insights.bestRating.rating.toFixed(1)} (${insights.bestRating.category})`
                : 'Best rating: —'}
            </AppText>
            <AppText variant={Variant.caption} style={styles.insightText}>
              {insights.mostHours ? `Most hours: ${Number(insights.mostHours.hours || 0)}h (${insights.mostHours.category})` : 'Most hours: —'}
            </AppText>
          </View>

          {insights.notes.map((n, idx) => (
            <View key={`${idx}-${n}`} style={styles.tipCard}>
              <VectorIcons name={iconLibName.Ionicons} iconName="sparkles-outline" size={18} color={colors.primary} />
              <AppText variant={Variant.bodySmall} style={styles.tipText}>
                {n}
              </AppText>
            </View>
          ))}
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

export default JobSeekerPerformanceAnalytics

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
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: hp(1.5), gap: wp(3) },
  summaryCard: { width: '48%', borderRadius: hp(2), padding: wp(4) },
  summaryTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTitle: { color: colors.gray || '#6B7280' },
  summaryIconWrap: { width: wp(9), height: wp(9), borderRadius: wp(4.5), justifyContent: 'center', alignItems: 'center' },
  summaryValue: { marginTop: hp(1), fontSize: getFontSize(18), fontWeight: '800' },
  totalsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: wp(2), marginTop: hp(1.2) },
  totalChip: {
    backgroundColor: colors.grayE8 || '#F3F4F6',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: hp(2),
    minWidth: '30%',
  },
  totalLabel: { color: colors.gray || '#6B7280' },
  totalValue: { color: colors.secondary, fontWeight: '800', marginTop: hp(0.3) },
  categoryRow: {
    backgroundColor: colors.white,
    borderRadius: hp(2),
    padding: wp(4),
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    marginTop: hp(1.2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: wp(2),
  },
  categoryTitle: { color: colors.secondary, fontWeight: '800' },
  categoryMeta: { marginTop: hp(0.3), color: colors.gray || '#6B7280' },
  categoryNet: { color: colors.secondary, fontWeight: '900' },
  insightCard: {
    backgroundColor: colors.white,
    borderRadius: hp(2),
    padding: wp(4),
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    marginTop: hp(1.2),
  },
  insightTitle: { color: colors.secondary, fontWeight: '900' },
  insightText: { marginTop: hp(0.6), color: colors.gray || '#6B7280' },
  tipCard: {
    marginTop: hp(1.2),
    backgroundColor: colors.grayE8 || '#F3F4F6',
    borderRadius: hp(2),
    padding: wp(4),
    flexDirection: 'row',
    gap: wp(2.5),
    alignItems: 'flex-start',
  },
  tipText: { flex: 1, color: colors.secondary, lineHeight: 18 },
  emptyState: { paddingVertical: hp(3), paddingHorizontal: wp(2), alignItems: 'center' },
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

