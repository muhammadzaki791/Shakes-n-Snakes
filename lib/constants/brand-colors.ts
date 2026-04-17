export const brandColors = {
  primary: '#FF2D78',
  primaryHover: '#E6005C',
  secondary: '#0D0D0D',
  accentYellow: '#FFD60A',
  accentCyan: '#00E5FF',
  accentOrange: '#FF6B35',
  bgMain: '#111111',
  bgCard: '#1A1A1A',
  bgElevated: '#242424',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#6B6B6B',
  success: '#39FF14',
  error: '#FF3333',
} as const

export const badgeVariants = {
  bestseller: { bg: 'bg-[#FFD60A]', text: 'text-[#0D0D0D]' },
  new: { bg: 'bg-[#39FF14]', text: 'text-[#0D0D0D]' },
  spicy: { bg: 'bg-[#FF3333]', text: 'text-white' },
  vegan: { bg: 'bg-[#00C853]', text: 'text-white' },
  hot: { bg: 'bg-[#FF6B35]', text: 'text-white' },
  cold: { bg: 'bg-[#00E5FF]', text: 'text-[#0D0D0D]' },
  "chef's special": { bg: 'bg-[#FF2D78]', text: 'text-white' },
  seasonal: { bg: 'bg-[#FFD60A]', text: 'text-[#0D0D0D]' },
  default: { bg: 'bg-brand-elevated', text: 'text-brand-text-secondary' },
} as const

export type BadgeVariantKey = keyof typeof badgeVariants
