import React from 'react';
import {
  SectionList,
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
  onNota?: (examen: Examen) => void;
}

function getTodayStr(): string {
  const hoy = new Date();
  return [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, '0'),
    String(hoy.getDate()).padStart(2, '0'),
  ].join('-');
}

export function ExamenesList({
  examenes,
  loading,
  refreshing,
  error,
  onRefresh,
  onDelete,
  onNota,
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

  const todayStr = getTodayStr();
  const proximos = examenes.filter((e) => e.fecha >= todayStr);
  const realizados = examenes.filter((e) => e.fecha < todayStr).reverse();

  const sections = [
    { title: 'Próximos', data: proximos },
    ...(realizados.length > 0 ? [{ title: 'Realizados', data: realizados }] : []),
  ];

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <ExamenCard examen={item} onDelete={onDelete} onNota={onNota} />}
      renderSectionHeader={({ section }) =>
        section.data.length > 0 ? (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        ) : null
      }
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
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
  list: { paddingBottom: 120 },
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
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9B8AB0',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 4,
  },
});
