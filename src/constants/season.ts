/**
 * Cada despliegue sirve una sola temporada: la actual en el dominio principal y
 * las pasadas en subdominios (2025-2026.areweplaying.com). Se configura con la
 * variable de entorno SEASON; el valor por defecto es para desarrollo local.
 */
export const CURRENT_SEASON = import.meta.env.SEASON ?? "2026-2027";
