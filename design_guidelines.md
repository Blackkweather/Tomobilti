# Design Guidelines for Moroccan Car Rental Platform

## Design Approach
**Reference-Based Approach** - Drawing inspiration from Airbnb's proven marketplace design patterns, adapted for the Moroccan car rental market. This approach suits our experience-focused, visual-rich platform where trust and appealing presentation drive bookings.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Deep Green: 150 60% 35% (representing Morocco's flag and prosperity)
- Warm Red: 0 70% 45% (complementing the Moroccan flag)

**Supporting Colors:**
- Neutral backgrounds: 220 10% 97% (light mode), 220 15% 10% (dark mode)
- Text: 220 15% 15% (light mode), 220 10% 90% (dark mode)
- Success: 142 71% 45%
- Warning: 38 92% 50%

**Gradients:** Subtle green-to-teal gradients (150 60% 35% to 180 50% 40%) for hero sections and call-to-action areas.

### Typography
**Primary Font:** Inter via Google Fonts
- Headers: 600-700 weight
- Body: 400-500 weight
- UI elements: 500 weight

**Arabic Support:** Prepare structure for future Arabic font integration (Noto Sans Arabic)

### Layout System
**Tailwind Spacing Units:** Consistent use of 4, 6, 8, 12, 16, and 24 for spacing
- Small gaps: 4
- Standard spacing: 8
- Section padding: 16
- Large margins: 24

### Component Library

**Navigation:**
- Clean header with logo, search bar, and user menu
- Sticky navigation on scroll
- Mobile hamburger menu

**Car Cards:**
- High-quality car images with overlay pricing in MAD
- Fuel type badges (Essence, Diesel, Électrique, Hybride)
- Location and availability indicators
- Star ratings prominently displayed

**Search & Filters:**
- Map integration for Moroccan cities (Casablanca, Rabat, Marrakech, Fes, Tangier)
- Date range picker with Moroccan date formatting
- Fuel type toggle buttons
- Price range slider in MAD currency

**Booking Interface:**
- Clear pricing breakdown in Dirhams
- Calendar availability with blocked dates
- Instant book vs. request to book options
- Trust indicators (verified profiles, reviews)

**Dashboards:**
- Owner dashboard: earnings charts in MAD, listing management
- Renter dashboard: booking history, favorites
- Clean data visualization with Moroccan market context

### Images
**Hero Section:** Large hero image featuring a scenic Moroccan landscape (Atlas Mountains or coastal road) with a modern car, overlaid with search functionality.

**Car Listings:** Multiple high-quality photos per vehicle, including interior, exterior, and documentation shots.

**Trust Signals:** Profile photos for car owners, verification badges, and review photos.

**City Backgrounds:** Subtle background images of major Moroccan cities for location-specific pages.

### Key Features
- Currency display consistently in MAD (Moroccan Dirhams)
- French language preparation in UI text
- Mobile-first responsive design
- Trust and safety emphasis through reviews and verification
- Clean, Airbnb-inspired card layouts with Moroccan visual identity

### Visual Hierarchy
- Bold headers with the deep green primary color
- Ample whitespace following the 8-unit spacing system
- Card-based layouts with subtle shadows
- Clear call-to-action buttons with the warm red accent
- Status indicators using the success/warning color palette

This design creates a trustworthy, locally-relevant platform that feels both international and distinctly Moroccan.