// Reemplazá con la IP local de tu máquina (ejecutá `ipconfig getifaddr en0` en Mac)
const DEV_BASE = 'http://192.168.86.22:3000/api';
const PROD_BASE = 'https://hay-examen-backend-production.up.railway.app/api';

export const API_BASE = __DEV__ ? DEV_BASE : PROD_BASE;

export const ENDPOINTS = {
  materias: `${API_BASE}/examenes/materias`,
  examenes: `${API_BASE}/examenes`,
  deleteExamen: (id: number) => `${API_BASE}/examenes/${id}`,
} as const;
