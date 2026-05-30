import React from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import type { Examen } from '../types';
import { ExamenCard } from './ExamenCard';

interface ExamenesListProps {
  examenes: Examen[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void;
  onDelete: (id: number) => void;
}

export function ExamenesList({
  examenes,
  loading,
  refreshing,
  error,
  onRefresh,
  onDelete,
}: ExamenesListProps) {
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Cargando exámenes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.stateEmoji}>😕</Text>
        <Text style={styles.stateTitle}>Algo salió mal</Text>
        <Text style={styles.stateSubtitle}>{error}</Text>
      </View>
    );
  }

  if (examenes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.stateEmoji}>📚</Text>
        <Text style={styles.stateTitle}>¡Sin exámenes aún!</Text>
        <Text style={styles.stateSubtitle}>
          Guardá tu primer examen desde la pestaña Inicio.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={examenes}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <ExamenCard examen={item} onDelete={onDelete} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#8B5CF6']}
          tintColor="#8B5CF6"
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 32 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 32,
  },
  loadingText: { marginTop: 12, color: '#8B5CF6', fontSize: 15 },
  stateEmoji: { fontSize: 64, marginBottom: 16 },
  stateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3D2060',
    marginBottom: 8,
    textAlign: 'center',
  },
  stateSubtitle: {
    fontSize: 14,
    color: '#7A6B8A',
    textAlign: 'center',
    lineHeight: 20,
  },
});
