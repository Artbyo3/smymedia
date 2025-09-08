import React, { useState, useEffect } from 'react';
import './App.css';
import { MediaVaultPage } from '@/pages/MediaVaultPage';
import type { MediaItem } from '@/types';

// Sidebar navigation items
const navigationItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: '📊',
    description: 'Overview and statistics'
  },
  {
    id: 'vault',
    name: 'Media Vault',
    icon: '🗄️',
    description: 'Manage your media collection'
  },
  {
    id: 'discover',
    name: 'Discover',
    icon: '🔍',
    description: 'Find new content'
  },
  {
    id: 'collections',
    name: 'Collections',
    icon: '📚',
    description: 'Organized content groups'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: '📈',
    description: 'View your media stats'
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '⚙️',
    description: 'App configuration'
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'vault' | 'discover' | 'collections' | 'analytics' | 'settings'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Calculate real storage usage
  const calculateStorageUsage = () => {
    try {
      let totalSize = 0;
      const mediaItems = localStorage.getItem('mediaVault_items');
      const categories = localStorage.getItem('mediaVault_categories');
      const tags = localStorage.getItem('mediaVault_tags');
      const settings = localStorage.getItem('mediaVault_settings');
      
      // Calculate size of each storage item
      if (mediaItems) totalSize += new Blob([mediaItems]).size;
      if (categories) totalSize += new Blob([categories]).size;
      if (tags) totalSize += new Blob([tags]).size;
      if (settings) totalSize += new Blob([settings]).size;
      
      // Convert to MB for display
      const sizeInMB = totalSize / (1024 * 1024);
      const percentage = Math.min((sizeInMB / 5) * 100, 100); // Assuming 5MB max
      
      return {
        used: sizeInMB,
        percentage: percentage,
        items: mediaItems ? JSON.parse(mediaItems).length : 0,
        categories: categories ? JSON.parse(categories).length : 0,
        tags: tags ? JSON.parse(tags).length : 0,
        hasSettings: !!settings
      };
    } catch (error) {
      console.error('Error calculating storage:', error);
      return {
        used: 0,
        percentage: 0,
        items: 0,
        categories: 0,
        tags: 0,
        hasSettings: false
      };
    }
  };

  const storageInfo = calculateStorageUsage();

  const navigateToPage = (pageId: string) => {
    setCurrentPage(pageId as any);
  };

  const renderMainContent = () => {
    switch (currentPage) {
      case 'vault':
        return <MediaVaultPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'discover':
        return <DiscoverPage />;
      case 'collections':
        return <CollectionsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Left Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white/5 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ease-in-out sidebar-transition`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <h1 className="text-white font-bold text-lg">SMYMEDIA</h1>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200"
            >
              {sidebarCollapsed ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigateToPage(item.id)}
              className={`w-full group flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 nav-item sidebar-item ${
                currentPage === item.id
                  ? 'bg-white/20 text-white border border-white/30 shadow-lg active'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!sidebarCollapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="group relative">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer transition-all duration-300 hover:bg-white/10">
                <div className="text-white/70 text-sm">
                  <div className="font-medium">Storage</div>
                  <div className="text-xs opacity-70">{storageInfo.used.toFixed(2)} MB used</div>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300" style={{ width: `${storageInfo.percentage}%` }}></div>
                  </div>
                </div>
              </div>
              
              {/* Detailed Storage Panel - Shows on hover */}
              <div className="absolute bottom-full left-0 mb-2 w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="text-white/90 text-sm">
                  <div className="font-semibold text-white mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                    Storage Details
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="opacity-80">Total Used:</span>
                      <span className="font-medium">{storageInfo.used.toFixed(2)} MB</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="opacity-80">Media Items:</span>
                      <span className="font-medium">{storageInfo.items}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="opacity-80">Categories:</span>
                      <span className="font-medium">{storageInfo.categories}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="opacity-80">Tags:</span>
                      <span className="font-medium">{storageInfo.tags}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="opacity-80">Settings:</span>
                      <span className="font-medium">{storageInfo.hasSettings ? 'Yes' : 'No'}</span>
                    </div>
                    
                    <div className="pt-2 border-t border-white/20">
                      <div className="flex justify-between items-center text-xs opacity-70">
                        <span>Storage Limit:</span>
                        <span>5.00 MB</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300" style={{ width: `${storageInfo.percentage}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-white">
              {navigationItems.find(item => item.id === currentPage)?.name}
            </h2>
            <span className="text-white/50">
              {navigationItems.find(item => item.id === currentPage)?.description}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h6v-2H4v2zM4 11h6V9H4v2zM4 7h6V5H4v2z" />
              </svg>
            </button>
            
            <button className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              U
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="h-[calc(100vh-4rem)] overflow-auto">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

// Placeholder page components
const DashboardPage = () => {
  const [currentView, setCurrentView] = useState<'timeline' | 'grouped'>('timeline');
  const [groupBy, setGroupBy] = useState<'month' | 'quarter' | 'year'>('month');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Local Storage Operations
  const loadMediaItems = () => {
    try {
      const stored = localStorage.getItem('mediaVault_items');
      if (stored) {
        const items = JSON.parse(stored);
        setMediaItems(items);
      } else {
        // Initialize with sample data if no items exist
        const sampleItems: MediaItem[] = [
          {
            id: '1',
            title: 'The Matrix',
            description: 'A computer hacker learns from mysterious rebels about the true nature of his reality.',
            url: 'https://example.com/matrix',
            type: 'movie',
            category: 'Science Fiction',
            tags: ['action', 'sci-fi', 'philosophy'],
            rating: 5,
            status: 'completed',
            addedAt: '2024-01-15T10:30:00Z',
            lastViewed: '2024-01-20T15:45:00Z',
            notes: 'Mind-bending classic that still holds up today.',
            imageUrl: '/images/matrix.jpg',
            year: 1999,
            duration: '2h 16m',
            platform: 'Netflix',
            isFavorite: true
          },
          {
            id: '2',
            title: 'Breaking Bad',
            description: 'A high school chemistry teacher turned methamphetamine manufacturer.',
            url: 'https://example.com/breaking-bad',
            type: 'series',
            category: 'Drama',
            tags: ['crime', 'drama', 'thriller'],
            rating: 5,
            status: 'completed',
            addedAt: '2024-01-10T14:20:00Z',
            lastViewed: '2024-01-25T20:15:00Z',
            notes: 'One of the greatest TV series ever made.',
            imageUrl: '/images/breaking-bad.jpg',
            year: 2008,
            duration: '5 seasons',
            seasons: 5,
            episodes: 62,
            platform: 'Netflix',
            isFavorite: true
          },
          {
            id: '3',
            title: '1984 by George Orwell',
            description: 'A dystopian novel about totalitarianism and surveillance.',
            url: 'https://example.com/1984',
            type: 'book',
            category: 'Literature',
            tags: ['dystopian', 'classic', 'political'],
            rating: 4,
            status: 'completed',
            addedAt: '2024-01-05T09:15:00Z',
            lastViewed: '2024-01-18T16:30:00Z',
            notes: 'Timeless classic that remains relevant.',
            imageUrl: '/images/1984.jpg',
            year: 1949,
            author: 'George Orwell',
            platform: 'Local Library',
            isFavorite: false
          },
          {
            id: '4',
            title: 'Cyberpunk 2077',
            description: 'An open-world action-adventure story set in Night City.',
            url: 'https://example.com/cyberpunk',
            type: 'game',
            category: 'RPG',
            tags: ['rpg', 'cyberpunk', 'open-world'],
            rating: 4,
            status: 'watching',
            addedAt: '2024-01-20T11:45:00Z',
            lastViewed: '2024-01-26T22:00:00Z',
            notes: 'Great story and atmosphere, some bugs remain.',
            imageUrl: '/images/cyberpunk.jpg',
            year: 2020,
            platform: 'Steam',
            isFavorite: false
          },
          {
            id: '5',
            title: 'The Joe Rogan Experience',
            description: 'Long-form conversations with interesting people.',
            url: 'https://example.com/jre',
            type: 'podcast',
            category: 'Talk Show',
            tags: ['podcast', 'conversation', 'long-form'],
            rating: 4,
            status: 'watching',
            addedAt: '2024-01-12T13:00:00Z',
            lastViewed: '2024-01-26T22:00:00Z',
            notes: 'Great for long drives and workouts.',
            imageUrl: '/images/jre.jpg',
            platform: 'Spotify',
            isFavorite: true
          },
          // Add more sample data to demonstrate grouping
          {
            id: '6',
            title: 'Inception',
            description: 'A thief who steals corporate secrets through dream-sharing technology.',
            url: 'https://example.com/inception',
            type: 'movie',
            category: 'Science Fiction',
            tags: ['action', 'sci-fi', 'thriller'],
            rating: 5,
            status: 'completed',
            addedAt: '2023-12-20T16:30:00Z',
            lastViewed: '2023-12-25T19:15:00Z',
            notes: 'Mind-bending masterpiece by Nolan.',
            imageUrl: '/images/inception.jpg',
            year: 2010,
            duration: '2h 28m',
            platform: 'HBO Max',
            isFavorite: true
          },
          {
            id: '7',
            title: 'The Witcher 3: Wild Hunt',
            description: 'An action role-playing game with a gripping story.',
            url: 'https://example.com/witcher3',
            type: 'game',
            category: 'RPG',
            tags: ['rpg', 'fantasy', 'open-world'],
            rating: 5,
            status: 'completed',
            addedAt: '2023-11-15T10:00:00Z',
            lastViewed: '2023-12-10T18:45:00Z',
            notes: 'One of the best RPGs ever made.',
            imageUrl: '/images/witcher3.jpg',
            year: 2015,
            platform: 'Steam',
            isFavorite: true
          },
          {
            id: '8',
            title: 'The Lord of the Rings',
            description: 'Epic fantasy trilogy about a quest to destroy a powerful ring.',
            url: 'https://example.com/lotr',
            type: 'book',
            category: 'Fantasy',
            tags: ['fantasy', 'classic', 'epic'],
            rating: 5,
            status: 'completed',
            addedAt: '2023-10-05T14:20:00Z',
            lastViewed: '2023-11-20T16:30:00Z',
            notes: 'The definitive fantasy epic.',
            imageUrl: '/images/lotr.jpg',
            year: 1954,
            author: 'J.R.R. Tolkien',
            platform: 'Local Library',
            isFavorite: true
          }
        ];
        setMediaItems(sampleItems);
        localStorage.setItem('mediaVault_items', JSON.stringify(sampleItems));
      }
    } catch (error) {
      console.error('Error loading media items:', error);
      setMediaItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save media items to local storage
  const saveMediaItems = (items: MediaItem[]) => {
    try {
      localStorage.setItem('mediaVault_items', JSON.stringify(items));
      setMediaItems(items);
    } catch (error) {
      console.error('Error saving media items:', error);
    }
  };

  // Add new media item
  const addMediaItem = (newItem: Omit<MediaItem, 'id' | 'addedAt'>) => {
    const item: MediaItem = {
      ...newItem,
      id: Date.now().toString(),
      addedAt: new Date().toISOString()
    };
    const updatedItems = [item, ...mediaItems];
    saveMediaItems(updatedItems);
  };

  // Update media item
  const updateMediaItem = (id: string, updates: Partial<MediaItem>) => {
    const updatedItems = mediaItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    saveMediaItems(updatedItems);
  };

  // Delete media item
  const deleteMediaItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedItems = mediaItems.filter(item => item.id !== id);
      saveMediaItems(updatedItems);
    }
  };

  // Load items on component mount
  useEffect(() => {
    loadMediaItems();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      movie: '🎬',
      series: '📺',
      book: '📚',
      game: '🎮',
      podcast: '🎧',
      youtube: '📹',
      article: '📰',
      music: '🎵',
      documentary: '🎥',
      other: '📌'
    };
    return icons[type] || '📌';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'to-watch': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'watching': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'completed': 'bg-green-500/20 text-green-300 border-green-500/30',
      'abandoned': 'bg-red-500/20 text-red-300 border-red-500/30',
      'on-hold': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'to-watch': 'To Watch',
      'watching': 'Watching',
      'completed': 'Completed',
      'abandoned': 'Abandoned',
      'on-hold': 'On Hold'
    };
    return texts[status] || 'Unknown';
  };

  // Sort media items by added date (newest first)
  const sortedMediaItems = [...mediaItems].sort((a, b) => 
    new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  );

  // Group items by time period
  const groupItemsByTime = (items: MediaItem[], groupType: 'month' | 'quarter' | 'year') => {
    const groups: Record<string, MediaItem[]> = {};
    
    items.forEach(item => {
      const date = new Date(item.addedAt);
      let groupKey = '';
      
      if (groupType === 'month') {
        groupKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      } else if (groupType === 'quarter') {
        const quarter = Math.ceil((date.getMonth() + 1) / 3);
        groupKey = `Q${quarter} ${date.getFullYear()}`;
      } else if (groupType === 'year') {
        groupKey = date.getFullYear().toString();
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });
    
    return groups;
  };

  // Pagination
  const totalPages = Math.ceil(sortedMediaItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = sortedMediaItems.slice(startIndex, endIndex);

  // Grouped view data
  const groupedItems = groupItemsByTime(sortedMediaItems, groupBy);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleViewChange = (view: 'timeline' | 'grouped') => {
    setCurrentView(view);
    setCurrentPage(1); // Reset pagination when changing views
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="backdrop-blur-md bg-white/10 rounded-full p-6 border border-white/20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-blue-400">{mediaItems.length}</div>
            <div className="text-white/70">Total Media Items</div>
          </div>
          <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-green-400">{mediaItems.filter(item => item.status === 'completed').length}</div>
            <div className="text-white/70">Completed</div>
          </div>
          <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-yellow-400">{mediaItems.filter(item => item.status === 'watching').length}</div>
            <div className="text-white/70">In Progress</div>
          </div>
          <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-purple-400">{mediaItems.filter(item => item.isFavorite).length}</div>
            <div className="text-white/70">Favorites</div>
          </div>
        </div>
        
        {/* Welcome Section */}
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Welcome to MediaVault</h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Your personal digital sanctuary for organizing and discovering media content. 
            Choose your preferred view to explore your media journey.
          </p>
        </div>

        {/* View Controls */}
        <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-white/70 font-medium">View:</span>
              <div className="flex rounded-lg bg-white/10 p-1">
                <button
                  onClick={() => handleViewChange('timeline')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentView === 'timeline'
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  📅 Timeline
                </button>
                <button
                  onClick={() => handleViewChange('grouped')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentView === 'grouped'
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  📊 Grouped
                </button>
              </div>
            </div>

            {currentView === 'grouped' && (
              <div className="flex items-center space-x-4">
                <span className="text-white/70 font-medium">Group by:</span>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as 'month' | 'quarter' | 'year')}
                  className="backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
                >
                  <option value="month">Month</option>
                  <option value="quarter">Quarter</option>
                  <option value="year">Year</option>
                </select>
              </div>
            )}

            {currentView === 'timeline' && (
              <div className="flex items-center space-x-4">
                <span className="text-white/70 font-medium">Items per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Timeline View */}
        {currentView === 'timeline' && (
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-2xl">📅</span>
              Media Timeline
              <span className="text-sm font-normal text-white/60 ml-2">
                (Showing {startIndex + 1}-{Math.min(endIndex, sortedMediaItems.length)} of {sortedMediaItems.length})
              </span>
            </h3>
            
            <div className="space-y-6">
              {paginatedItems.map((item, index) => (
                <div key={item.id} className="relative">
                  {/* Timeline Line */}
                  {index < paginatedItems.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-16 bg-white/20"></div>
                  )}
                  
                  {/* Timeline Item */}
                  <div className="flex items-start space-x-4">
                    {/* Timeline Dot */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold">
                      {getTypeIcon(item.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                          <p className="text-white/70 text-sm mb-2">{item.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                          {item.rating && (
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400 text-sm">★</span>
                              <span className="text-white/70 text-sm">{item.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-white/60 mb-3">
                        <span className="flex items-center gap-1">
                          <span>📅</span>
                          {formatDate(item.addedAt)}
                        </span>
                        {item.year && (
                          <span className="flex items-center gap-1">
                            <span>📆</span>
                            {item.year}
                          </span>
                        )}
                        {item.duration && (
                          <span className="flex items-center gap-1">
                            <span>⏱️</span>
                            {item.duration}
                          </span>
                        )}
                        {item.platform && (
                          <span className="flex items-center gap-1">
                            <span>🖥️</span>
                            {item.platform}
                          </span>
                        )}
                      </div>
                      
                      {/* Tags */}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 backdrop-blur-sm bg-white/10 text-white/80 text-xs rounded-full border border-white/20"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Notes */}
                      {item.notes && (
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-white/80 text-sm italic">"{item.notes}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              <div className="text-white/60 text-sm">
                Page {currentPage} of {totalPages}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  ← Previous
                </button>
                
                <button
                  onClick={handleLoadMore}
                  disabled={currentPage >= totalPages}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {currentPage >= totalPages ? 'No More Items' : 'Load More'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grouped View */}
        {currentView === 'grouped' && (
          <div className="space-y-6">
            {Object.entries(groupedItems)
              .sort(([a], [b]) => {
                // Sort groups by date (newest first)
                if (groupBy === 'month') {
                  return new Date(b).getTime() - new Date(a).getTime();
                } else if (groupBy === 'quarter') {
                  const [quarterA, yearA] = a.split(' ');
                  const [quarterB, yearB] = b.split(' ');
                  if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
                  return parseInt(quarterB.slice(1)) - parseInt(quarterA.slice(1));
                } else {
                  return parseInt(b) - parseInt(a);
                }
              })
              .map(([groupKey, items]) => (
                <div key={groupKey} className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    {groupKey}
                    <span className="text-sm font-normal text-white/60 ml-2">
                      ({items.length} items)
                    </span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => (
                      <div key={item.id} className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200">
                        <div className="flex items-start space-x-3 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm">
                            {getTypeIcon(item.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white text-sm mb-1 truncate">{item.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                              {getStatusText(item.status)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-white/60 space-y-1">
                          <div>Added: {formatDate(item.addedAt)}</div>
                          {item.rating && <div>Rating: {'★'.repeat(item.rating)}</div>}
                          {item.platform && <div>Platform: {item.platform}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
        
        {/* Empty State */}
        {sortedMediaItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white/40 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-white mb-2">No media items yet</h4>
            <p className="text-white/70">Start building your media collection to see your timeline here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const DiscoverPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating'>('popular');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Example discovery data - in a real app this would come from external APIs
  const discoveryData = {
    movies: [
      {
        id: 'interstellar',
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        type: 'movie',
        category: 'Science Fiction',
        year: 2014,
        rating: 8.6,
        platform: 'Warner Bros.',
        imageUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        tags: ['sci-fi', 'adventure', 'drama'],
        isNew: false,
        tmdbId: 157336,
        posterPath: 'gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        backdropPath: 'xu9zaAevzQ5nnrsXN6JTUyaitkp.jpg',
        voteAverage: 8.6,
        voteCount: 32000,
        popularity: 1000,
        originalTitle: 'Interstellar',
        originalLanguage: 'en'
      }
    ],
    series: [
      {
        id: 'discover_series_1',
        title: 'The Last of Us',
        description: 'After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity\'s last hope.',
        type: 'series',
        category: 'Drama',
        year: 2023,
        rating: 4.9,
        platform: 'HBO Max',
        imageUrl: 'https://example.com/last-of-us.jpg',
        tags: ['drama', 'post-apocalyptic', 'survival'],
        isNew: true
      },
      {
        id: 'discover_series_2',
        title: 'Wednesday',
        description: 'Intelligent, sarcastic and a bit dead inside, Wednesday Addams investigates a murder spree while making new friends at Nevermore Academy.',
        type: 'series',
        category: 'Comedy',
        year: 2022,
        rating: 4.5,
        platform: 'Netflix',
        imageUrl: 'https://example.com/wednesday.jpg',
        tags: ['comedy', 'supernatural', 'mystery'],
        isNew: false
      }
    ],
    books: [
      {
        id: 'discover_book_1',
        title: 'Tomorrow, and Tomorrow, and Tomorrow',
        description: 'A modern love story about two friends who find their way through life together.',
        type: 'book',
        category: 'Fiction',
        year: 2022,
        rating: 4.4,
        platform: 'Local Bookstores',
        imageUrl: 'https://example.com/tomorrow.jpg',
        tags: ['fiction', 'contemporary', 'friendship'],
        isNew: true
      },
      {
        id: 'discover_book_2',
        title: 'Lessons in Chemistry',
        description: 'A scientist in the 1960s becomes a cooking show host and challenges the status quo.',
        type: 'book',
        category: 'Historical Fiction',
        year: 2022,
        rating: 4.3,
        platform: 'Amazon',
        imageUrl: 'https://example.com/chemistry.jpg',
        tags: ['historical', 'feminism', 'science'],
        isNew: false
      }
    ],
    games: [
      {
        id: 'discover_game_1',
        title: 'Baldur\'s Gate 3',
        description: 'An epic role-playing game set in the world of Dungeons & Dragons.',
        type: 'game',
        category: 'RPG',
        year: 2023,
        rating: 4.9,
        platform: 'Steam',
        imageUrl: 'https://example.com/bg3.jpg',
        tags: ['rpg', 'fantasy', 'turn-based'],
        isNew: true
      },
      {
        id: 'discover_game_2',
        title: 'Alan Wake 2',
        description: 'A survival horror game that follows the story of Alan Wake and Saga Anderson.',
        type: 'game',
        category: 'Horror',
        year: 2023,
        rating: 4.7,
        platform: 'Epic Games',
        imageUrl: 'https://example.com/alan-wake2.jpg',
        tags: ['horror', 'survival', 'psychological'],
        isNew: true
      }
    ],
    podcasts: [
      {
        id: 'discover_podcast_1',
        title: 'Lex Fridman Podcast',
        description: 'Conversations about science, technology, history, philosophy and the nature of intelligence.',
        type: 'podcast',
        category: 'Science',
        year: 2024,
        rating: 4.8,
        platform: 'Spotify',
        imageUrl: 'https://example.com/lex.jpg',
        tags: ['science', 'technology', 'philosophy'],
        isNew: false
      },
      {
        id: 'discover_podcast_2',
        title: 'Hardcore History',
        description: 'Dan Carlin\'s long-form historical narrative podcast.',
        type: 'podcast',
        category: 'History',
        year: 2024,
        rating: 4.9,
        platform: 'Apple Podcasts',
        imageUrl: 'https://example.com/hardcore-history.jpg',
        tags: ['history', 'narrative', 'long-form'],
        isNew: false
      }
    ]
  };

  const categories = [
    { id: 'all', name: 'All Media', icon: '🌟', count: Object.values(discoveryData).flat().length },
    { id: 'movies', name: 'Movies', icon: '🎬', count: discoveryData.movies.length },
    { id: 'series', name: 'Series', icon: '📺', count: discoveryData.series.length },
    { id: 'books', name: 'Books', icon: '📚', count: discoveryData.books.length },
    { id: 'games', name: 'Games', icon: '🎮', count: discoveryData.games.length },
    { id: 'podcasts', name: 'Podcasts', icon: '🎧', count: discoveryData.podcasts.length }
  ];

  // Real movie search using TMDB API
  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Import TMDBService dynamically to avoid build issues
      const { TMDBService } = await import('@/services/movieApi');
      const results = await TMDBService.searchMovies(query);
      setSearchResults(results.results || []);
      setApiError(null);
    } catch (error: any) {
      console.error('Search error:', error);
      if (error.message?.includes('API key not found')) {
        setApiError('Movie API not configured. See API_SETUP.md for instructions.');
      } else {
        setApiError(`Search error: ${error.message || 'Unknown error'}`);
      }
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchMovies(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Define the item type that can be either example data or TMDB data
  type DisplayItem = {
    id: string;
    title: string;
    description: string;
    type: string;
    category: string;
    year: string | number;
    rating: string | number;
    platform: string;
    imageUrl: string;
    tags: (string | number)[];
    isNew: boolean;
    // TMDB specific fields (optional)
    tmdbId?: number;
    posterPath?: string;
    backdropPath?: string;
    voteAverage?: number;
    voteCount?: number;
    popularity?: number;
    originalTitle?: string;
    originalLanguage?: string;
  };

  const getFilteredData = (): DisplayItem[] => {
    // If we have search results, show those instead of example data
    if (searchResults.length > 0) {
      return searchResults.map(movie => ({
        id: `tmdb_${movie.id}`,
        title: movie.title,
        description: movie.overview || 'No description available',
        type: 'movie',
        category: movie.genre_ids?.length > 0 ? 'Movie' : 'Unknown',
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown',
        rating: movie.vote_average ? (movie.vote_average / 2).toFixed(1) : 'N/A',
        platform: 'TMDB',
        imageUrl: movie.poster_path || '',
        tags: movie.genre_ids || [],
        isNew: movie.release_date ? new Date(movie.release_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : false,
        // TMDB specific fields
        tmdbId: movie.id,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
        popularity: movie.popularity,
        originalTitle: movie.original_title,
        originalLanguage: movie.original_language
      }));
    }

    // Fallback to example data including Interstellar
    let data = Object.values(discoveryData).flat();
    
    // Transform example data to match DisplayItem structure
    data = data.map(item => ({
      ...item,
      // Ensure posterPath is available for movies with TMDB data
      posterPath: (item as any).posterPath || (item.type === 'movie' && item.imageUrl ? item.imageUrl.replace('https://image.tmdb.org/t/p/w500', '') : undefined),
      // Ensure tmdbId is available for movies with TMDB data
      tmdbId: (item as any).tmdbId || (item.type === 'movie' && (item as any).posterPath ? 157336 : undefined)
    }));
    
    if (selectedCategory !== 'all') {
      data = data.filter(item => item.type === selectedCategory.slice(0, -1));
    }
    
    // Sort data
    switch (sortBy) {
      case 'rating':
        data.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        break;
      case 'recent':
        data.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
        break;
      case 'popular':
      default:
        break;
    }
    
    return data;
  };

  const filteredData = getFilteredData();

  const handleAddToVault = (item: DisplayItem) => {
    if (item.tmdbId) {
      // This is a real TMDB movie
      alert(`"${item.title}" (TMDB ID: ${item.tmdbId}) added to your vault!`);
    } else {
      // This is example data
      alert(`"${item.title}" added to your vault!`);
    }
  };

  // Check if movie API is available (for future integration)
  const checkMovieApiAvailability = () => {
    try {
      // Check if API keys are configured without exposing them
      const hasTmdbKey = !!import.meta.env.VITE_TMDB_API_KEY;
      const hasOmdbKey = !!import.meta.env.VITE_OMDB_API_KEY;
      
      if (!hasTmdbKey && !hasOmdbKey) {
        setApiError('Movie API not configured. See API_SETUP.md for instructions.');
      } else {
        setApiError(null);
      }
    } catch (error) {
      setApiError('Error checking API configuration.');
    }
  };

  useEffect(() => {
    checkMovieApiAvailability();
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">🔍 Discover New Content</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Explore trending movies, series, books, games, and podcasts. 
            Find your next favorite piece of media and add it to your personal vault.
          </p>
          
          {/* API Status */}
          {apiError && (
            <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl text-yellow-200">
              <p className="text-sm">
                <strong>💡 Tip:</strong> {apiError}
              </p>
              <p className="text-xs mt-2 opacity-80">
                Currently showing example data. Configure movie APIs for real-time content!
              </p>
            </div>
          )}
          
        </div>

        {/* Search and Filters */}
        <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search for content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full backdrop-blur-sm bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">
                  🔍
                </div>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popular' | 'recent' | 'rating')}
                className="backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
              >
                <option value="popular">Most Popular</option>
                <option value="recent">Recently Released</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-white/20 text-white border border-white/30 shadow-lg'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
                <span className="text-sm opacity-70">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map((item) => (
            <div key={item.id} className="group backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              {/* Image Display for Movies */}
              <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-t-2xl flex items-center justify-center overflow-hidden">
                {/* Show real TMDB image if available */}
                {item.posterPath && item.type === 'movie' ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Hide image and show icon if it fails to load
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      const iconElement = target.nextElementSibling as HTMLElement;
                      if (iconElement) iconElement.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                {/* Fallback icon when no image or not a movie */}
                <div className={`text-6xl opacity-50 ${item.posterPath && item.type === 'movie' ? 'hidden' : 'flex'}`}>
                  {item.type === 'movie' && '🎬'}
                  {item.type === 'series' && '📺'}
                  {item.type === 'book' && '📚'}
                  {item.type === 'game' && '🎮'}
                  {item.type === 'podcast' && '🎧'}
                </div>
                
                {/* NEW badge */}
                {item.isNew && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    NEW
                  </div>
                )}
                
                {/* Rating badge */}
                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  ⭐ {item.rating}
                </div>
                
                {/* TMDB badge for real movies */}
                {item.tmdbId && (
                  <div className="absolute bottom-3 left-3 bg-blue-500/80 text-white text-xs px-2 py-1 rounded-full">
                    TMDB
                  </div>
                )}
                
                {/* Image indicator for movies with real images */}
                {item.posterPath && item.type === 'movie' && (
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    🖼️
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-white/70 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Meta Information */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>{item.year}</span>
                    <span className="capitalize">{item.type}</span>
                  </div>
                  <div className="text-xs text-white/60">
                    <span>📺 {item.platform}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 backdrop-blur-sm bg-white/10 text-white/80 text-xs rounded-full border border-white/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleAddToVault(item)}
                  className="w-full backdrop-blur-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white border border-white/30 hover:from-purple-600 hover:to-pink-600 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  ➕ Add to Vault
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white/40 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No content found</h3>
            <p className="text-white/70">Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Discovery Tips */}
        <div className="mt-12 backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 text-center">💡 Discovery Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔍</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Explore Categories</h4>
              <p className="text-white/70 text-sm">Browse different media types to discover content you might not have considered.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⭐</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Check Ratings</h4>
              <p className="text-white/70 text-sm">Look for highly-rated content that others have enjoyed.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏷️</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Use Tags</h4>
              <p className="text-white/70 text-sm">Search by specific genres or themes that interest you.</p>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

const CollectionsPage = () => (
  <div className="p-6">
    <div className="max-w-7xl mx-auto">
      <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Collections</h2>
        <p className="text-white/80">Collection management features coming soon...</p>
      </div>
    </div>
  </div>
);

const AnalyticsPage = () => (
  <div className="p-6">
    <div className="max-w-7xl mx-auto">
      <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Analytics</h2>
        <p className="text-white/80">Analytics dashboard coming soon...</p>
      </div>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="p-6">
    <div className="max-w-7xl mx-auto">
      <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
        <p className="text-white/80">Settings panel coming soon...</p>
      </div>
    </div>
  </div>
);

export default App;
