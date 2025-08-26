// Types for Media Vault - Local storage system for media links
export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: MediaType;
  category: string;
  tags: string[];
  rating?: number; // 1-5 stars
  status: MediaStatus;
  addedAt: string;
  lastViewed?: string;
  notes?: string;
  imageUrl?: string;
  year?: number;
  duration?: string; // For movies/series
  seasons?: number; // For series
  episodes?: number; // For series
  author?: string; // For books
  platform?: string; // Netflix, HBO, etc.
  isFavorite: boolean;
}

export type MediaType =
  | 'movie'
  | 'series'
  | 'book'
  | 'game'
  | 'podcast'
  | 'youtube'
  | 'article'
  | 'music'
  | 'documentary'
  | 'other';

export type MediaStatus =
  | 'to-watch'
  | 'watching'
  | 'completed'
  | 'abandoned'
  | 'on-hold';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  count: number;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
  color: string;
}

export interface MediaStats {
  total: number;
  byType: Record<MediaType, number>;
  byStatus: Record<MediaStatus, number>;
  byCategory: Record<string, number>;
  favorites: number;
  completed: number;
  toWatch: number;
}

export interface SearchFilters {
  type?: MediaType;
  status?: MediaStatus;
  category?: string;
  tags?: string[];
  rating?: number;
  year?: number;
  platform?: string;
  isFavorite?: boolean;
}

export interface SortOptions {
  field: 'title' | 'addedAt' | 'lastViewed' | 'rating' | 'year';
  direction: 'asc' | 'desc';
}
