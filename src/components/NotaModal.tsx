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
} from 'react-native';

interface NotaModalProps {
  visible: boolean;
  materiaName: string;
  onSkip: () => void;
  onSave: (nota: string) => Promise<void>;
}

export function NotaModal({ visible, materiaName, onSkip, onSave }: NotaModalProps) {
  const [step, setStep] = useState<'question' | 'input'>('question');
  const [nota, setNota] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setStep('question');
      setNota('');
      setError(null);
      setSaving(false);
    }
  }, [visible]);

  const handleGuardar = async () => {
    const trimmed = nota.trim();
    if (!trimmed) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(trimmed);
    } catch {
      setError('No se pudo guardar la nota. Intentá de nuevo.');
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          {step === 'question' ? (
            <>
              <Text style={styles.emoji}>✏️</Text>
              <Text style={styles.title}>¿Querés agregar una nota?</Text>
              <Text style={styles.subtitle}>Para {materiaName}</Text>
              <View style={styles.row}>
                <TouchableOpacity style={styles.btnOutline} onPress={onSkip} activeOpacity={0.8}>
                  <Text style={styles.btnOutlineText}>No, gracias</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnFilled}
                  onPress={() => setStep('input')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnFilledText}>Sí ✏️</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>Nota para {materiaName}</Text>
              <Text style={styles.subtitle}>Ej: simple past, present continuo…</Text>
              <TextInput
                style={styles.input}
                value={nota}
                onChangeText={setNota}
                placeholder="Escribí la nota acá..."
                placeholderTextColor="rgba(255,255,255,0.35)"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
                autoFocus
              />
              {error && <Text style={styles.errorText}>{error}</Text>}
              <TouchableOpacity
                style={[styles.btnFilled, styles.fullWidth, (!nota.trim() || saving) && styles.btnDisabled]}
                onPress={handleGuardar}
                disabled={!nota.trim() || saving}
                activeOpacity={0.8}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.btnFilledText}>Guardar nota</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStep('question')} style={styles.cancelLink}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    width: '100%',
    backgroundColor: '#1E1035',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
  },
  emoji: { fontSize: 40, marginBottom: 12 },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
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
  fullWidth: { flex: 0, width: '100%', marginTop: 4 },
  btnDisabled: { opacity: 0.45 },
  input: {
    width: '100%',
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
    textAlign: 'center',
  },
  cancelLink: { marginTop: 16, padding: 4 },
  cancelText: { color: 'rgba(255,255,255,0.45)', fontSize: 13 },
});
