import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import type { Examen } from '../types';

interface NotaBottomSheetProps {
  visible: boolean;
  examen: Examen | null;
  onClose: () => void;
  onUpdate: (id: number, nota: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function NotaBottomSheet({ visible, examen, onClose, onUpdate, onDelete }: NotaBottomSheetProps) {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && examen) {
      setMode('view');
      setDraft(examen.nota ?? '');
      setError(null);
      setSaving(false);
    }
  }, [visible, examen]);

  const handleGuardar = async () => {
    const trimmed = draft.trim();
    if (!trimmed || !examen) return;
    setSaving(true);
    setError(null);
    try {
      await onUpdate(examen.id, trimmed);
      setMode('view');
    } catch {
      setError('No se pudo actualizar la nota. Intentá de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleBorrar = () => {
    if (!examen) return;
    Alert.alert(
      'Borrar nota',
      `¿Confirmás que querés borrar la nota de ${examen.materiaNombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            setSaving(true);
            try {
              await onDelete(examen.id);
              onClose();
            } catch {
              setError('No se pudo borrar la nota.');
              setSaving(false);
            }
          },
        },
      ],
    );
  };

  if (!examen) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.materia}>{examen.materiaNombre}</Text>
          <Text style={styles.subhead}>
            {mode === 'view' ? 'Nota del examen' : 'Editar nota'}
          </Text>

          {mode === 'view' ? (
            <>
              <View style={styles.notaBox}>
                <Text style={styles.notaText}>{examen.nota}</Text>
              </View>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.btnOutline}
                  onPress={() => { setDraft(examen.nota ?? ''); setMode('edit'); }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnOutlineText}>Editar ✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnDestructive}
                  onPress={handleBorrar}
                  activeOpacity={0.8}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#EF4444" />
                  ) : (
                    <Text style={styles.btnDestructiveText}>Borrar nota 🗑️</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                value={draft}
                onChangeText={setDraft}
                placeholder="Escribí la nota acá..."
                placeholderTextColor="rgba(255,255,255,0.35)"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
                autoFocus
              />
              {error && <Text style={styles.errorText}>{error}</Text>}
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.btnOutline}
                  onPress={() => setMode('view')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnOutlineText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnFilled, (!draft.trim() || saving) && styles.btnDisabled]}
                  onPress={handleGuardar}
                  disabled={!draft.trim() || saving}
                  activeOpacity={0.8}
                >
                  {saving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.btnFilledText}>Guardar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: '#1E1035',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  materia: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subhead: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 20,
  },
  notaBox: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  notaText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  btnOutline: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#8B5CF6',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnOutlineText: { color: '#8B5CF6', fontWeight: '700', fontSize: 15 },
  btnFilled: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnFilledText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  btnDestructive: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnDestructiveText: { color: '#EF4444', fontWeight: '700', fontSize: 15 },
  btnDisabled: { opacity: 0.45 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(139,92,246,0.5)',
    borderRadius: 14,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    minHeight: 100,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginBottom: 12,
  },
});
