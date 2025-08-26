// Main Media Vault page - Modern Glass Morphism Design
import React, { useState, useEffect } from 'react';
import type { MediaItem, MediaType, MediaStatus, SearchFilters, SortOptions } from '@/types';
import { MediaCard } from '@/components/features';
import { useDebounce } from '@/hooks/useDebounce';

// Mock data for initial testing
const mockStats = {
  total: 0,
  byType: { movie: 0, series: 0, book: 0, game: 0, podcast: 0, youtube: 0, article: 0, music: 0, documentary: 0, other: 0 },
  byStatus: { 'to-watch': 0, watching: 0, completed: 0, abandoned: 0, 'on-hold': 0 },
  byCategory: {},
  favorites: 0,
  completed: 0,
  toWatch: 0
};

export const MediaVaultPage: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortOptions, setSortOptions] = useState<SortOptions>({ field: 'addedAt', direction: 'desc' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [stats, setStats] = useState(mockStats);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    loadMediaItems();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [debouncedSearchTerm, filters, sortOptions, mediaItems]);

  const loadMediaItems = () => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem('mediaVault_items');
      if (stored) {
        const items = JSON.parse(stored);
        setMediaItems(items);
        
        // Calculate real stats
        const realStats = {
          total: items.length,
          byType: { movie: 0, series: 0, book: 0, game: 0, podcast: 0, youtube: 0, article: 0, music: 0, documentary: 0, other: 0 },
          byStatus: { 'to-watch': 0, watching: 0, completed: 0, abandoned: 0, 'on-hold': 0 },
          byCategory: {} as Record<string, number>,
          favorites: 0,
          completed: 0,
          toWatch: 0
        };

        items.forEach((item: MediaItem) => {
          realStats.byType[item.type]++;
          realStats.byStatus[item.status]++;
          realStats.byCategory[item.category] = (realStats.byCategory[item.category] || 0) + 1;
          if (item.isFavorite) realStats.favorites++;
          if (item.status === 'completed') realStats.completed++;
          if (item.status === 'to-watch') realStats.toWatch++;
        });

        setStats(realStats);
      } else {
        setMediaItems([]);
        setStats(mockStats);
      }
    } catch (error) {
      console.error('Error loading media items:', error);
      setMediaItems([]);
      setStats(mockStats);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMediaItems = (items: MediaItem[]) => {
    try {
      localStorage.setItem('mediaVault_items', JSON.stringify(items));
      setMediaItems(items);
    } catch (error) {
      console.error('Error saving media items:', error);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = mediaItems;

    // Apply text search
    if (debouncedSearchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      );
    }

    setFilteredItems(filtered);
  };

  const handleAddMediaItem = (newItem: Omit<MediaItem, 'id' | 'addedAt'>) => {
    try {
      const addedItem: MediaItem = {
        ...newItem,
        id: Date.now().toString(),
        addedAt: new Date().toISOString()
      };
      const updatedItems = [addedItem, ...mediaItems];
      saveMediaItems(updatedItems);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding media item:', error);
    }
  };

  const handleUpdateMediaItem = (id: string, updates: Partial<MediaItem>) => {
    try {
      const updatedItem = mediaItems.find(item => item.id === id);
      if (updatedItem) {
        const newItem = { ...updatedItem, ...updates };
        const updatedItems = mediaItems.map(item => item.id === id ? newItem : item);
        saveMediaItems(updatedItems);
      }
    } catch (error) {
      console.error('Error updating media item:', error);
    }
  };

  const handleDeleteMediaItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const updatedItems = mediaItems.filter(item => item.id !== id);
        saveMediaItems(updatedItems);
      } catch (error) {
        console.error('Error deleting media item:', error);
      }
    }
  };

  const handleToggleFavorite = (id: string) => {
    const item = mediaItems.find(item => item.id === id);
    if (item) {
      handleUpdateMediaItem(id, { isFavorite: !item.isFavorite });
    }
  };

  const handleStatusChange = (id: string, status: MediaStatus) => {
    handleUpdateMediaItem(id, { status });
  };

  const handleExportData = () => {
    const data = JSON.stringify(mediaItems, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `media-vault-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedItems = JSON.parse(e.target?.result as string);
          saveMediaItems(importedItems);
          alert('Data imported successfully');
        } catch (error) {
          alert('Error processing file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold text-blue-400">{mediaItems.length}</div>
            <div className="text-sm text-white/70">Total Items</div>
          </div>
          <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold text-yellow-400">{mediaItems.filter(item => item.status === 'to-watch').length}</div>
            <div className="text-sm text-white/70">To Watch</div>
          </div>
          <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold text-green-400">{mediaItems.filter(item => item.status === 'completed').length}</div>
            <div className="text-sm text-white/70">Completed</div>
          </div>
          <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold text-purple-400">{mediaItems.filter(item => item.isFavorite).length}</div>
            <div className="text-sm text-white/70">Favorites</div>
          </div>
          <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold text-orange-400">{mediaItems.filter(item => item.type === 'movie').length}</div>
            <div className="text-sm text-white/70">Movies</div>
          </div>
          <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold text-emerald-400">{mediaItems.filter(item => item.type === 'series').length}</div>
            <div className="text-sm text-white/70">Series</div>
          </div>
        </div>

        {/* Controls */}
        <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search in your vault..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
                />
              </div>
              
              <select
                value={filters.type || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as MediaType || undefined }))}
                className="backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
              >
                <option value="">All types</option>
                <option value="movie">Movies</option>
                <option value="series">Series</option>
                <option value="book">Books</option>
                <option value="game">Games</option>
                <option value="podcast">Podcasts</option>
                <option value="youtube">YouTube</option>
                <option value="article">Articles</option>
                <option value="music">Music</option>
                <option value="documentary">Documentaries</option>
                <option value="other">Others</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="backdrop-blur-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 px-4 py-2 rounded-xl transition-all duration-300"
              >
                {showAddForm ? 'Cancel' : '➕ Add Item'}
              </button>
              
              <button
                onClick={handleExportData}
                className="backdrop-blur-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 px-4 py-2 rounded-xl transition-all duration-300"
              >
                📤 Export
              </button>
              
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
                <span className="inline-block">
                  <button 
                    className="backdrop-blur-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 px-4 py-2 rounded-xl transition-all duration-300"
                  >
                    📥 Import
                  </button>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Add Media Form */}
        {showAddForm && (
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Add New Media Item</h2>
            <AddMediaForm onSubmit={handleAddMediaItem} />
          </div>
        )}

        {/* Media Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="backdrop-blur-md bg-white/10 rounded-full p-6 border border-white/20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="backdrop-blur-md bg-white/5 rounded-3xl p-12 border border-white/10">
              <div className="text-white/40 mb-6">
                <svg className="mx-auto h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">
                Your vault is empty
              </h3>
              <p className="text-white/70 mb-6">
                {searchTerm ? 'No results found for your search.' : 'Start by adding your first media item!'}
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="backdrop-blur-sm bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:border-white/50 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                >
                  Add First Item
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <MediaCard
                key={item.id}
                item={item}
                onEdit={(item) => {
                  // TODO: Implement edit modal
                  console.log('Edit item:', item);
                }}
                onDelete={handleDeleteMediaItem}
                onToggleFavorite={handleToggleFavorite}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Media item form component
interface AddMediaFormProps {
  onSubmit: (item: Omit<MediaItem, 'id' | 'addedAt'>) => void;
}

const AddMediaForm: React.FC<AddMediaFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    type: 'movie' as MediaType,
    category: 'Movies',
    tags: [] as string[],
    rating: undefined as number | undefined,
    status: 'to-watch' as MediaStatus,
    notes: '',
    imageUrl: '',
    year: undefined as number | undefined,
    duration: '',
    seasons: undefined as number | undefined,
    episodes: undefined as number | undefined,
    author: '',
    platform: '',
    isFavorite: false
  });

  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) return;

    onSubmit(formData);
    // Reset form
    setFormData({
      title: '', description: '', url: '', type: 'movie', category: 'Movies',
      tags: [], rating: undefined, status: 'to-watch', notes: '', imageUrl: '',
      year: undefined, duration: '', seasons: undefined, episodes: undefined,
      author: '', platform: '', isFavorite: false
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">Title *</label>
          <input
            type="text"
            placeholder="Content name..."
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
            className="w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">URL *</label>
          <input
            type="url"
            placeholder="https://..."
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            required
            className="w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as MediaType }))}
            className="w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
          >
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="book">Book</option>
            <option value="game">Game</option>
            <option value="podcast">Podcast</option>
            <option value="youtube">YouTube</option>
            <option value="article">Article</option>
            <option value="music">Music</option>
            <option value="documentary">Documentary</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as MediaStatus }))}
            className="w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
          >
            <option value="to-watch">To Watch</option>
            <option value="watching">Watching</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/90">Description</label>
        <textarea
          placeholder="Describe the content..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">Year</label>
          <input
            type="number"
            placeholder="2024"
            value={formData.year || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value ? parseInt(e.target.value) : undefined }))}
            className="w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">Duration</label>
          <input
            type="text"
            placeholder="2h 30m"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            className="w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">Platform</label>
          <input
            type="text"
            placeholder="Netflix, HBO, etc."
            value={formData.platform}
            onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
            className="w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="block text-sm font-medium text-white/90">Tags</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 backdrop-blur-sm bg-white/20 text-white text-sm rounded-full flex items-center space-x-2 border border-white/20 hover:bg-white/30 transition-all duration-300"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-white/70 hover:text-white transition-colors duration-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Add tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 backdrop-blur-sm bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
          />
          <button 
            type="button" 
            onClick={addTag}
            className="backdrop-blur-sm bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:border-white/50 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
          >
            Add
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.isFavorite}
            onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
            className="w-5 h-5 rounded border-white/30 text-purple-400 focus:ring-purple-400 focus:ring-offset-0 bg-white/10"
          />
          <span className="text-white/90">Mark as favorite</span>
        </label>
        
        <div className="flex items-center space-x-3">
          <span className="text-white/90">Rating:</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                className={`w-7 h-7 text-2xl transition-all duration-300 hover:scale-110 ${
                  star <= (formData.rating || 0) ? 'text-yellow-400' : 'text-white/30'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <button 
          type="submit"
          className="backdrop-blur-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white border border-white/30 hover:from-purple-600 hover:to-pink-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Add to Vault
        </button>
      </div>
    </form>
  );
};
