import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReservationBar } from '../../../client/src/components/ReservationBar';

// Mock dependencies
vi.mock('wouter', () => ({
  useLocation: () => ['', vi.fn()],
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: null,
    isLoading: false,
  }),
}));

vi.mock('../../../client/src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1' },
    isAuthenticated: true,
  }),
}));

describe('ReservationBar Component', () => {
  const mockCar = {
    id: '1',
    title: 'Test Car',
    pricePerDay: 50,
    currency: 'GBP',
    location: 'London',
    owner: {
      id: 'owner1',
      firstName: 'John',
      lastName: 'Doe',
      rating: 4.5,
    },
    rating: 4.5,
    reviewCount: 10,
  };

  const mockOnBook = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render reservation bar with car details', () => {
    render(<ReservationBar car={mockCar} onBook={mockOnBook} />);
    
    expect(screen.getByText('Book This Vehicle')).toBeInTheDocument();
    expect(screen.getByText(/£50/i)).toBeInTheDocument();
  });

  it('should disable Book Now button when dates are not selected', () => {
    render(<ReservationBar car={mockCar} onBook={mockOnBook} />);
    
    const bookButton = screen.getByRole('button', { name: /book now/i });
    expect(bookButton).toBeDisabled();
  });

  it('should enable Book Now button when both dates are selected', async () => {
    render(<ReservationBar car={mockCar} onBook={mockOnBook} />);
    
    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    fireEvent.change(startDateInput, {
      target: { value: tomorrow.toISOString().split('T')[0] },
    });
    
    fireEvent.change(endDateInput, {
      target: { value: dayAfter.toISOString().split('T')[0] },
    });
    
    await waitFor(() => {
      const bookButton = screen.getByRole('button', { name: /book now/i });
      expect(bookButton).not.toBeDisabled();
    });
  });

  it('should show error when end date is before start date', async () => {
    render(<ReservationBar car={mockCar} onBook={mockOnBook} />);
    
    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() + 1);
    
    fireEvent.change(startDateInput, {
      target: { value: tomorrow.toISOString().split('T')[0] },
    });
    
    fireEvent.change(endDateInput, {
      target: { value: yesterday.toISOString().split('T')[0] },
    });
    
    await waitFor(() => {
      expect(screen.getByText(/start date must be before end date/i)).toBeInTheDocument();
    });
  });
});



