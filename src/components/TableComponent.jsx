import React from 'react'
import { View, StyleSheet } from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'

const TableComponent = ({
  data = [],
  containerStyle,
  showBorders = true,
  alternateRowColors = false
}) => {
  const renderRow = (item, index) => {
    const isLastRow = index === data.length - 1
    const isHighlighted = item.highlighted || false
    
    return (
      <View 
        key={index} 
        style={[
          styles.tableRow,
          isHighlighted && styles.highlightedRow,
          alternateRowColors && index % 2 === 1 && styles.alternateRow,
          showBorders && !isLastRow && styles.rowWithBorder
        ]}
      >
        <AppText 
          variant={isHighlighted ? Variant.bodyMedium : Variant.body} 
          style={[
            styles.tableLabel,
            isHighlighted && styles.highlightedLabel
          ]}
        >
          {item.label}
        </AppText>
        <AppText 
          variant={isHighlighted ? Variant.bodyMedium : Variant.body} 
          style={[
            styles.tableValue,
            isHighlighted && styles.highlightedValue
          ]}
        >
          {item.value}
        </AppText>
      </View>
    )
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {data.map((item, index) => renderRow(item, index))}
    </View>
  )
}

// Example usage component
const TransactionTableExample = () => {
  const transactionData = [
    {
      label: 'Withdraw coins (SGCOIN)',
      value: '1'
    },
    {
      label: 'Transaction fees (SGCOIN)',
      value: '1'
    },
    {
      label: 'Total coins (SGCOIN)',
      value: '0'
    },
    {
      label: 'Total amount (USD)',
      value: '$68.00',
      highlighted: true
    },
    {
      label: 'Bank name',
      value: '-'
    }
  ]

  return (
    <View style={styles.exampleContainer}>
      <TableComponent 
        data={transactionData}
        showBorders={true}
        containerStyle={styles.tableContainer}
      />
    </View>
  )
}

export default TableComponent
export { TransactionTableExample }

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white || '#FFFFFF',
    borderRadius: hp(2),
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2.5),
    minHeight: hp(6),
  },
  rowWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#E5E7EB',
  },
  alternateRow: {
    backgroundColor: colors.grayE8 || '#F9FAFB',
  },
  highlightedRow: {
    backgroundColor: colors.grayE8 || '#F3F4F6',
  },
  tableLabel: {
    color: '#8B8FA6',
    fontSize: getFontSize(16),
    flex: 1,
    fontWeight: '400',
  },
  tableValue: {
    color: '#8B8FA6',
    fontSize: getFontSize(16),
    fontWeight: '500',
    textAlign: 'right',
    marginLeft: wp(4),
  },
  highlightedLabel: {
    color: colors.black || '#374151',
    fontWeight: '600',
  },
  highlightedValue: {
    color: colors.black || '#374151',
    fontWeight: '700',
  },
  
  // Example styles
  exampleContainer: {
    flex: 1,
    padding: wp(4),
    backgroundColor: colors.white,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
})