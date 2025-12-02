import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { colors, hp, wp } from '@/theme'
import AppDropDown from '@/core/AppDropDown'

const JobFiltersBar = ({
    filters = {},
    onFiltersChange
}) => {

    const [isVisible, setIsVisible] = useState(false)
    const [searchDropDown, setSearchDropDown] = useState(false)
    
    const postOptions = [
        { label: 'All Post', value: 'all' },
        { label: 'Last week', value: 'last_week' },
        { label: 'Last 2 weeks', value: 'last_2_weeks' },
        { label: 'Last month', value: 'last_month' },
    ]

    const jobTypeOptions = [
        { label: 'All Types', value: '' },
        { label: 'Full-time', value: 'Full-time' },
        { label: 'Part-time', value: 'Part-time' },
        { label: 'Contract', value: 'Contract' },
        { label: 'Casual', value: 'Casual' },
    ]

    const handlePostFilterChange = (value) => {
        if (onFiltersChange) {
            onFiltersChange({ ...filters, timeFilter: value })
        }
        console.log('Post filter changed to:', value)
    }

    const handleJobTypeChange = (value) => {
        if (onFiltersChange) {
            onFiltersChange({ ...filters, jobType: value })
        }
        console.log('Job type changed to:', value)
    }

    return (
        <View style={styles.filtersContainer}>
            <View style={{ width: '48%' }}>
                <AppDropDown
                    placeholder="All Post"
                    options={postOptions}
                    isVisible={isVisible}
                    setIsVisible={setIsVisible}
                    selectedValue={filters?.timeFilter || 'all'}
                    onSelect={handlePostFilterChange}
                    style={styles.filterDropdown}
                />
            </View>

            <View style={{ width: '48%' }}>
                <AppDropDown
                    placeholder="All Types"
                    options={jobTypeOptions}
                    isVisible={searchDropDown}
                    setIsVisible={setSearchDropDown}
                    selectedValue={filters?.jobType || ''}
                    onSelect={handleJobTypeChange}
                    style={styles.filterDropdown}
                />
            </View>
        </View>
    )
}

export default JobFiltersBar

const styles = StyleSheet.create({
    filtersContainer: {
        flexDirection: 'row',
        paddingHorizontal: wp(6),
        // paddingVertical: hp(1.5),
        backgroundColor: colors.white || '#FFFFFF',
        gap: wp(3),
    },
    filterDropdown: {
        flex: 1,
    },
    searchTypeDropdown: {
        flex: 1.5, // Make search type dropdown slightly wider
    },
})