import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { Materia } from '../types';

interface MateriaPickerProps {
  materias: Materia[];
  selectedId: number | null;
  onValueChange: (id: number) => void;
}

export function MateriaPicker({ materias, selectedId, onValueChange }: MateriaPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Materia</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedId}
          onValueChange={(value) => onValueChange(value as number)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {materias.map((m) => (
            <Picker.Item key={m.id} label={m.nombre} value={m.id} color="#3D2060" />
          ))}
        </Picker>
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
  pickerWrapper: {
    backgroundColor: '#F3EEF8',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D5BFF0',
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 100 : 52,
    color: '#3D2060',
  },
  pickerItem: {
    fontSize: 15,
    color: '#3D2060',
    height: 100,
  },
});
