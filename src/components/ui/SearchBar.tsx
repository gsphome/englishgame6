import React, { useId } from 'react';
import { Search, X } from 'lucide-react';
import '../../styles/components/search-bar.css';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  placeholder = 'Search modules...',
  disabled = false,
}) => {
  const searchId = useId();
  const clearButtonId = useId();

  return (
    <div className="search-bar" role="search">
      <label htmlFor={searchId} className="sr-only">
        Search learning modules
      </label>
      <div className="search-bar__icon" aria-hidden="true">
        <Search className="search-bar__icon-svg" />
      </div>
      <input
        id={searchId}
        type="search"
        inputMode="search"
        name="search"
        value={query}
        onChange={e => onQueryChange(e.target.value)}
        className="search-bar__input"
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        data-form-type="other"
        data-lpignore="true"
        data-1p-ignore="true"
        aria-describedby={query ? clearButtonId : undefined}
        aria-label="Search learning modules by name, category, or topic"
      />
      {query && !disabled && (
        <button
          id={clearButtonId}
          onClick={() => onQueryChange('')}
          className="search-bar__clear"
          aria-label={`Clear search query: ${query}`}
          type="button"
        >
          <X className="search-bar__clear-icon" />
        </button>
      )}
    </div>
  );
};
