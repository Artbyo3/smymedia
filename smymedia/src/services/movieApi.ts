// Movie API Service - Secure API Key Handling
// This file shows how to safely integrate with movie databases

// API Configuration
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

// Base URLs
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const OMDB_BASE_URL = 'http://www.omdbapi.com';

// Types for API responses
export interface MovieSearchResult {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  media_type: string;
}

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: Array<{ id: number; name: string }>;
  production_companies: Array<{ name: string }>;
  tagline: string;
}

export interface MovieSearchResponse {
  results: MovieSearchResult[];
  total_results: number;
  total_pages: number;
}

// TMDB API Service
export class TMDBService {
  private static checkApiKey(): void {
    if (!TMDB_API_KEY) {
      throw new Error('TMDB API key not found. Please check your .env file.');
    }
  }

  // Search for movies
  static async searchMovies(query: string, page: number = 1): Promise<MovieSearchResponse> {
    this.checkApiKey();
    
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }

  // Get movie details
  static async getMovieDetails(movieId: number): Promise<MovieDetails> {
    this.checkApiKey();
    
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,images`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting movie details:', error);
      throw error;
    }
  }

  // Get trending movies
  static async getTrendingMovies(timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<MovieSearchResponse> {
    this.checkApiKey();
    
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting trending movies:', error);
      throw error;
    }
  }

  // Get movies by genre
  static async getMoviesByGenre(genreId: number, page: number = 1): Promise<MovieSearchResponse> {
    this.checkApiKey();
    
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting movies by genre:', error);
      throw error;
    }
  }

  // Get available genres
  static async getGenres(): Promise<Array<{ id: number; name: string }>> {
    this.checkApiKey();
    
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.genres;
    } catch (error) {
      console.error('Error getting genres:', error);
      throw error;
    }
  }
}

// OMDB API Service (backup/alternative)
export class OMDBService {
  private static checkApiKey(): void {
    if (!OMDB_API_KEY) {
      throw new Error('OMDB API key not found. Please check your .env file.');
    }
  }

  // Search for movies by title
  static async searchMovies(query: string): Promise<any> {
    this.checkApiKey();
    
    try {
      const response = await fetch(
        `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching movies with OMDB:', error);
      throw error;
    }
  }

  // Get movie details by IMDB ID
  static async getMovieDetails(imdbId: string): Promise<any> {
    this.checkApiKey();
    
    try {
      const response = await fetch(
        `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=full`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting movie details with OMDB:', error);
      throw error;
    }
  }
}

// Utility functions
export const getPosterUrl = (posterPath: string, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string => {
  if (!posterPath) return '';
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
};

export const getBackdropUrl = (backdropPath: string, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string => {
  if (!backdropPath) return '';
  return `https://image.tmdb.org/t/p/${size}${backdropPath}`;
};

// Error handling utility
export class MovieApiError extends Error {
  public statusCode?: number;
  
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'MovieApiError';
    this.statusCode = statusCode;
  }
}

// Rate limiting utility (basic implementation)
class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private timeWindow: number;

  constructor(maxRequests: number = 40, timeWindow: number = 10000) { // 40 requests per 10 seconds
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    
    return false;
  }

  getTimeUntilNextRequest(): number {
    if (this.requests.length === 0) return 0;
    const oldestRequest = Math.min(...this.requests);
    return Math.max(0, this.timeWindow - (Date.now() - oldestRequest));
  }
}

// Create rate limiter instance
export const movieApiRateLimiter = new RateLimiter();
