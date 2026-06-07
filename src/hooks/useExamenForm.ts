import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Alert } from 'react-native';
import type { Materia, Examen } from '../types';
import { ENDPOINTS } from '../constants/api';

interface FormState {
  materiaId: number | null;
  fecha: Date;
}

export interface ExamenMapEntry {
  label: string;
  hasNota: boolean;
}

export interface UseExamenFormReturn {
  materias: Materia[];
  loadingMaterias: boolean;
  examenesMap: Record<string, ExamenMapEntry>;
  formState: FormState;
  submitting: boolean;
  setMateriaId: (id: number) => void;
  setFecha: (date: Date) => void;
  handleSubmit: () => Promise<void>;
  modalVisible: boolean;
  pendingExamen: { id: number; materiaName: string; fecha: string } | null;
  handleSkipNota: () => void;
  handleSaveNota: (nota: string) => Promise<void>;
}

const buildInitialState = (): FormState => ({
  materiaId: null,
  fecha: new Date(),
});

function buildExamenesMap(examenes: Examen[]): Record<string, ExamenMapEntry> {
  const map: Record<string, { names: string[]; hasNota: boolean }> = {};
  for (const e of examenes) {
    if (!map[e.fecha]) map[e.fecha] = { names: [], hasNota: false };
    map[e.fecha].names.push(e.materiaNombre);
    if (e.nota) map[e.fecha].hasNota = true;
  }
  return Object.fromEntries(
    Object.entries(map).map(([fecha, { names, hasNota }]) => [
      fecha,
      { label: names.join(' • '), hasNota },
    ])
  );
}

export function useExamenForm(): UseExamenFormReturn {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loadingMaterias, setLoadingMaterias] = useState(true);
  const [examenesMap, setExamenesMap] = useState<Record<string, ExamenMapEntry>>({});
  const [formState, setFormState] = useState<FormState>(buildInitialState);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingExamen, setPendingExamen] = useState<{
    id: number;
    materiaName: string;
    fecha: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchInitialData() {
      try {
        const [resMaterias, resExamenes] = await Promise.all([
          fetch(ENDPOINTS.materias),
          fetch(ENDPOINTS.examenes),
        ]);
        if (!resMaterias.ok) throw new Error();
        const dataMaterias: Materia[] = await resMaterias.json();
        if (!cancelled) {
          setMaterias(dataMaterias);
          setFormState((prev) => ({
            ...prev,
            materiaId: dataMaterias[0]?.id ?? null,
          }));
        }
        if (resExamenes.ok) {
          const dataExamenes: Examen[] = await resExamenes.json();
          if (!cancelled) setExamenesMap(buildExamenesMap(dataExamenes));
        }
      } catch {
        if (!cancelled) Alert.alert('Error', 'No se pudieron cargar las materias. Verificá tu conexión.');
      } finally {
        if (!cancelled) setLoadingMaterias(false);
      }
    }

    fetchInitialData();
    return () => { cancelled = true; };
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      fetch(ENDPOINTS.examenes)
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data: Examen[]) => { if (!cancelled) setExamenesMap(buildExamenesMap(data)); })
        .catch(() => {});
      return () => { cancelled = true; };
    }, [])
  );

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
      const materia = materias.find((m) => m.id === formState.materiaId);
      const res = await fetch(ENDPOINTS.examenes, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materiaId: formState.materiaId, fecha: fechaStr }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? 'Error al guardar');
      }

      const data: Examen = await res.json();

      if (materia) {
        setExamenesMap((prev) => {
          const existing = prev[fechaStr];
          return {
            ...prev,
            [fechaStr]: {
              label: existing ? `${existing.label} • ${materia.nombre}` : materia.nombre,
              hasNota: existing?.hasNota ?? false,
            },
          };
        });
      }

      setPendingExamen({
        id: data.id,
        materiaName: materia?.nombre ?? '',
        fecha: fechaStr,
      });
      setModalVisible(true);
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'No se pudo guardar el examen. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }, [formState, materias]);

  const handleSkipNota = useCallback(() => {
    setModalVisible(false);
    setPendingExamen(null);
    Alert.alert('¡Listo! 🎉', 'Tu examen fue guardado y agregado al calendario familiar.', [
      { text: 'OK', onPress: resetForm },
    ]);
  }, [resetForm]);

  const handleSaveNota = useCallback(async (nota: string) => {
    if (!pendingExamen) return;
    const res = await fetch(ENDPOINTS.updateNota(pendingExamen.id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nota }),
    });
    if (!res.ok) throw new Error('No se pudo guardar la nota');

    setExamenesMap((prev) => {
      const existing = prev[pendingExamen.fecha];
      if (!existing) return prev;
      return { ...prev, [pendingExamen.fecha]: { ...existing, hasNota: true } };
    });

    setModalVisible(false);
    setPendingExamen(null);
    Alert.alert('¡Listo! 🎉', 'Tu examen fue guardado con la nota. 📝', [
      { text: 'OK', onPress: resetForm },
    ]);
  }, [pendingExamen, resetForm]);

  return {
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
  };
}
