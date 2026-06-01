import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import type { Materia, Examen } from '../types';
import { ENDPOINTS } from '../constants/api';

interface FormState {
  materiaId: number | null;
  fecha: Date;
}

export interface UseExamenFormReturn {
  materias: Materia[];
  loadingMaterias: boolean;
  examenesMap: Record<string, string>;
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

function buildExamenesMap(examenes: Examen[]): Record<string, string> {
  const map: Record<string, string[]> = {};
  for (const e of examenes) {
    if (!map[e.fecha]) map[e.fecha] = [];
    map[e.fecha].push(e.materiaNombre);
  }
  return Object.fromEntries(
    Object.entries(map).map(([fecha, nombres]) => [fecha, nombres.join(' • ')])
  );
}

export function useExamenForm(): UseExamenFormReturn {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loadingMaterias, setLoadingMaterias] = useState(true);
  const [examenesMap, setExamenesMap] = useState<Record<string, string>>({});
  const [formState, setFormState] = useState<FormState>(buildInitialState);
  const [submitting, setSubmitting] = useState(false);

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

      if (materia) {
        setExamenesMap((prev) => {
          const existing = prev[fechaStr];
          return {
            ...prev,
            [fechaStr]: existing ? `${existing} • ${materia.nombre}` : materia.nombre,
          };
        });
      }

      Alert.alert('¡Listo! 🎉', 'Tu examen fue guardado y agregado al calendario familiar.', [
        { text: 'OK', onPress: resetForm },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'No se pudo guardar el examen. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }, [formState, materias, resetForm]);

  return { materias, loadingMaterias, examenesMap, formState, submitting, setMateriaId, setFecha, handleSubmit };
}
