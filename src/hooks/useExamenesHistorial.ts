import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import type { Examen } from '../types';
import { ENDPOINTS } from '../constants/api';

export interface UseExamenesHistorialReturn {
  examenes: Examen[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void;
  deleteExamen: (id: number) => Promise<void>;
  updateNota: (id: number, nota: string) => Promise<void>;
  deleteNota: (id: number) => Promise<void>;
}

export function useExamenesHistorial(): UseExamenesHistorialReturn {
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExamenes = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);

    try {
      const res = await fetch(ENDPOINTS.examenes);
      if (!res.ok) throw new Error();
      const data: Examen[] = await res.json();
      setExamenes(data);
    } catch {
      setError('No se pudo cargar el historial. Deslizá hacia abajo para reintentar.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refresca cada vez que el usuario navega a esta pestaña
  useFocusEffect(
    useCallback(() => {
      fetchExamenes();
    }, [fetchExamenes]),
  );

  const onRefresh = useCallback(() => {
    fetchExamenes(true);
  }, [fetchExamenes]);

  const deleteExamen = useCallback(async (id: number) => {
    await fetch(ENDPOINTS.deleteExamen(id), { method: 'DELETE' });
    setExamenes((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateNota = useCallback(async (id: number, nota: string) => {
    const res = await fetch(ENDPOINTS.updateNota(id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nota }),
    });
    if (!res.ok) throw new Error('No se pudo actualizar la nota');
    setExamenes((prev) => prev.map((e) => (e.id === id ? { ...e, nota } : e)));
  }, []);

  const deleteNota = useCallback(async (id: number) => {
    const res = await fetch(ENDPOINTS.deleteNota(id), { method: 'DELETE' });
    if (!res.ok) throw new Error('No se pudo borrar la nota');
    setExamenes((prev) => prev.map((e) => (e.id === id ? { ...e, nota: null } : e)));
  }, []);

  return { examenes, loading, refreshing, error, onRefresh, deleteExamen, updateNota, deleteNota };
}
