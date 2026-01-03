import { 
  User, Zap, Heart, Star, Ghost, Smile, Crown, 
  Gamepad2, Music, Camera, Rocket, Coffee 
} from 'lucide-react';

// 1. Mapeo de nombres a componentes reales
export const ICON_MAP = {
  'user': User,
  'zap': Zap,
  'heart': Heart,
  'star': Star,
  'ghost': Ghost,
  'smile': Smile,
  'crown': Crown,
  'gamepad': Gamepad2,
  'music': Music,
  'camera': Camera,
  'rocket': Rocket,
  'coffee': Coffee
};

// 2. Colores disponibles (Tailwind-friendly hex codes)
export const AVATAR_COLORS = [
  '#ef4444', // Red 500 (Default)
  '#f97316', // Orange 500
  '#eab308', // Yellow 500
  '#22c55e', // Green 500
  '#06b6d4', // Cyan 500
  '#3b82f6', // Blue 500
  '#8b5cf6', // Violet 500
  '#d946ef', // Fuchsia 500
  '#f43f5e', // Rose 500
  '#64748b', // Slate 500
];