const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

/** Mientras se escribe el hex a mano el valor pasa por estados inválidos que romperían el render. */
export function safeColor(value: string): string {
	return HEX_PATTERN.test(value) ? value : '#000000';
}

export { HEX_PATTERN };
