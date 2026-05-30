import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface FechaPickerProps {
  fecha: Date;
  onChange: (date: Date) => void;
}

export function FechaPicker({ fecha, onChange }: FechaPickerProps) {
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowAndroidPicker(false);
    if (selectedDate) onChange(selectedDate);
  };

  const formatted = fecha.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (Platform.OS === 'ios') {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Fecha del examen</Text>
        <View style={styles.iosWrapper}>
          <DateTimePicker
            value={fecha}
            mode="date"
            display="inline"
            onChange={handleChange}
            locale="es-AR"
            accentColor="#8B5CF6"
            themeVariant="light"
            minimumDate={new Date()}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fecha del examen</Text>
      <TouchableOpacity
        style={styles.androidButton}
        onPress={() => setShowAndroidPicker(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.androidIcon}>📅</Text>
        <Text style={styles.androidText}>{formatted}</Text>
      </TouchableOpacity>

      {showAndroidPicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display="default"
          onChange={handleChange}
          minimumDate={new Date()}
        />
      )}
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
  iosWrapper: {
    backgroundColor: '#F3EEF8',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D5BFF0',
    overflow: 'hidden',
  },
  androidButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EEF8',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D5BFF0',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 10,
  },
  androidIcon: { fontSize: 20 },
  androidText: { fontSize: 15, color: '#3D2060', fontWeight: '500', flexShrink: 1 },
});
