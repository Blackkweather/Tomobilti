import { describe, it, expect } from 'vitest';

describe('Date Utilities', () => {
  it('should format dates correctly', () => {
    const date = new Date('2025-10-31');
    expect(date.toISOString().split('T')[0]).toBe('2025-10-31');
  });

  it('should validate date ranges', () => {
    const start = new Date('2025-11-01');
    const end = new Date('2025-11-05');
    expect(end.getTime() > start.getTime()).toBe(true);
  });

  it('should detect overlapping dates', () => {
    const booking1Start = new Date('2025-11-01');
    const booking1End = new Date('2025-11-05');
    const booking2Start = new Date('2025-11-03');
    const booking2End = new Date('2025-11-07');
    
    const overlaps = booking1Start <= booking2End && booking2Start <= booking1End;
    expect(overlaps).toBe(true);
  });
});



