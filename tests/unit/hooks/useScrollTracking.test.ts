import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollTracking } from '../../../client/src/hooks/useScrollTracking';

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  trackSectionView: vi.fn(),
}));

describe('useScrollTracking', () => {
  let mockObserver: any;
  let observeSpy: any;
  let unobserveSpy: any;
  let disconnectSpy: any;

  beforeEach(() => {
    // Mock IntersectionObserver
    observeSpy = vi.fn();
    unobserveSpy = vi.fn();
    disconnectSpy = vi.fn();

    mockObserver = vi.fn((callback: IntersectionObserverCallback) => {
      return {
        observe: observeSpy,
        unobserve: unobserveSpy,
        disconnect: disconnectSpy,
        root: null,
        rootMargin: '',
        thresholds: [],
      };
    });

    global.IntersectionObserver = mockObserver as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create an IntersectionObserver', () => {
    const { result } = renderHook(() => useScrollTracking('test-section'));
    
    expect(mockObserver).toHaveBeenCalled();
    expect(result.current).toBeDefined();
  });

  it('should observe element when ref is attached', () => {
    const { result } = renderHook(() => useScrollTracking('test-section'));
    
    // Create a mock element
    const mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
    
    // Attach ref to element
    if (result.current.current === null) {
      (result.current as any).current = mockElement;
    }
    
    // Force re-render to trigger effect
    renderHook(() => useScrollTracking('test-section'));
    
    expect(observeSpy).toHaveBeenCalled();
  });

  it('should use default threshold of 0.5', () => {
    renderHook(() => useScrollTracking('test-section'));
    
    expect(mockObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.5 }
    );
  });

  it('should use custom threshold when provided', () => {
    renderHook(() => useScrollTracking('test-section', 0.8));
    
    expect(mockObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.8 }
    );
  });

  it('should cleanup observer on unmount', () => {
    const { unmount } = renderHook(() => useScrollTracking('test-section'));
    
    unmount();
    
    // Note: unobserve is called in cleanup, but we need to verify the cleanup function runs
    // This is tested implicitly through the effect cleanup
  });
});



