// Clean SVG icon paths - line-based icons at 24x24 viewBox
// stroke-based design for a premium, clean look

const iconPaths: Record<string, string> = {
  // Navigation
  'home': '<path d="M3 12l9-9 9 9"/><path d="M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10"/>',
  'category': '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
  'message': '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',
  'profile': '<circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/>',
  'search': '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>',
  'back': '<path d="M19 12H5M12 19l-7-7 7-7"/>',

  // Pets
  'paw': '<circle cx="7" cy="7" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="12" cy="4" r="2"/><ellipse cx="12" cy="14" rx="5" ry="4"/>',
  'cat': '<path d="M12 22c4.5 0 7-2.5 7-7V6l-3 2h-8L5 6v9c0 4.5 2.5 7 7 7z"/><circle cx="9.5" cy="12" r="1"/><circle cx="14.5" cy="12" r="1"/><path d="M10 15.5s1 1 2 1 2-1 2-1"/>',
  'dog': '<path d="M12 22c5 0 8-3 8-7v-5l-2-4-3 2H9L6 6 4 10v5c0 4 3 7 8 7z"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><ellipse cx="12" cy="15.5" rx="2" ry="1.5"/>',
  'pet-other': '<circle cx="12" cy="12" r="9"/><path d="M9 9h.01M15 9h.01M8 14s1.5 2 4 2 4-2 4-2"/>',
  'hamster': '<circle cx="12" cy="13" r="8"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M7 5l-1-3M17 5l1-3"/>',
  'fish': '<path d="M6 12c0-3.3 4-6 8-6s4 2.7 4 6-2 6-4 6H8c-2 0-2-2.7-2-6z"/><circle cx="15" cy="11" r="1"/>',
  'bird': '<path d="M16 7c0 3-5 8-5 8s-5-5-5-8a5 5 0 0110 0z"/><path d="M12 15v5M9 18h6"/>',

  // Services
  'medical': '<path d="M18 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z"/><path d="M12 8v8M8 12h8"/>',
  'syringe': '<path d="M18 2l4 4-1 1-4-4zM11 9l6 6M9 11l-6 6v2h2l6-6"/><path d="M13 7L7 13"/>',
  'stethoscope': '<circle cx="12" cy="19" r="3"/><path d="M12 16V8M8 4h8M8 4v3a4 4 0 008 0V4"/>',
  'tooth': '<path d="M12 2c-3 0-5 2-6 5s-1 6 .5 8.5S9 22 10 22s2-3 2-5 0 5 2 5 2.5-4 3.5-6.5S21 10 20 7s-3-5-6-5h-2z"/>',
  'microscope': '<circle cx="12" cy="5" r="3"/><path d="M12 8v4M9 16h6M7 20h10M12 12v4"/>',
  'pill': '<path d="M10.5 1.5l12 12a3 3 0 010 4.24l-2.83 2.83a3 3 0 01-4.24 0l-12-12a3 3 0 010-4.24L6.26 1.5a3 3 0 014.24 0z"/><path d="M8 8l8 8"/>',

  // Grooming
  'scissors': '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/>',
  'bath': '<path d="M4 12h16a1 1 0 011 1v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3a1 1 0 011-1z"/><path d="M6 12V5a2 2 0 012-2h1"/>',
  'sparkle': '<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>',
  'brush': '<path d="M20 4l-8 8M15 7l2 2M4 20l4-1 8-8-3-3-8 8z"/>',

  // Boarding & Walking
  'house': '<path d="M3 12l9-8 9 8"/><rect x="5" y="12" width="14" height="9" rx="1"/><rect x="9" y="16" width="6" height="5"/>',
  'building': '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 6h2M13 6h2M9 10h2M13 10h2M9 14h2M13 14h2M9 18h6"/>',
  'walk': '<circle cx="12" cy="4" r="2"/><path d="M14 10l2 5-3 1M10 10l-2 5 3 1M10 10h4M9 22l2-7M15 22l-2-7"/>',
  'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',

  // Food
  'meat': '<ellipse cx="12" cy="13" rx="7" ry="6"/><circle cx="8" cy="7" r="4"/>',
  'bone': '<path d="M17.2 3.2a2.4 2.4 0 013.4 3.4L9.4 17.8a2.4 2.4 0 01-3.4 0 2.4 2.4 0 010-3.4zM6 6a2.4 2.4 0 010-3.4 2.4 2.4 0 013.4 0M14.6 17.8a2.4 2.4 0 003.4 0 2.4 2.4 0 000-3.4"/>',
  'cookie': '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="9" r="1"/><circle cx="15" cy="9" r="1"/><circle cx="11" cy="14" r="1"/><circle cx="16" cy="13" r="1"/>',
  'snack': '<rect x="5" y="4" width="14" height="16" rx="3"/><path d="M5 9h14M9 4v5M15 4v5"/>',

  // Training
  'graduation': '<path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2.7 3 6 3s6-1 6-3v-5"/>',
  'target': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  'book': '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>',

  // Transport
  'airplane': '<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>',
  'car': '<path d="M5 17h14M7 12h10l2 5H5zM7 12l2-5h6l2 5"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/>',

  // Memorial
  'dove': '<path d="M12 20c0-4 4-8 8-8-1 0-2.5-1-3-2l-1.5-3L12 4l-3.5 3L7 10c-.5 1-2 2-3 2 4 0 8 4 8 8z"/>',
  'candle': '<path d="M9 20h6V10H9z"/><path d="M12 3c-1 2-2 3-2 5a2 2 0 104 0c0-2-1-3-2-5z"/>',
  'rose': '<circle cx="12" cy="10" r="5"/><path d="M12 15v7M8 19h8"/>',
  'tree': '<path d="M12 2L6 10h3l-2 5h3l-2 5h8l-2-5h3l-2-5h3z"/><rect x="11" y="17" width="2" height="5"/>',

  // Commerce
  'cart': '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>',
  'package': '<path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>',
  'tag': '<path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1"/>',
  'money': '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>',
  'coupon': '<path d="M2 9V5a2 2 0 012-2h16a2 2 0 012 2v4a3 3 0 000 6v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a3 3 0 000-6z"/>',
  'trophy': '<path d="M8 21h8M12 17v4M6 3h12v5a6 6 0 01-12 0zM6 5H3v2a3 3 0 003 3M18 5h3v2a3 3 0 01-3 3"/>',

  // Actions
  'heart': '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>',
  'heart-outline': '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="none"/>',
  'star': '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  'star-outline': '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none"/>',
  'share': '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>',
  'camera': '<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>',
  'phone': '<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>',
  'mic': '<path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>',
  'image': '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',

  // UI
  'bell': '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>',
  'fire': '<path d="M12 22c4-2 8-6 8-12 0 0-2 1-4 0s-2-4-4-6c-2 2-2 3-4 6s-4 0-4 0c0 6 4 10 8 12z"/>',
  'settings': '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>',
  'lock': '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
  'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  'moon': '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>',
  'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  'help': '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/>',
  'trash': '<path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>',
  'folder': '<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>',
  'document': '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  'clipboard': '<path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
  'location': '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>',
  'calendar': '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  'clock': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  'eye': '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  'user': '<circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0113 0"/>',
  'refresh': '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>',
  'return': '<path d="M9 14l-5-5 5-5"/><path d="M20 20v-7a4 4 0 00-4-4H4"/>',
  'check': '<path d="M20 6L9 17l-5-5"/>',
  'plus': '<path d="M12 5v14M5 12h14"/>',
  'close': '<path d="M18 6L6 18M6 6l12 12"/>',
  'arrow-down': '<path d="M6 9l6 6 6-6"/>',
  'arrow-right': '<path d="M9 18l6-6-6-6"/>',
  'speaker': '<path d="M11 5L6 9H2v6h4l5 4zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>',
  'tools': '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94z"/>',
  'celebrate': '<path d="M12 2v4M4.93 4.93l2.83 2.83M2 12h4M4.93 19.07l2.83-2.83M12 18v4M16.24 16.24l2.83 2.83M18 12h4M16.24 7.76l2.83-2.83"/>',
  'memo': '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  'exchange': '<path d="M7 16l-4-4 4-4"/><path d="M3 12h18M17 8l4 4-4 4"/>',

  // Specialty
  'lotion': '<rect x="7" y="8" width="10" height="14" rx="2"/><path d="M10 8V5h4v3M12 12v4"/>',
  'tennis': '<circle cx="12" cy="12" r="9"/><path d="M5.64 5.64c3.12 3.12 3.12 8.19 0 11.31M18.36 5.64a8 8 0 010 11.31"/>',
  'paint': '<circle cx="12" cy="12" r="9"/><circle cx="7" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="7" r="1.5" fill="currentColor"/><circle cx="17" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="17" r="1.5" fill="currentColor"/>',
  'broom': '<path d="M12 2v10M5 17c0-2 3-5 7-5s7 3 7 5c0 3-3 5-7 5s-7-2-7-5z"/>',
  'handshake': '<path d="M7 11l-4 4 4 4M17 11l4 4-4 4"/><path d="M3 15h8l4-4h6"/>',
  'male': '<circle cx="10" cy="14" r="5"/><path d="M19 5l-4.5 4.5M19 5h-5M19 5v5"/>',
  'female': '<circle cx="12" cy="9" r="5"/><path d="M12 14v7M9 18h6"/>',
}

export function getIconSvg(name: string, color: string = '#666'): string {
  const paths = iconPaths[name]
  if (!paths) {
    // Fallback: return a simple circle
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="8" fill="none" stroke="${color}" stroke-width="2"/></svg>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
}

// Filled variant for certain icons
export function getFilledIconSvg(name: string, color: string = '#666'): string {
  const paths = iconPaths[name]
  if (!paths) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="8" fill="${color}"/></svg>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="${color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
}
