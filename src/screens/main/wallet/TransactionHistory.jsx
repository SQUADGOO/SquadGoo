import React, { useState, useMemo } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    Alert,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '@/core/PoolHeader';
import RNFS from '@/utilities/rnfsCompat';
import Share from 'react-native-share';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import {
    transactionHistory as recruiterTransactionHistory,
    jobseekerTransactionHistory,
    TRANSACTION_CATEGORIES as RECRUITER_CATEGORIES,
    JOBSEEKER_TRANSACTION_CATEGORIES,
    DATE_FILTERS,
    STATUS_FILTERS,
} from './transactionData';
import { useSelector } from 'react-redux';

const PAGE_SIZE = 10;

const TransactionHistory = ({ navigation }) => {
    const role = useSelector((state) => state.auth?.role);
    const isJobseeker = role?.toLowerCase() === 'jobseeker';
    const transactionHistory = isJobseeker ? jobseekerTransactionHistory : recruiterTransactionHistory;
    const TRANSACTION_CATEGORIES = isJobseeker ? JOBSEEKER_TRANSACTION_CATEGORIES : RECRUITER_CATEGORIES;
    const [dateFilter, setDateFilter] = useState('Daily');
    const [categoryFilter, setCategoryFilter] = useState('All Transactions');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showStatusPicker, setShowStatusPicker] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [exporting, setExporting] = useState(false);

    // Filter transactions
    const filteredData = useMemo(() => {
        let data = [...transactionHistory];
        if (categoryFilter !== 'All Transactions') {
            data = data.filter(tx => tx.category === categoryFilter);
        }
        if (statusFilter !== 'All') {
            data = data.filter(tx => tx.status === statusFilter);
        }
        return data;
    }, [categoryFilter, statusFilter]);

    const visibleData = filteredData.slice(0, visibleCount);

    // Totals
    const totalCredits = filteredData
        .filter(tx => tx.type === 'Credit')
        .reduce((sum, tx) => sum + tx.amount, 0);
    const totalDebits = filteredData
        .filter(tx => tx.type === 'Debit')
        .reduce((sum, tx) => sum + tx.amount, 0);
    const netBalance = totalCredits - totalDebits;

    const handleLoadMore = () => {
        setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filteredData.length));
    };

    // ── CSV / Excel export ──
    const exportAsCSV = async () => {
        try {
            setExporting(true);
            setShowExportModal(false);

            const headers = ['Date', 'Transaction ID', 'Transaction Type', 'Category', 'Description', 'Job/Candidate', 'Type (Dr/Cr)', 'Amount (AUD)'];

            const escapeCSV = (val) => {
                const str = String(val ?? '');
                if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                    return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
            };

            let csv = headers.map(escapeCSV).join(',') + '\n';
            filteredData.forEach(tx => {
                csv += [
                    tx.date,
                    tx.txnId,
                    tx.name,
                    tx.categoryShort,
                    tx.description,
                    tx.jobCandidate,
                    tx.type,
                    `$${tx.amount.toFixed(2)}`,
                ].map(escapeCSV).join(',') + '\n';
            });

            // Summary section
            csv += '\n';
            csv += 'Summary,Amount (AUD)\n';
            csv += `Total Credits:,$${totalCredits.toFixed(2)}\n`;
            csv += `Total Debits:,$${totalDebits.toFixed(2)}\n`;
            csv += `Net Balance:,$${netBalance.toFixed(2)}\n`;

            const dir = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath;
            const filePath = `${dir}/SquadGoo_Transactions_${Date.now()}.csv`;

            await RNFS.writeFile(filePath, csv, 'utf8');

            await Share.open({
                url: Platform.OS === 'ios' ? filePath : `file://${filePath}`,
                type: 'text/csv',
                title: 'Transaction History',
                message: 'SQUADGOO Transaction History Export',
            });

            setExporting(false);
        } catch (error) {
            setExporting(false);
            if (error?.message !== 'User did not share') {
                Alert.alert('Export Failed', error?.message || 'Could not export CSV. Please try again.');
            }
        }
    };

    // ── PDF export ──
    const exportAsPDF = async () => {
        try {
            setExporting(true);
            setShowExportModal(false);

            const pdfDoc = await PDFDocument.create();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            const pageWidth = 595; // A4 portrait
            const pageHeight = 842;
            const margin = 35;
            const contentWidth = pageWidth - margin * 2;
            const now = new Date();
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const dd = String(now.getDate()).padStart(2, '0');
            const mm = months[now.getMonth()];
            const yyyy = now.getFullYear();
            const hh = String(now.getHours()).padStart(2, '0');
            const mi = String(now.getMinutes()).padStart(2, '0');
            const ss = String(now.getSeconds()).padStart(2, '0');
            const dateStr = `${dd} ${mm} ${yyyy}`;
            const timeStr = `${hh}:${mi}:${ss}`;

            // Sanitize text to only WinAnsi-safe characters (strip non-ASCII)
            const sanitize = (str) => String(str ?? '').replace(/[^\x20-\x7E]/g, ' ');

            // Colors
            const brandBlue = rgb(0.22, 0.35, 0.85);
            const darkBlue = rgb(0.15, 0.25, 0.65);
            const white = rgb(1, 1, 1);
            const black = rgb(0, 0, 0);
            const darkGray = rgb(0.25, 0.25, 0.25);
            const medGray = rgb(0.45, 0.45, 0.45);
            const lightGray = rgb(0.96, 0.96, 0.96);
            const borderGray = rgb(0.88, 0.88, 0.88);
            const creditGreen = rgb(0.08, 0.64, 0.26);
            const debitOrange = rgb(0.94, 0.45, 0.15);
            const balanceBlue = rgb(0.22, 0.35, 0.85);
            const statusGreenBg = rgb(0.88, 0.97, 0.88);
            const statusOrangeBg = rgb(1.0, 0.94, 0.85);
            const statusRedBg = rgb(1.0, 0.9, 0.9);

            let page = pdfDoc.addPage([pageWidth, pageHeight]);
            let y = pageHeight;

            // ══════════════════════════════════════
            // 1. HEADER BANNER (blue)
            // ══════════════════════════════════════
            const bannerH = 55;
            page.drawRectangle({ x: 0, y: y - bannerH, width: pageWidth, height: bannerH, color: brandBlue });

            // SG circle logo
            page.drawCircle({ x: margin + 16, y: y - bannerH / 2, size: 14, color: white });
            page.drawText('SG', { x: margin + 9, y: y - bannerH / 2 - 4, size: 9, font: fontBold, color: brandBlue });

            // Title text
            page.drawText('SquadGoo', { x: margin + 38, y: y - 22, size: 18, font: fontBold, color: white });
            page.drawText('Transaction History Report', { x: margin + 38, y: y - 38, size: 9, font, color: rgb(0.8, 0.85, 1) });

            y -= bannerH + 15;

            // ══════════════════════════════════════
            // 2. REPORT INFO BOX
            // ══════════════════════════════════════
            const infoBoxH = 52;
            page.drawRectangle({ x: margin, y: y - infoBoxH, width: contentWidth, height: infoBoxH, color: lightGray, borderColor: borderGray, borderWidth: 0.5 });

            const col1X = margin + 10;
            const col2X = margin + contentWidth / 2 + 10;
            page.drawText('Report Generated:', { x: col1X, y: y - 14, size: 7, font, color: medGray });
            page.drawText(`${dateStr}, ${timeStr}`, { x: col1X, y: y - 25, size: 8, font: fontBold, color: darkGray });
            page.drawText('Report Period:', { x: col1X, y: y - 36, size: 7, font, color: medGray });
            page.drawText('01 Jan 2024 - 08 Feb 2024', { x: col1X, y: y - 47, size: 8, font: fontBold, color: darkGray });

            page.drawText('Generated By:', { x: col2X, y: y - 14, size: 7, font, color: medGray });
            page.drawText('John Recruiter', { x: col2X, y: y - 25, size: 8, font: fontBold, color: darkGray });
            page.drawText('Company:', { x: col2X, y: y - 36, size: 7, font, color: medGray });
            page.drawText('SquadGoo Pty Ltd', { x: col2X, y: y - 47, size: 8, font: fontBold, color: darkGray });

            y -= infoBoxH + 20;

            // ══════════════════════════════════════
            // 3. FINANCIAL SUMMARY
            // ══════════════════════════════════════
            page.drawText('Financial Summary (AUD)', { x: margin, y: y, size: 13, font: fontBold, color: darkGray });
            y -= 20;

            const cardW = (contentWidth - 16) / 3;
            const cardH = 42;
            const summaryCards = [
                { label: 'Total Credits', value: `$${totalCredits.toFixed(2)}`, color: creditGreen, borderC: rgb(0.08, 0.64, 0.26) },
                { label: 'Total Debits', value: `$${totalDebits.toFixed(2)}`, color: debitOrange, borderC: rgb(0.94, 0.45, 0.15) },
                { label: 'Net Balance', value: `$${netBalance.toFixed(2)}`, color: balanceBlue, borderC: rgb(0.22, 0.35, 0.85) },
            ];

            summaryCards.forEach((card, i) => {
                const cardX = margin + i * (cardW + 8);
                // Card border
                page.drawRectangle({ x: cardX, y: y - cardH, width: cardW, height: cardH, borderColor: card.borderC, borderWidth: 1, color: white });
                // Label
                page.drawText(card.label, { x: cardX + 10, y: y - 15, size: 8, font, color: medGray });
                // Value
                page.drawText(card.value, { x: cardX + 10, y: y - 33, size: 14, font: fontBold, color: card.color });
            });

            y -= cardH + 25;

            // ══════════════════════════════════════
            // 4. TRANSACTION DETAILS TABLE
            // ══════════════════════════════════════
            page.drawText('Transaction Details', { x: margin, y: y, size: 13, font: fontBold, color: darkGray });
            y -= 18;

            const colWidths = [58, 82, 155, 45, 64, 60];
            const headers = ['Date', 'Transaction ID', 'Description', 'Type', 'Amount (AUD)', 'Status'];
            const rowH = 22;
            const tableW = colWidths.reduce((a, b) => a + b, 0);

            // Helper: draw table header
            const drawTableHeader = (pg, yy) => {
                pg.drawRectangle({ x: margin, y: yy - rowH, width: tableW, height: rowH, color: darkBlue });
                let xPos = margin + 5;
                headers.forEach((h, i) => {
                    pg.drawText(h, { x: xPos, y: yy - rowH + 8, size: 7, font: fontBold, color: white });
                    xPos += colWidths[i];
                });
                return yy - rowH;
            };

            y = drawTableHeader(page, y);

            // Helper: get status colors
            const getStatusColors = (status) => {
                if (status === 'Completed') return { bg: statusGreenBg, text: creditGreen };
                if (status === 'Pending') return { bg: statusOrangeBg, text: debitOrange };
                return { bg: statusRedBg, text: rgb(0.85, 0.2, 0.2) };
            };

            // Draw data rows
            filteredData.forEach((tx, idx) => {
                // Check if we need a new page
                if (y < margin + 80) {
                    page = pdfDoc.addPage([pageWidth, pageHeight]);
                    y = pageHeight - margin;
                    y = drawTableHeader(page, y);
                }

                // Alternating row bg
                if (idx % 2 === 0) {
                    page.drawRectangle({ x: margin, y: y - rowH, width: tableW, height: rowH, color: lightGray });
                }

                // Row bottom border
                page.drawLine({
                    start: { x: margin, y: y - rowH },
                    end: { x: margin + tableW, y: y - rowH },
                    thickness: 0.3,
                    color: borderGray,
                });

                const isCredit = tx.type === 'Credit';
                const typeColor = isCredit ? creditGreen : debitOrange;
                const sc = getStatusColors(tx.status);

                let xPos = margin + 5;

                // Date
                page.drawText(sanitize(tx.date), { x: xPos, y: y - rowH + 8, size: 7, font, color: medGray });
                xPos += colWidths[0];

                // Transaction ID
                page.drawText(sanitize(tx.txnId), { x: xPos, y: y - rowH + 8, size: 7, font, color: darkGray });
                xPos += colWidths[1];

                // Description (truncated)
                const desc = sanitize(tx.name).substring(0, 32);
                page.drawText(desc, { x: xPos, y: y - rowH + 8, size: 7, font, color: darkGray });
                xPos += colWidths[2];

                // Type (color-coded)
                page.drawText(sanitize(tx.type), { x: xPos + 5, y: y - rowH + 8, size: 7, font: fontBold, color: typeColor });
                xPos += colWidths[3];

                // Amount
                page.drawText(`$${tx.amount.toFixed(2)}`, { x: xPos, y: y - rowH + 8, size: 7, font: fontBold, color: darkGray });
                xPos += colWidths[4];

                // Status badge
                const statusText = sanitize(tx.status);
                const badgeW = fontBold.widthOfTextAtSize(statusText, 6) + 12;
                const badgeH = 12;
                const badgeY = y - rowH + 5;
                page.drawRectangle({ x: xPos, y: badgeY, width: badgeW, height: badgeH, color: sc.bg, borderColor: sc.text, borderWidth: 0.5 });
                page.drawText(statusText, { x: xPos + 6, y: badgeY + 3, size: 6, font: fontBold, color: sc.text });

                y -= rowH;
            });

            // ══════════════════════════════════════
            // 5. NOTES FOOTER
            // ══════════════════════════════════════
            y -= 25;
            if (y < margin + 80) {
                page = pdfDoc.addPage([pageWidth, pageHeight]);
                y = pageHeight - margin;
            }

            page.drawText('Notes:', { x: margin, y: y, size: 9, font: fontBold, color: darkGray });
            y -= 14;
            const notes = [
                '• All amounts are in Australian Dollars (AUD).',
                '• This report contains sensitive financial information. Please keep it confidential.',
                '• For any discrepancies, please contact SquadGoo support within 7 days.',
                '• Support: support@squadgoo.com.au',
            ];
            notes.forEach(note => {
                page.drawText(note, { x: margin, y: y, size: 7, font, color: note.includes('Support:') ? brandBlue : medGray });
                y -= 12;
            });

            // Save and share
            const pdfBytes = await pdfDoc.saveAsBase64();
            const dir = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath;
            const filePath = `${dir}/SquadGoo_Transactions_${Date.now()}.pdf`;
            await RNFS.writeFile(filePath, pdfBytes, 'base64');

            await Share.open({
                url: Platform.OS === 'ios' ? filePath : `file://${filePath}`,
                type: 'application/pdf',
                title: 'Transaction History',
                message: 'SQUADGOO Transaction History Export',
            });

            setExporting(false);
        } catch (error) {
            setExporting(false);
            if (error?.message !== 'User did not share') {
                Alert.alert('Export Failed', error?.message || 'Could not export PDF. Please try again.');
            }
        }
    };

    const handleExport = (format) => {
        if (format === 'csv') {
            exportAsCSV();
        } else {
            exportAsPDF();
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed':
                return { bg: '#16A34A18', color: '#16A34A', border: '#16A34A40' };
            case 'Pending':
                return { bg: '#F59E0B18', color: '#F59E0B', border: '#F59E0B40' };
            case 'Cancelled':
                return { bg: '#EF444418', color: '#EF4444', border: '#EF444440' };
            default:
                return { bg: '#6B728018', color: '#6B7280', border: '#6B728040' };
        }
    };

    // Dropdown picker modal
    const renderPickerModal = (visible, setVisible, options, selected, onSelect, title) => (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableOpacity
                style={styles.modalBackdrop}
                activeOpacity={1}
                onPress={() => setVisible(false)}
            >
                <View style={styles.pickerModal}>
                    <View style={styles.pickerHeader}>
                        <AppText variant={Variant.bodyMedium} style={styles.pickerTitle}>{title}</AppText>
                        <TouchableOpacity onPress={() => setVisible(false)}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="close" size={22} color="#333" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {options.map((opt, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.pickerItem, selected === opt && styles.pickerItemActive]}
                                onPress={() => { onSelect(opt); setVisible(false); setVisibleCount(PAGE_SIZE); }}
                                activeOpacity={0.7}
                            >
                                <AppText variant={Variant.body} style={[styles.pickerItemText, selected === opt && styles.pickerItemTextActive]}>
                                    {opt}
                                </AppText>
                                {selected === opt && (
                                    <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle" size={18} color={colors.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
    );

    // Transaction row
    const renderTransaction = (tx) => {
        const ss = getStatusStyle(tx.status);
        const isCredit = tx.type === 'Credit';
        return (
            <View key={tx.id} style={styles.txRow}>
                <View style={styles.txDateCol}>
                    <AppText variant={Variant.caption} style={styles.txDate}>{tx.date}</AppText>
                </View>
                <View style={styles.txNameCol}>
                    <AppText variant={Variant.caption} style={styles.txName} numberOfLines={2}>{tx.name}</AppText>
                </View>
                <View style={styles.txTypeCol}>
                    <VectorIcons
                        name={iconLibName.Ionicons}
                        iconName={isCredit ? 'arrow-up' : 'arrow-down'}
                        size={10}
                        color={isCredit ? '#16A34A' : '#EF4444'}
                    />
                    <AppText variant={Variant.caption} style={[styles.txType, { color: isCredit ? '#16A34A' : '#EF4444' }]}>
                        {tx.type}
                    </AppText>
                </View>
                <View style={styles.txAmountCol}>
                    <AppText variant={Variant.caption} style={styles.txAmount}>${tx.amount.toFixed(2)}</AppText>
                </View>
                <View style={styles.txStatusCol}>
                    <View style={[styles.txStatusBadge, { backgroundColor: ss.bg, borderColor: ss.border }]}>
                        <AppText variant={Variant.caption} style={[styles.txStatusText, { color: ss.color }]}>{tx.status}</AppText>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.screen}>
            <PoolHeader
                title="Transaction History"
                rightComponent={
                    <TouchableOpacity onPress={() => setShowExportModal(true)} activeOpacity={0.7}>
                        <AppText variant={Variant.bodyMedium} style={styles.exportHeaderBtn}>Export</AppText>
                    </TouchableOpacity>
                }
            />

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Filters */}
                <AppText variant={Variant.bodyMedium} style={styles.filtersTitle}>Filters</AppText>
                <View style={styles.filtersRow}>
                    {/* Date filter */}
                    <TouchableOpacity style={styles.filterBtn} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="calendar-outline" size={14} color="#666" />
                        <AppText variant={Variant.caption} style={styles.filterBtnText}>{dateFilter}</AppText>
                        <VectorIcons name={iconLibName.Ionicons} iconName="chevron-down" size={12} color="#999" />
                    </TouchableOpacity>

                    {/* Category filter */}
                    <TouchableOpacity style={[styles.filterBtn, styles.filterBtnWide]} onPress={() => setShowCategoryPicker(true)} activeOpacity={0.7}>
                        <AppText variant={Variant.caption} style={styles.filterBtnText} numberOfLines={1}>{categoryFilter}</AppText>
                        <VectorIcons name={iconLibName.Ionicons} iconName="chevron-down" size={12} color="#999" />
                    </TouchableOpacity>

                    {/* Status filter */}
                    <TouchableOpacity style={styles.filterBtn} onPress={() => setShowStatusPicker(true)} activeOpacity={0.7}>
                        <AppText variant={Variant.caption} style={styles.filterBtnText}>{statusFilter === 'All' ? 'Status' : statusFilter}</AppText>
                        <VectorIcons name={iconLibName.Ionicons} iconName="chevron-down" size={12} color="#999" />
                    </TouchableOpacity>
                </View>

                {/* Totals summary */}
                <View style={styles.totalsRow}>
                    <View style={styles.totalItem}>
                        <AppText variant={Variant.caption} style={styles.totalLabel}>Total Credits</AppText>
                        <AppText variant={Variant.bodyMedium} style={[styles.totalValue, { color: '#16A34A' }]}>${totalCredits.toFixed(2)}</AppText>
                    </View>
                    <View style={[styles.totalItem, styles.totalItemCenter]}>
                        <AppText variant={Variant.caption} style={styles.totalLabel}>Total Debits</AppText>
                        <AppText variant={Variant.bodyMedium} style={[styles.totalValue, { color: '#EF4444' }]}>${totalDebits.toFixed(2)}</AppText>
                    </View>
                    <View style={styles.totalItem}>
                        <AppText variant={Variant.caption} style={styles.totalLabel}>Net Balance</AppText>
                        <AppText variant={Variant.bodyMedium} style={[styles.totalValue, { color: '#111' }]}>${netBalance.toFixed(2)}</AppText>
                    </View>
                </View>

                {/* Table header */}
                <View style={styles.tableHeader}>
                    <AppText variant={Variant.caption} style={[styles.thText, styles.txDateCol]}>Date</AppText>
                    <AppText variant={Variant.caption} style={[styles.thText, styles.txNameCol]}>Transaction</AppText>
                    <AppText variant={Variant.caption} style={[styles.thText, styles.txTypeCol]}>Type</AppText>
                    <AppText variant={Variant.caption} style={[styles.thText, styles.txAmountCol]}>Amount</AppText>
                    <AppText variant={Variant.caption} style={[styles.thText, styles.txStatusCol]}>Status</AppText>
                </View>

                {/* Transaction rows */}
                {visibleData.length === 0 ? (
                    <View style={styles.emptyState}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="document-text-outline" size={48} color="#CCC" />
                        <AppText variant={Variant.body} style={styles.emptyText}>No transactions found.</AppText>
                    </View>
                ) : (
                    visibleData.map(renderTransaction)
                )}

                {/* Load more */}
                {visibleCount < filteredData.length && (
                    <TouchableOpacity style={styles.loadMoreBtn} onPress={handleLoadMore} activeOpacity={0.7}>
                        <AppText variant={Variant.bodyMedium} style={styles.loadMoreText}>Load More</AppText>
                        <VectorIcons name={iconLibName.Ionicons} iconName="arrow-down" size={14} color="#333" />
                    </TouchableOpacity>
                )}

                {/* Showing count */}
                <AppText variant={Variant.caption} style={styles.showingText}>
                    Showing {Math.min(visibleCount, filteredData.length)} of {filteredData.length} transactions
                </AppText>

                <View style={{ height: hp(4) }} />
            </ScrollView>

            {/* Picker modals */}
            {renderPickerModal(showDatePicker, setShowDatePicker, DATE_FILTERS, dateFilter, setDateFilter, 'Select Date Range')}
            {renderPickerModal(showCategoryPicker, setShowCategoryPicker, TRANSACTION_CATEGORIES, categoryFilter, setCategoryFilter, 'Select Transaction Type')}
            {renderPickerModal(showStatusPicker, setShowStatusPicker, STATUS_FILTERS, statusFilter, setStatusFilter, 'Select Status')}

            {/* Export modal */}
            <Modal visible={showExportModal} transparent animationType="fade">
                <TouchableOpacity
                    style={[styles.modalBackdrop, { justifyContent: 'center' }]}
                    activeOpacity={1}
                    onPress={() => setShowExportModal(false)}
                >
                    <View style={styles.exportCard}>
                        <AppText variant={Variant.h6} style={styles.exportTitle}>Export Transactions</AppText>
                        <AppText variant={Variant.caption} style={styles.exportSub}>
                            Download your transaction history
                        </AppText>

                        <TouchableOpacity
                            style={styles.exportOption}
                            onPress={() => handleExport('csv')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.exportIconCircle, { backgroundColor: '#16A34A18' }]}>
                                <VectorIcons name={iconLibName.Ionicons} iconName="document-outline" size={20} color="#16A34A" />
                            </View>
                            <View style={styles.exportOptionInfo}>
                                <AppText variant={Variant.bodyMedium} style={styles.exportOptionTitle}>Excel (.xlsx)</AppText>
                                <AppText variant={Variant.caption} style={styles.exportOptionSub}>Spreadsheet format, ideal for analysis</AppText>
                            </View>
                            <VectorIcons name={iconLibName.Ionicons} iconName="download-outline" size={18} color="#999" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.exportOption}
                            onPress={() => handleExport('pdf')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.exportIconCircle, { backgroundColor: '#EF444418' }]}>
                                <VectorIcons name={iconLibName.Ionicons} iconName="document-text-outline" size={20} color="#EF4444" />
                            </View>
                            <View style={styles.exportOptionInfo}>
                                <AppText variant={Variant.bodyMedium} style={styles.exportOptionTitle}>PDF (.pdf)</AppText>
                                <AppText variant={Variant.caption} style={styles.exportOptionSub}>Printable report format</AppText>
                            </View>
                            <VectorIcons name={iconLibName.Ionicons} iconName="download-outline" size={18} color="#999" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.exportCancelBtn}
                            onPress={() => setShowExportModal(false)}
                            activeOpacity={0.7}
                        >
                            <AppText variant={Variant.bodyMedium} style={styles.exportCancelText}>Cancel</AppText>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Loading overlay */}
            {exporting && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingCard}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <AppText variant={Variant.bodyMedium} style={styles.loadingText}>Generating export...</AppText>
                    </View>
                </View>
            )}
        </View>
    );
};

export default TransactionHistory;

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F4F2F9' },
    scroll: { flex: 1 },
    scrollContent: { padding: wp(4) },
    exportHeaderBtn: { color: colors.white, fontWeight: '700', fontSize: getFontSize(13) },
    // Filters
    filtersTitle: { color: '#111', fontWeight: '800', fontSize: getFontSize(16), marginBottom: hp(1) },
    filtersRow: { flexDirection: 'row', gap: wp(2), marginBottom: hp(1.5) },
    filterBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: wp(1), backgroundColor: colors.white, borderWidth: 1, borderColor: '#E8E8EF',
        borderRadius: 10, paddingVertical: hp(1), paddingHorizontal: wp(2),
    },
    filterBtnWide: { flex: 1.6 },
    filterBtnText: { color: '#333', fontWeight: '600', fontSize: getFontSize(11) },
    // Totals
    totalsRow: {
        flexDirection: 'row', backgroundColor: colors.white, borderRadius: 12,
        padding: wp(3), marginBottom: hp(1.5),
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
    },
    totalItem: { flex: 1 },
    totalItemCenter: {
        borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#F3F3F3',
        paddingHorizontal: wp(2),
    },
    totalLabel: { color: '#999', fontSize: getFontSize(10), marginBottom: hp(0.2) },
    totalValue: { fontWeight: '800', fontSize: getFontSize(14) },
    // Table
    tableHeader: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F9F9FB', borderRadius: 8, paddingVertical: hp(0.8),
        paddingHorizontal: wp(2), marginBottom: hp(0.5),
    },
    thText: { color: '#999', fontWeight: '700', fontSize: getFontSize(10), textTransform: 'uppercase' },
    txRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: hp(1.2), paddingHorizontal: wp(2),
        borderBottomWidth: 0.5, borderBottomColor: '#F3F3F3',
    },
    txDateCol: { width: wp(18) },
    txNameCol: { flex: 1, paddingRight: wp(1) },
    txTypeCol: { width: wp(14), flexDirection: 'row', alignItems: 'center', gap: wp(0.5) },
    txAmountCol: { width: wp(15) },
    txStatusCol: { width: wp(20), alignItems: 'flex-end' },
    txDate: { color: '#666', fontSize: getFontSize(10) },
    txName: { color: '#333', fontSize: getFontSize(10), fontWeight: '500' },
    txType: { fontSize: getFontSize(10), fontWeight: '600' },
    txAmount: { color: '#111', fontSize: getFontSize(11), fontWeight: '600' },
    txStatusBadge: {
        borderRadius: 6, paddingHorizontal: wp(2), paddingVertical: hp(0.2),
        borderWidth: 1,
    },
    txStatusText: { fontSize: getFontSize(9), fontWeight: '700' },
    // Load more
    loadMoreBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: wp(1.5),
        paddingVertical: hp(1.2), marginTop: hp(1),
        backgroundColor: colors.white, borderRadius: 10,
        borderWidth: 1, borderColor: '#E8E8EF',
    },
    loadMoreText: { color: '#333', fontWeight: '700', fontSize: getFontSize(13) },
    showingText: { color: '#BBB', fontSize: getFontSize(11), textAlign: 'center', marginTop: hp(1) },
    // Empty
    emptyState: { alignItems: 'center', paddingVertical: hp(6) },
    emptyText: { color: '#999', fontSize: getFontSize(14), marginTop: hp(1) },
    // Picker modal
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    pickerModal: {
        backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20,
        maxHeight: '60%', paddingBottom: hp(5),
    },
    pickerHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: wp(5), paddingVertical: hp(1.5),
        borderBottomWidth: 1, borderBottomColor: '#F3F3F3',
    },
    pickerTitle: { color: '#111', fontWeight: '700', fontSize: getFontSize(16) },
    pickerItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: wp(5), paddingVertical: hp(1.5),
        borderBottomWidth: 0.5, borderBottomColor: '#F3F3F3',
    },
    pickerItemActive: { backgroundColor: '#F5F3FF' },
    pickerItemText: { color: '#333', fontSize: getFontSize(14) },
    pickerItemTextActive: { color: colors.primary, fontWeight: '600' },
    // Export modal
    exportCard: {
        backgroundColor: colors.white, borderRadius: 20, padding: wp(5),
        marginHorizontal: wp(6),
        shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
    },
    exportTitle: { color: '#111', fontWeight: '800', fontSize: getFontSize(18), marginBottom: hp(0.3) },
    exportSub: { color: '#888', fontSize: getFontSize(12), marginBottom: hp(2) },
    exportOption: {
        flexDirection: 'row', alignItems: 'center', gap: wp(3),
        backgroundColor: '#FAFAFA', borderRadius: 12, padding: wp(3.5),
        borderWidth: 1, borderColor: '#F3F3F3', marginBottom: hp(1),
    },
    exportIconCircle: {
        width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center',
    },
    exportOptionInfo: { flex: 1 },
    exportOptionTitle: { color: '#333', fontWeight: '600', fontSize: getFontSize(14) },
    exportOptionSub: { color: '#999', fontSize: getFontSize(11) },
    exportCancelBtn: {
        alignItems: 'center', paddingVertical: hp(1.2), marginTop: hp(0.5),
    },
    exportCancelText: { color: '#999', fontWeight: '600', fontSize: getFontSize(14) },
    // Loading overlay
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
    loadingCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: wp(8),
        alignItems: 'center',
        gap: hp(1.5),
    },
    loadingText: { color: '#333', fontWeight: '600', fontSize: getFontSize(14) },
});
