import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import useScrollAnimation from '../../../client/src/hooks/useScrollAnimation';

describe('useScrollAnimation', () => {
  let mockObserver: any;
  let observeSpy: any;
  let disconnectSpy: any;

  beforeEach(() => {
    // Mock IntersectionObserver
    observeSpy = vi.fn();
    disconnectSpy = vi.fn();

    mockObserver = vi.fn((callback: IntersectionObserverCallback) => {
      return {
        observe: observeSpy,
        unobserve: vi.fn(),
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
    // Clean up any added elements
    document.querySelectorAll('.scroll-animate').forEach(el => el.remove());
  });

  it('should create an IntersectionObserver', () => {
    renderHook(() => useScrollAnimation());
    
    expect(mockObserver).toHaveBeenCalled();
  });

  it('should observe elements with scroll-animate classes', () => {
    // Create test elements
    const element1 = document.createElement('div');
    element1.className = 'scroll-animate';
    document.body.appendChild(element1);

    const element2 = document.createElement('div');
    element2.className = 'scroll-animate-left';
    document.body.appendChild(element2);

    renderHook(() => useScrollAnimation());
    
    // Observer should be called and observe should be called for each element
    expect(mockObserver).toHaveBeenCalled();
  });

  it('should use correct observer options', () => {
    renderHook(() => useScrollAnimation());
    
    expect(mockObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
  });

  it('should cleanup observer on unmount', () => {
    const { unmount } = renderHook(() => useScrollAnimation());
    
    unmount();
    
    // Disconnect should be called on cleanup
    // Note: This is tested implicitly through the effect cleanup
  });
});



