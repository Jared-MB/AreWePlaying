// Escala única de los títulos de sección de la portada ("Tus tickets",
// "Próximos partidos", "Mejores equipos"): mayor que los encabezados de torneo
// que van debajo, para que la jerarquía se lea de arriba hacia abajo.
export const SECTION_HEADING_CLASS =
	"font-mono text-2xl font-bold uppercase tracking-tight underline decoration-primary decoration-4 underline-offset-8 md:text-3xl";

// Enlaces secundarios de sección ("Tabla →", "Ver más", "Ver temporada
// anterior"): el mismo trazo en toda la portada para que se reconozcan.
export const SECTION_LINK_CLASS =
	"touch-hitbox shrink-0 whitespace-nowrap text-xs font-bold uppercase tracking-wider text-foreground hover:underline dark:text-primary";
