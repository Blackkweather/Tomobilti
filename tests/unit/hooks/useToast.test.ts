import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast, toast, reducer } from '../../../client/src/hooks/use-toast';

describe('useToast Hook', () => {
  beforeEach(() => {
    // Reset state before each test
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial state with empty toasts', () => {
    const { result } = renderHook(() => useToast());
    
    expect(result.current.toasts).toEqual([]);
  });

  it('should add a toast', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      toast({
        title: 'Test Toast',
        description: 'This is a test',
      });
    });
    
    expect(result.current.toasts.length).toBeGreaterThan(0);
    expect(result.current.toasts[0].title).toBe('Test Toast');
  });

  it('should dismiss a toast', () => {
    const { result } = renderHook(() => useToast());
    
    let toastId: string;
    
    act(() => {
      const toastResult = toast({
        title: 'Test Toast',
      });
      toastId = toastResult.id;
    });
    
    expect(result.current.toasts.length).toBe(1);
    
    act(() => {
      result.current.dismiss(toastId!);
    });
    
    // Toast should be marked as closed
    const dismissedToast = result.current.toasts.find(t => t.id === toastId);
    expect(dismissedToast?.open).toBe(false);
  });

  it('should limit toasts to TOAST_LIMIT', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      toast({ title: 'Toast 1' });
      toast({ title: 'Toast 2' });
      toast({ title: 'Toast 3' });
    });
    
    // Should only keep the most recent toast (TOAST_LIMIT = 1)
    expect(result.current.toasts.length).toBeLessThanOrEqual(1);
  });
});

describe('Toast Reducer', () => {
  it('should handle ADD_TOAST action', () => {
    const state = { toasts: [] };
    const action = {
      type: 'ADD_TOAST' as const,
      toast: {
        id: '1',
        title: 'Test',
        open: true,
      },
    };
    
    const newState = reducer(state, action);
    
    expect(newState.toasts).toHaveLength(1);
    expect(newState.toasts[0].title).toBe('Test');
  });

  it('should handle UPDATE_TOAST action', () => {
    const state = {
      toasts: [{
        id: '1',
        title: 'Original',
        open: true,
      }],
    };
    const action = {
      type: 'UPDATE_TOAST' as const,
      toast: {
        id: '1',
        title: 'Updated',
      },
    };
    
    const newState = reducer(state, action);
    
    expect(newState.toasts[0].title).toBe('Updated');
  });

  it('should handle DISMISS_TOAST action', () => {
    const state = {
      toasts: [{
        id: '1',
        title: 'Test',
        open: true,
      }],
    };
    const action = {
      type: 'DISMISS_TOAST' as const,
      toastId: '1',
    };
    
    const newState = reducer(state, action);
    
    expect(newState.toasts[0].open).toBe(false);
  });

  it('should handle REMOVE_TOAST action', () => {
    const state = {
      toasts: [{
        id: '1',
        title: 'Test',
        open: true,
      }],
    };
    const action = {
      type: 'REMOVE_TOAST' as const,
      toastId: '1',
    };
    
    const newState = reducer(state, action);
    
    expect(newState.toasts).toHaveLength(0);
  });
});

