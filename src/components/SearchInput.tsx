import React, { useState } from 'react';
import { Search} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchInput: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/response?q=${encodeURIComponent(query.trim())}`);
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative max-w-2xl mx-auto transition-all duration-300 ${
        isFocused ? 'scale-105' : ''
      }`}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask HeyA! Freely..."
        className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 rounded-full py-4 pl-6 pr-12 outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <button 
        type="submit"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Search"
      >
        <Search className="h-5 w-5 text-gray-400" />

      </button>
    </form>
  );
};

export default SearchInput;