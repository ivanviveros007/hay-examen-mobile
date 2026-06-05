import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import type { Examen } from '../types';

const MATERIA_COLORS: Record<string, string> = {
  'Prácticas del lenguaje': '#FF6B9D',
  'Matemáticas':            '#4ECDC4',
  'Ciencias sociales':      '#F9A03F',
  'Ciencias naturales':     '#6BCB77',
  'Humanities':             '#9B5DE5',
  'Literature':             '#F15BB5',
  'Inglés':                 '#00BBF9',
  'Global perspective':     '#FEE440',
  'Ciudadanía':             '#FB5607',
  'Vocabulary-Lab':         '#3A86FF',
};

interface ExamenCardProps {
  examen: Examen;
  onDelete: (id: number) => void;
}

export function ExamenCard({ examen, onDelete }: ExamenCardProps) {
  const color = MATERIA_COLORS[examen.materiaNombre] ?? '#8B5CF6';
  const inicial = examen.materiaNombre.charAt(0).toUpperCase();

  const fechaObj = new Date(`${examen.fecha}T12:00:00`);
  const fechaFormateada = fechaObj.toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const hoy = new Date();
  const hoyMidnight = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const examMidnight = new Date(examen.fecha + 'T00:00:00');
  const diasRestantes = Math.round(
    (examMidnight.getTime() - hoyMidnight.getTime()) / (1000 * 60 * 60 * 24),
  );

  const badgeLabel =
    diasRestantes < 0
      ? 'Realizado'
      : diasRestantes === 0
      ? '¡Hoy!'
      : diasRestantes === 1
      ? 'Mañana'
      : `En ${diasRestantes} días`;

  const badgeColor =
    diasRestantes < 0 ? '#9CA3AF' : diasRestantes <= 2 ? '#EF4444' : '#8B5CF6';

  return (
    <View style={styles.card}>
      <View style={[styles.avatar, { backgroundColor: color }]}>
        <Text style={styles.avatarText}>{inicial}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.materia} numberOfLines={1}>
          {examen.materiaNombre}
        </Text>
        <Text style={styles.fecha}>📅 {fechaFormateada}</Text>
      </View>

      <View style={[styles.badge, { backgroundColor: badgeColor + '1A' }]}>
        <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeLabel}</Text>
      </View>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() =>
          Alert.alert(
            'Eliminar examen',
            `¿Eliminás el examen de ${examen.materiaNombre}?`,
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(examen.id) },
            ],
          )
        }
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.deleteBtnText}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#6B4E8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  content: { flex: 1, marginRight: 8 },
  materia: { fontSize: 15, fontWeight: '700', color: '#1E1035', marginBottom: 4 },
  fecha: { fontSize: 12, color: '#7A6B8A' },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
  deleteBtn: { marginLeft: 10, padding: 4 },
  deleteBtnText: { fontSize: 18 },
});
