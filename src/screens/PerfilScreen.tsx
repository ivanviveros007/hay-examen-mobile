import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExamenesHistorial } from '../hooks/useExamenesHistorial';
import { ExamenesList } from '../components/ExamenesList';
import { NotaBottomSheet } from '../components/NotaBottomSheet';
import type { Examen } from '../types';

export function PerfilScreen() {
  const { examenes, loading, refreshing, error, onRefresh, deleteExamen, updateNota, deleteNota } =
    useExamenesHistorial();
  const [selectedExamen, setSelectedExamen] = useState<Examen | null>(null);

  const total = examenes.length;
  const proximos = examenes.filter((e) => new Date(e.fecha) >= new Date()).length;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{total}</Text>
              <Text style={styles.statLabel}>total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, styles.statNumberPurple]}>{proximos}</Text>
              <Text style={styles.statLabel}>próximos</Text>
            </View>
          </View>

        <ExamenesList
          examenes={examenes}
          loading={loading}
          refreshing={refreshing}
          error={error}
          onRefresh={onRefresh}
          onDelete={deleteExamen}
          onNota={(examen) => setSelectedExamen(examen)}
        />
      </View>

      <NotaBottomSheet
        visible={!!selectedExamen}
        examen={selectedExamen}
        onClose={() => setSelectedExamen(null)}
        onUpdate={updateNota}
        onDelete={deleteNota}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F4FF' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  stats: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    shadowColor: '#6B4E8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    gap: 24,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: '800', color: '#1E1035' },
  statNumberPurple: { color: '#8B5CF6' },
  statLabel: { fontSize: 12, color: '#7A6B8A', fontWeight: '600', marginTop: 2 },
  statDivider: { width: 1, height: 36, backgroundColor: '#E9E0F5' },
});
