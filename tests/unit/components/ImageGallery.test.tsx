import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ImageGallery from '../../../client/src/components/ImageGallery';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ChevronLeft: () => <div data-testid="chevron-left">←</div>,
  ChevronRight: () => <div data-testid="chevron-right">→</div>,
}));

describe('ImageGallery Component', () => {
  const mockImages = [
    '/assets/car1.jpg',
    '/assets/car2.jpg',
    '/assets/car3.jpg',
  ];

  it('should render gallery with images', () => {
    render(<ImageGallery images={mockImages} alt="Test Car" />);
    
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should display first image by default', () => {
    render(<ImageGallery images={mockImages} alt="Test Car" />);
    
    const mainImage = screen.getByAltText(/Test Car.*Image 1/i);
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute('src', mockImages[0]);
  });

  it('should navigate to next image', () => {
    render(<ImageGallery images={mockImages} alt="Test Car" />);
    
    const nextButton = screen.getByTestId('chevron-right');
    fireEvent.click(nextButton);
    
    // After clicking next, should show second image
    const mainImage = screen.getByAltText(/Test Car.*Image 2/i);
    expect(mainImage).toHaveAttribute('src', mockImages[1]);
  });

  it('should navigate to previous image', () => {
    render(<ImageGallery images={mockImages} alt="Test Car" />);
    
    // First go to second image
    const nextButton = screen.getByTestId('chevron-right');
    fireEvent.click(nextButton);
    
    // Then go back
    const prevButton = screen.getByTestId('chevron-left');
    fireEvent.click(prevButton);
    
    // Should be back to first image
    const mainImage = screen.getByAltText(/Test Car.*Image 1/i);
    expect(mainImage).toHaveAttribute('src', mockImages[0]);
  });

  it('should wrap around when navigating past last image', () => {
    render(<ImageGallery images={mockImages} alt="Test Car" />);
    
    // Go to last image
    const nextButton = screen.getByTestId('chevron-right');
    fireEvent.click(nextButton); // Image 2
    fireEvent.click(nextButton); // Image 3
    
    // Click next again should wrap to first
    fireEvent.click(nextButton);
    
    const mainImage = screen.getByAltText(/Test Car.*Image 1/i);
    expect(mainImage).toHaveAttribute('src', mockImages[0]);
  });

  it('should handle single image', () => {
    render(<ImageGallery images={[mockImages[0]]} alt="Test Car" />);
    
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should handle empty images array', () => {
    render(<ImageGallery images={[]} alt="Test Car" />);
    
    // Should render without crashing
    expect(screen.getByText(/no images/i) || screen.queryByRole('img')).toBeDefined();
  });
});



