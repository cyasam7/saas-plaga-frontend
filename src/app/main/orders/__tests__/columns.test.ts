import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';

import { formatOrderWhen } from '../columns';

describe('formatOrderWhen', () => {
	const today = dayjs('2026-11-10T09:00:00');

	it('uses relative labels for yesterday, today and tomorrow', () => {
		expect(formatOrderWhen('2026-11-09T16:00:00', today)).toBe('Ayer · 4:00 PM');
		expect(formatOrderWhen('2026-11-10T10:00:00', today)).toBe('Hoy · 10:00 AM');
		expect(formatOrderWhen('2026-11-11T08:30:00', today)).toBe('Mañana · 8:30 AM');
	});

	it('falls back to day and month for other dates', () => {
		expect(formatOrderWhen('2026-11-14T12:00:00', today)).toMatch(/^14 \S+ · 12:00 PM$/);
	});
});
