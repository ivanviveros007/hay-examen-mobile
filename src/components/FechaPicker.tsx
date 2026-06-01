import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';

interface FechaPickerProps {
  fecha: Date;
  onChange: (date: Date) => void;
  examenesMap?: Record<string, string>;
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function FechaPicker({ fecha, onChange, examenesMap = {} }: FechaPickerProps) {
  const [tooltip, setTooltip] = useState<string | null>(null);

  const selectedStr = toDateString(fecha);
  const todayStr = toDateString(new Date());

  const markedDates: Record<string, object> = {};

  for (const f of Object.keys(examenesMap)) {
    markedDates[f] = {
      marked: true,
      dotColor: '#F59E0B',
    };
  }

  markedDates[selectedStr] = {
    ...(markedDates[selectedStr] ?? {}),
    selected: true,
    selectedColor: '#8B5CF6',
    selectedTextColor: '#FFFFFF',
  };

  const handleDayPress = (day: DateData) => {
    const [year, month, dayNum] = day.dateString.split('-').map(Number);
    onChange(new Date(year, month - 1, dayNum));

    const examen = examenesMap[day.dateString];
    setTooltip(examen ?? null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fecha del examen</Text>
      <View style={styles.calendarWrapper}>
        <Calendar
          current={selectedStr}
          onDayPress={handleDayPress}
          markedDates={markedDates}
          minDate={todayStr}
          theme={{
            backgroundColor: '#F3EEF8',
            calendarBackground: '#F3EEF8',
            todayTextColor: '#8B5CF6',
            todayBackgroundColor: '#EDE9FE',
            selectedDayBackgroundColor: '#8B5CF6',
            selectedDayTextColor: '#FFFFFF',
            arrowColor: '#8B5CF6',
            monthTextColor: '#3D2060',
            textMonthFontWeight: '700',
            textDayFontSize: 14,
            textDayHeaderFontSize: 12,
            textDayHeaderFontWeight: '600',
            dayTextColor: '#3D2060',
            textDisabledColor: '#C4B5D4',
            dotColor: '#F59E0B',
            selectedDotColor: '#F59E0B',
          }}
        />

        {tooltip && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipIcon}>📚</Text>
            <Text style={styles.tooltipText}>{tooltip}</Text>
          </View>
        )}

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.legendText}>Examen cargado</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#8B5CF6' }]} />
            <Text style={styles.legendText}>Día seleccionado</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B4E8A',
    marginBottom: 8,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  calendarWrapper: {
    backgroundColor: '#F3EEF8',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D5BFF0',
    overflow: 'hidden',
  },
  tooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    borderTopWidth: 1,
    borderTopColor: '#FDE68A',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tooltipIcon: { fontSize: 16 },
  tooltipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    flexShrink: 1,
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#D5BFF0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#6B4E8A',
    fontWeight: '500',
  },
});
