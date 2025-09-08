// MediaCard component to display media items with Glass Morphism Design
import React from 'react';
import type { MediaItem, MediaType, MediaStatus } from '@/types';
import { formatDate, truncateText } from '@/utils/helpers';

interface MediaCardProps {
  item: MediaItem;
  onEdit?: (item: MediaItem) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onStatusChange?: (id: string, status: MediaStatus) => void;
}

const getTypeIcon = (type: MediaType): string => {
  const icons: Record<MediaType, string> = {
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

const getStatusColor = (status: MediaStatus): string => {
  const colors: Record<MediaStatus, string> = {
    'to-watch': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'watching': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'completed': 'bg-green-500/20 text-green-300 border-green-500/30',
    'abandoned': 'bg-red-500/20 text-red-300 border-red-500/30',
    'on-hold': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  };
  return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};

const getStatusText = (status: MediaStatus): string => {
  const texts: Record<MediaStatus, string> = {
    'to-watch': 'To Watch',
    'watching': 'Watching',
    'completed': 'Completed',
    'abandoned': 'Abandoned',
    'on-hold': 'On Hold'
  };
  return texts[status] || 'Unknown';
};

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleFavorite,
  onStatusChange,
}) => {
  const handleOpenUrl = () => {
    window.open(item.url, '_blank');
  };

  const handleToggleFavorite = () => {
    onToggleFavorite?.(item.id);
  };

  const handleStatusChange = (newStatus: MediaStatus) => {
    onStatusChange?.(item.id, newStatus);
  };

  return (
    <div className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl backdrop-blur-sm bg-white/10 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
              {getTypeIcon(item.type)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 leading-tight">
                {item.title}
              </h3>
              <div className="flex items-center space-x-3 text-sm text-white/70">
                <span className="backdrop-blur-sm bg-white/10 px-2 py-1 rounded-lg border border-white/20">
                  {item.category}
                </span>
                {item.year && (
                  <span className="backdrop-blur-sm bg-white/10 px-2 py-1 rounded-lg border border-white/20">
                    {item.year}
                  </span>
                )}
                {item.duration && (
                  <span className="backdrop-blur-sm bg-white/10 px-2 py-1 rounded-lg border border-white/20">
                    {item.duration}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
                item.isFavorite 
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                  : 'bg-white/10 text-white/60 border border-white/20 hover:bg-white/20 hover:text-white/80'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill={item.isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
            
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="p-2 rounded-lg backdrop-blur-sm bg-white/10 text-white/60 border border-white/20 hover:bg-white/20 hover:text-white/80 transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 rounded-lg backdrop-blur-sm bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-white/80 mb-4 line-clamp-2 leading-relaxed">
            {truncateText(item.description, 120)}
          </p>
        )}
        
        {/* Status and Rating */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
              {getStatusText(item.status)}
            </span>
            {item.rating && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white/70">Rating:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= item.rating! ? 'text-yellow-400' : 'text-white/30'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 backdrop-blur-sm bg-white/10 text-white/80 text-xs rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="px-3 py-1 backdrop-blur-sm bg-white/10 text-white/80 text-xs rounded-full border border-white/20">
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          {/* Platform */}
          {item.platform && (
            <div className="text-sm text-white/70">
              <span className="font-medium">Platform:</span> {item.platform}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-white/60">
            Added: {formatDate(item.addedAt)}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleOpenUrl}
              className="backdrop-blur-sm bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:border-white/50 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            >
              Open Link
            </button>
            
            {onStatusChange && (
              <select
                value={item.status}
                onChange={(e) => handleStatusChange(e.target.value as MediaStatus)}
                className="backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
              >
                <option value="to-watch">To Watch</option>
                <option value="watching">Watching</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
                <option value="abandoned">Abandoned</option>
              </select>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
