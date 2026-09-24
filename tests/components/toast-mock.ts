import { vi } from "vitest";

/** `toast` de sonner como mock: los tests revisan el texto exacto del aviso. */
export const toast = Object.assign(vi.fn(), {
	success: vi.fn(),
	error: vi.fn(),
});

/** Texto de un toast cuyo contenido es JSX (`<span>…</span>`). */
export const toastText = (call: unknown[]) =>
	(call[0] as { props: { children: string } }).props.children;
