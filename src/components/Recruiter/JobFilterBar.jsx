import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { colors, hp, wp } from '@/theme'
import AppDropDown from '@/core/AppDropDown'
import AppText, { Variant } from '@/core/AppText'

const JobFiltersBar = ({
    filters = {},
    onFiltersChange
}) => {

    // keep only one dropdown open at a time (AppDropDown uses a Modal)
    const [openKey, setOpenKey] = useState(null)
    
    const postOptions = [
        { label: 'Date Range', value: 'all' },
        { label: 'Last week', value: 'last_week' },
        { label: 'Last 2 weeks', value: 'last_2_weeks' },
        { label: 'Last month', value: 'last_month' },
    ]

    const jobTypeOptions = [
        { label: 'Job Type', value: '' },
        { label: 'Full-Time', value: 'Full-time' },
        { label: 'Part-Time', value: 'Part-time' },
        { label: 'Contract', value: 'Contract' },
        { label: 'Casual', value: 'Casual' },
    ]

    const searchTypeOptions = [
        { label: 'All', value: '' },
        { label: 'Manual Search', value: 'manual' },
        { label: 'Quick Search', value: 'quick' },
    ]

    const handlePostFilterChange = (value) => {
        if (onFiltersChange) {
            onFiltersChange({ ...filters, timeFilter: value })
        }
    }

    const handleJobTypeChange = (value) => {
        if (onFiltersChange) {
            onFiltersChange({ ...filters, jobType: value })
        }
    }

    const handleSearchTypeChange = (value) => {
        if (onFiltersChange) {
            onFiltersChange({ ...filters, searchMode: value })
        }
    }

    const handleClearFilters = () => {
        setOpenKey(null)
        if (onFiltersChange) {
            onFiltersChange({ timeFilter: 'all', jobType: '', searchMode: '' })
        }
    }

    return (
        <View style={styles.container}>
            {/* Row 1: Date Range + Job Type */}
            <View style={[styles.row, { zIndex: 2 }]}>
                <View style={styles.col}>
                    <AppDropDown
                        placeholder="Date Range"
                        options={postOptions}
                        isVisible={openKey === 'dateRange'}
                        setIsVisible={(visible) => setOpenKey(visible ? 'dateRange' : null)}
                        selectedValue={filters?.timeFilter || 'all'}
                        onSelect={handlePostFilterChange}
                    />
                </View>
                <View style={styles.col}>
                    <AppDropDown
                        placeholder="Job Type"
                        options={jobTypeOptions}
                        isVisible={openKey === 'jobType'}
                        setIsVisible={(visible) => setOpenKey(visible ? 'jobType' : null)}
                        selectedValue={filters?.jobType || ''}
                        onSelect={handleJobTypeChange}
                    />
                </View>
            </View>

            {/* Row 2: Manual/Quick + Clear */}
            <View style={[styles.row, { zIndex: 1 }]}>
                <View style={styles.col}>
                    <AppDropDown
                        placeholder="Manual / Quick"
                        options={searchTypeOptions}
                        isVisible={openKey === 'searchMode'}
                        setIsVisible={(visible) => setOpenKey(visible ? 'searchMode' : null)}
                        selectedValue={filters?.searchMode || ''}
                        onSelect={handleSearchTypeChange}
                    />
                </View>
                <View style={styles.col}>
                    <TouchableOpacity onPress={handleClearFilters} activeOpacity={0.8} style={styles.clearBtn}>
                        <AppText variant={Variant.bodyMedium} style={styles.clearBtnText}>
                            Clear Filters
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default JobFiltersBar

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white || '#FFFFFF',
        paddingHorizontal: wp(6),
        paddingVertical: hp(1),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp(0.6),
    },
    col: {
        flex: 1,
        marginHorizontal: wp(1.5),
    },
    clearBtn: {
        height: hp(5),
        borderRadius: hp(1),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: colors.grayE8 || '#E5E7EB',
    },
    clearBtnText: {
        color: '#111827',
    },
})
