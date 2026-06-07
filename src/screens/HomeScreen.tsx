import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExamenForm } from '../hooks/useExamenForm';
import { MateriaPicker } from '../components/MateriaPicker';
import { FechaPicker } from '../components/FechaPicker';
import { NotaModal } from '../components/NotaModal';

export function HomeScreen() {
  const {
    materias,
    loadingMaterias,
    examenesMap,
    formState,
    submitting,
    setMateriaId,
    setFecha,
    handleSubmit,
    modalVisible,
    pendingExamen,
    handleSkipNota,
    handleSaveNota,
  } = useExamenForm();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerGreeting}>Hola Anto! 👋</Text>
        <Text style={styles.headerQuestion}>¿Hay examen?</Text>
      </View>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {loadingMaterias ? (
            <View style={styles.loaderWrapper}>
              <ActivityIndicator color="#8B5CF6" size="large" />
              <Text style={styles.loaderText}>Cargando materias...</Text>
            </View>
          ) : materias.length === 0 ? (
            <View style={styles.errorWrapper}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>No se pudo conectar con el servidor.</Text>
              <Text style={styles.errorHint}>Verificá que el backend esté corriendo.</Text>
            </View>
          ) : (
            <MateriaPicker
              materias={materias}
              selectedId={formState.materiaId}
              onValueChange={setMateriaId}
            />
          )}

          <FechaPicker fecha={formState.fecha} onChange={setFecha} examenesMap={examenesMap} />

          <TouchableOpacity
            style={[styles.button, (submitting || loadingMaterias) && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={submitting || loadingMaterias}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Guardar examen 🚀</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <NotaModal
        visible={modalVisible}
        materiaName={pendingExamen?.materiaName ?? ''}
        onSkip={handleSkipNota}
        onSave={handleSaveNota}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F4FF' },
  flex: { flex: 1, backgroundColor: '#F8F4FF' },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerEmoji: { fontSize: 42, marginBottom: 4 },
  headerGreeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#3D2060',
    letterSpacing: 0.2,
  },
  headerQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B5CF6',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
    backgroundColor: '#F8F4FF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    shadowColor: '#6B4E8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  loaderWrapper: { alignItems: 'center', paddingVertical: 24, gap: 12 },
  loaderText: { color: '#8B5CF6', fontSize: 14 },
  errorWrapper: { alignItems: 'center', paddingVertical: 20, gap: 6, marginBottom: 8 },
  errorIcon: { fontSize: 32 },
  errorText: { fontSize: 14, fontWeight: '600', color: '#DC2626', textAlign: 'center' },
  errorHint: { fontSize: 12, color: '#7A6B8A', textAlign: 'center' },
  button: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: { opacity: 0.55 },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
