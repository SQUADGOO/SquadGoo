import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { colors, hp, wp } from '@/theme'
import AppDropDown from '@/core/AppDropDown'

const JobFiltersBar = ({
    postFilter,
    setPostFilter,
    searchType,
    setSearchType
}) => {

    const [isVisible, setIsVisible] = useState(false)
    const [searchDropDown, setSearchDropDown] = useState(false)
    const postOptions = [
        { label: 'All Post', value: 'all' },
        { label: 'Last week', value: 'last_week' },
        { label: 'Last 2 week', value: 'last_2_weeks' },
        { label: 'Last month', value: 'last_month' },
    ]

    const searchOptions = [
        { label: 'Select Search Type', value: '' },
        { label: 'Job Title', value: 'title' },
        { label: 'Location', value: 'location' },
        { label: 'Salary Range', value: 'salary' },
        { label: 'Experience Level', value: 'experience' },
    ]

    const handlePostFilterChange = (value, option) => {
        setPostFilter(value)
        // You can add additional logic here if needed
        console.log('Post filter changed to:', option.label)
    }

    const handleSearchTypeChange = (value, option) => {
        // setSearchType(value)
        // You can add additional logic here if needed
        console.log('Search type changed to:', option.label)
    }

    return (
        <View style={styles.filtersContainer}>
            <View style={{ width: '35%' }}>
                <AppDropDown
                    placeholder="All Post"
                    options={postOptions}
                    isVisible={isVisible}
                    setIsVisible={setIsVisible}
                    // close={setIsVisible(false)}
                    selectedValue={postFilter}
                    onSelect={handlePostFilterChange}
                    style={styles.filterDropdown}
                />
            </View>

            <View style={{ width: '65%' }}>


                <AppDropDown
                    placeholder="Select Search Type"
                    options={searchOptions}
                    status={searchDropDown}
                    isVisible={searchDropDown}
                    setIsVisible={setSearchDropDown}
                    selectedValue={searchType}
                    onSelect={handleSearchTypeChange}
                    style={[styles.filterDropdown, styles.searchTypeDropdown]}
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