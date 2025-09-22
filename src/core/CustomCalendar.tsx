import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Calendar, DateObject } from "react-native-calendars";
import AppText, { Variant } from "./AppText";
import { colors } from "@/theme";

interface CustomCalendarProps {
  initialDate?: string;
  onDateSelect?: (date: string) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  initialDate = new Date().toISOString().split("T")[0],
  onDateSelect,
}) => {
  const [selected, setSelected] = useState(initialDate);

  const handleDayPress = (day: DateObject) => {
    setSelected(day.dateString);
    if (onDateSelect) {
      onDateSelect(day.dateString);
    }
  };

  return (
    <View style={styles.container}>
      <AppText variant={Variant.caption} color={colors.text1} style={{marginVertical: 4,}}>
        Availability Calendar
      </AppText>
      <Calendar
        style={styles.calendar}
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#4B5563",
          selectedDayBackgroundColor: "#2563EB",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#10B981",
          dayTextColor: "#111827",
          textDisabledColor: "#9CA3AF",
          arrowColor: "#2563EB",
          monthTextColor: "#111827",
          textDayFontWeight: "500",
          textMonthFontWeight: "600",
          textDayHeaderFontWeight: "500",
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 13,
        }}
        current={initialDate}
        onDayPress={handleDayPress}
        markedDates={{
          "2025-09-15": { marked: true, dotColor: "#F59E0B" },
          "2025-09-16": {
            dots: [{ color: "red" }, { color: "blue" }, { color: "green" }],
            marked: true,
          },
          "2025-09-17": { startingDay: true, color: "#2563EB", textColor: "#fff" },
          "2025-09-20": { endingDay: true, color: "#2563EB", textColor: "#fff" },
          [selected]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: "#2563EB",
            selectedTextColor: "#fff",
          },
        }}
        markingType="multi-dot"
      />
    </View>
  );
};

export default CustomCalendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  calendar: {
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width:320
  },
});
