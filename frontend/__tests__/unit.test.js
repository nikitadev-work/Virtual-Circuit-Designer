/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

const {describe, expect, test, beforeEach} = require('@jest/globals');

let scale = 1;

const GRID = 25;
const snap = (v) => {
    const step = GRID * scale;
    return Math.round(v / step) * step;
};

describe('snap', () => {
    // 1 test - checks rounding of arbitrary values to the nearest grid step
    test('snaps values correctly', () => {
        scale = 1;
        expect(snap(47)).toBe(50);
        expect(snap(12)).toBe(0);
        expect(snap(87)).toBe(75);
    });

    // 2 test - ensures snapped value is a multiple of grid * scale
    test('snaps rounds value to nearest grid multiple', () => {
        const result = snap(63);
        expect(result % (GRID * scale)).toBe(0);
    });

    // 3 test - verifies that already aligned values remain unchanged
    test('snap returns same value if already snapped', () => {
        scale = 1;
        expect(snap(50)).toBe(50);
        expect(snap(75)).toBe(75);
    });

    // 4 test - checks correct snapping behavior for negative values
    test('snap works with negative values', () => {
        scale = 1;
        expect(snap(-12)).toBeCloseTo(0);
        expect(snap(-26)).toBe(-25);
    });
});
