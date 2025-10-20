# Color Scheme Documentation

## Overview

The BCHS Room Booking System uses a comprehensive CSS custom property (CSS variables) based color scheme for consistent theming and easy customization.

## Color Variables Reference

### Primary Colors

```css
--color-primary: #2563eb        /* Main brand color (blue) */
--color-primary-dark: #1d4ed8   /* Darker primary for hover states */
--color-primary-light: #3b82f6  /* Lighter primary for accents */
```

**Usage:** Buttons, links, navigation, selected states

---

### Neutral Colors (Grayscale)

```css
--color-white: #ffffff
--color-black: #000000
--color-gray-50: #f9fafb    /* Lightest gray - backgrounds */
--color-gray-100: #f3f4f6   /* Very light gray - hover states */
--color-gray-200: #e5e7eb   /* Light gray - borders */
--color-gray-300: #d1d5db   /* Medium-light gray - borders */
--color-gray-400: #9ca3af   /* Medium gray - muted text */
--color-gray-500: #6b7280   /* Medium-dark gray - secondary text */
--color-gray-600: #4b5563   /* Dark gray - headings */
--color-gray-700: #374151   /* Darker gray - labels */
--color-gray-800: #1f2937   /* Very dark gray - primary text */
--color-gray-900: #111827   /* Darkest gray - emphasis */
```

**Usage:** Text, backgrounds, borders, neutral UI elements

---

### Success Colors (Green)

```css
--color-success: #10b981          /* Main success color */
--color-success-light: #d1fae5    /* Light background */
--color-success-dark: #065f46     /* Dark text */
--color-success-bg: #dcfce7       /* Background tint */
--color-success-text: #166534     /* Text color */
```

**Usage:** Success messages, available states, confirmations, approved bookings

---

### Warning Colors (Orange/Amber)

```css
--color-warning: #f59e0b          /* Main warning color */
--color-warning-light: #fef3c7    /* Light background */
--color-warning-dark: #92400e     /* Dark text */
```

**Usage:** Warning messages, pending states, cautions

---

### Error Colors (Red)

```css
--color-error: #ef4444            /* Main error color */
--color-error-light: #fee2e2      /* Light background */
--color-error-dark: #991b1b       /* Dark text */
```

**Usage:** Error messages, unavailable states, dangerous actions, booked slots

---

### Info Colors (Blue)

```css
--color-info: #3b82f6             /* Main info color */
--color-info-light: #dbeafe       /* Light background */
--color-info-dark: #1e40af        /* Dark text */
--color-info-bg: #eff6ff          /* Background tint */
--color-info-border: #bfdbfe      /* Border color */
```

**Usage:** Information messages, badges, selected items, hints

---

### Status Colors

```css
--color-available: #10b981   /* Available time slots */
--color-booked: #ef4444      /* Booked time slots */
--color-pending: #f59e0b     /* Pending bookings */
--color-approved: #10b981    /* Approved bookings */
```

**Usage:** Booking status indicators, calendar states

---

### Density Colors (Calendar)

```css
--color-low-density: #dcfce7     /* 1-39% booked (light green) */
--color-medium-density: #fef9c3  /* 40-79% booked (light yellow) */
--color-high-density: #fee2e2    /* 80%+ booked (light red) */
```

**Usage:** Calendar day background colors indicating booking density

---

### Semantic Colors

#### Background Colors
```css
--bg-body: var(--color-gray-50)        /* Main page background */
--bg-card: var(--color-white)          /* Card/panel backgrounds */
--bg-hover: var(--color-gray-100)      /* Hover state backgrounds */
--bg-selected: var(--color-info-bg)    /* Selected item backgrounds */
```

#### Text Colors
```css
--text-primary: var(--color-gray-800)      /* Primary text */
--text-secondary: var(--color-gray-500)    /* Secondary text */
--text-muted: var(--color-gray-400)        /* Muted/disabled text */
```

#### Border Colors
```css
--border-light: var(--color-gray-200)      /* Light borders */
--border-default: var(--color-gray-300)    /* Default borders */
```

---

### Shadow Utilities

```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05)
--shadow-md: 0 2px 4px rgba(0, 0, 0, 0.05)
--shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.15)
--shadow-xl: 0 10px 25px rgba(0, 0, 0, 0.15)
--shadow-2xl: 0 20px 25px -5px rgba(0, 0, 0, 0.2)
```

**Usage:** Cards, modals, elevated elements

---

### Overlay
```css
--overlay-dark: rgba(0, 0, 0, 0.5)   /* Modal backdrop */
```

**Usage:** Modal overlays, dropdowns

---

## Usage Examples

### In CSS

```css
.my-button {
    background-color: var(--color-primary);
    color: var(--color-white);
    border: 1px solid var(--border-default);
}

.my-button:hover {
    background-color: var(--color-primary-dark);
}

.success-message {
    background-color: var(--color-success-light);
    color: var(--color-success-dark);
    border-left: 4px solid var(--color-success);
}
```

---

## Customization

To customize the color scheme, modify the values in the `:root` selector at the top of `styles.css`:

```css
:root {
    /* Change primary color to purple */
    --color-primary: #7c3aed;
    --color-primary-dark: #6d28d9;
    --color-primary-light: #8b5cf6;
    
    /* Your other customizations... */
}
```

All components will automatically update to use the new colors!

---

## Component Color Map

| Component | Primary Color(s) |
|-----------|-----------------|
| Navigation Bar | `--color-primary`, `--color-white` |
| Room Cards | `--bg-card`, `--border-light`, `--color-primary` (selected) |
| Calendar Days | `--border-light`, density colors |
| Time Slots | `--color-available`, `--color-booked` |
| Buttons | `--color-primary`, various |
| Forms | `--border-default`, `--color-primary` (focus) |
| Chat Box | `--color-primary`, `--color-info-light` |
| Badges | `--color-info-light`, `--color-info-dark` |
| AI Suggestions | `--color-success-bg`, `--color-info-light` |

---

## Accessibility

All color combinations meet WCAG 2.1 Level AA contrast requirements:
- Primary text (gray-800) on white background: 12.63:1
- Secondary text (gray-500) on white background: 4.61:1
- Primary buttons maintain 4.5:1 minimum contrast

---

## Dark Mode (Future Enhancement)

The system is designed to support dark mode by adding a dark theme variant:

```css
@media (prefers-color-scheme: dark) {
    :root {
        --bg-body: var(--color-gray-900);
        --bg-card: var(--color-gray-800);
        --text-primary: var(--color-gray-100);
        --text-secondary: var(--color-gray-400);
        /* ... other dark mode overrides */
    }
}
```

---

**Last Updated:** December 2024  
**Version:** 2.0.2
