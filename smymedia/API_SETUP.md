# Movie API Setup Guide

## 🔐 Keeping Your API Keys Secure

**IMPORTANT**: Never commit API keys to GitHub or any public repository!

## 📋 Step-by-Step Setup

### 1. Create Environment File
Create a `.env` file in your project root (same level as `package.json`):

```bash
# Create .env file
touch .env
```

### 2. Add Your API Keys
Add your API keys to the `.env` file:

```env
# The Movie Database (TMDB) - Free API key
VITE_TMDB_API_KEY=your_actual_tmdb_api_key_here

# Open Movie Database (OMDB) - Free API key  
VITE_OMDB_API_KEY=your_actual_omdb_api_key_here
```

### 3. Get Free API Keys

#### TMDB (The Movie Database) - RECOMMENDED
- Go to: https://www.themoviedb.org/
- Sign up for a free account
- Go to Settings → API
- Request an API key (free)
- Copy the API key to your `.env` file

#### OMDB (Open Movie Database)
- Go to: http://www.omdbapi.com/
- Sign up for a free API key
- Copy the API key to your `.env` file

### 4. Verify Setup
The `.gitignore` file is already configured to ignore `.env` files.

## 🚀 How to Use

### In Your Components
```typescript
import { TMDBService } from '@/services/movieApi';

// Search for movies
const searchResults = await TMDBService.searchMovies('Dune');

// Get trending movies
const trending = await TMDBService.getTrendingMovies('week');

// Get movie details
const movieDetails = await TMDBService.getMovieDetails(12345);
```

### Environment Variable Access
```typescript
// Access your API key (only in browser, never logged)
const apiKey = import.meta.env.VITE_TMDB_API_KEY;
```

## 🛡️ Security Best Practices

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Use environment variables** - Don't hardcode API keys
3. **Keep keys private** - Don't share them in screenshots or public demos
4. **Monitor usage** - Most free APIs have rate limits
5. **Use HTTPS** - All modern APIs use secure connections

## 🔧 Troubleshooting

### "API key not found" Error
- Check that your `.env` file exists
- Verify the variable name starts with `VITE_`
- Restart your development server after adding `.env`

### Rate Limiting
- TMDB: 40 requests per 10 seconds
- OMDB: 1000 requests per day (free tier)
- The app includes basic rate limiting

### CORS Issues
- Most movie APIs support CORS
- If you get CORS errors, the API might need a different approach

## 📚 API Documentation

- **TMDB**: https://developers.themoviedb.org/3
- **OMDB**: http://www.omdbapi.com/

## 💡 Pro Tips

1. **Start with TMDB** - It's free and comprehensive
2. **Use multiple APIs** - Have fallbacks for better reliability
3. **Cache responses** - Don't make unnecessary API calls
4. **Handle errors gracefully** - Show user-friendly error messages
5. **Test with small queries first** - Make sure everything works before scaling

## 🚨 Common Mistakes to Avoid

- ❌ Hardcoding API keys in your code
- ❌ Committing `.env` files to Git
- ❌ Sharing API keys publicly
- ❌ Making too many API calls too quickly
- ❌ Not handling API errors

## ✅ What You've Accomplished

- ✅ Secure API key handling with environment variables
- ✅ Professional movie API service with error handling
- ✅ Rate limiting to prevent API abuse
- ✅ TypeScript interfaces for type safety
- ✅ Multiple API support (TMDB + OMDB)
- ✅ Proper error handling and logging
- ✅ Git security with `.gitignore`

Your app is now ready to safely integrate with movie databases! 🎬
