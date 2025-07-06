import { describe, expect, test } from '@jest/globals';

let scale = 1;
const GRID = 25;
const snap = (v) => {
    const step = GRID * scale;
    return Math.round(v / step) * step;
};

describe('snap', () => {
    test('snaps values correctly', () => {
        scale = 1;
        expect(snap(47)).toBe(50);
        expect(snap(12)).toBe(0);
        expect(snap(87)).toBe(75);
    });

    test('snaps rounds value to nearest grid multiple', () => {
        const result = snap(63);
        expect(result % (GRID * scale)).toBe(0);
    });

    test('snap returns same value if already snapped', () => {
        scale = 1;
        expect(snap(50)).toBe(50);
        expect(snap(75)).toBe(75);
    });

    test('snap works with negative values', () => {
        scale = 1;
        expect(snap(-12)).toBe(0);
        expect(snap(-26)).toBe(-25);
    });

    // Дополнительные unit-тесты:
    test('snap respects current scale', () => {
        scale = 2;
        expect(snap(49)).toBe(50);
        expect(snap(62)).toBe(50);
        expect(snap(77)).toBe(100);
    });

    test('snap returns 0 for 0 input', () => {
        scale = 1;
        expect(snap(0)).toBe(0);
    });

    test('snap rounds up when closer to next grid', () => {
        scale = 1;
        expect(snap(61)).toBe(75);
    });

    test('snap rounds down when closer to previous grid', () => {
        scale = 1;
        expect(snap(64)).toBe(75);
        expect(snap(38)).toBe(25);
    });

    test('snap returns negative grid for negative input', () => {
        scale = 1;
        expect(snap(-30)).toBe(-25);
        expect(snap(-60)).toBe(-50);
    });
});
