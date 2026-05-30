import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import type { Materia } from '../types';
import { ENDPOINTS } from '../constants/api';

interface FormState {
  materiaId: number | null;
  fecha: Date;
}

export interface UseExamenFormReturn {
  materias: Materia[];
  loadingMaterias: boolean;
  formState: FormState;
  submitting: boolean;
  setMateriaId: (id: number) => void;
  setFecha: (date: Date) => void;
  handleSubmit: () => Promise<void>;
}

const buildInitialState = (): FormState => ({
  materiaId: null,
  fecha: new Date(),
});

export function useExamenForm(): UseExamenFormReturn {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loadingMaterias, setLoadingMaterias] = useState(true);
  const [formState, setFormState] = useState<FormState>(buildInitialState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchMaterias() {
      try {
        const res = await fetch(ENDPOINTS.materias);
        if (!res.ok) throw new Error();
        const data: Materia[] = await res.json();
        if (!cancelled) {
          setMaterias(data);
          setFormState((prev) => ({
            ...prev,
            materiaId: data[0]?.id ?? null,
          }));
        }
      } catch {
        if (!cancelled) Alert.alert('Error', 'No se pudieron cargar las materias. Verificá tu conexión.');
      } finally {
        if (!cancelled) setLoadingMaterias(false);
      }
    }

    fetchMaterias();
    return () => { cancelled = true; };
  }, []);

  const setMateriaId = useCallback((id: number) => {
    setFormState((prev) => ({ ...prev, materiaId: id }));
  }, []);

  const setFecha = useCallback((date: Date) => {
    setFormState((prev) => ({ ...prev, fecha: date }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState({
      materiaId: materias[0]?.id ?? null,
      fecha: new Date(),
    });
  }, [materias]);

  const handleSubmit = useCallback(async () => {
    if (!formState.materiaId) {
      Alert.alert('Atención', 'Por favor seleccioná una materia.');
      return;
    }

    setSubmitting(true);
    try {
      const fechaStr = formState.fecha.toISOString().split('T')[0];
      const res = await fetch(ENDPOINTS.examenes, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materiaId: formState.materiaId, fecha: fechaStr }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? 'Error al guardar');
      }

      Alert.alert('¡Listo! 🎉', 'Tu examen fue guardado y agregado al calendario familiar.', [
        { text: 'OK', onPress: resetForm },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'No se pudo guardar el examen. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }, [formState, resetForm]);

  return { materias, loadingMaterias, formState, submitting, setMateriaId, setFecha, handleSubmit };
}
