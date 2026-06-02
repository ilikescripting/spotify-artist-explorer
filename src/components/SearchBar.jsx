import { useState } from 'react';

function SearchBar({ onSearch, loading, onDemoMode }) {
  const [query, setQuery] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (trimmedQuery.length === 0) {
      return;
    }

    onSearch(trimmedQuery);
  }

  function handleQuickSearch(artistName) {
    setQuery(artistName);
    onSearch(artistName);
  }

  return (
    <section className="search-card">
      <form onSubmit={handleSubmit}>
        <label htmlFor="artistSearch">Search for an artist</label>

        <div className="search-row">
          <input
            id="artistSearch"
            type="text"
            value={query}
            placeholder="Example: The Weeknd, Drake, Adele"
            onChange={(event) => setQuery(event.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </form>

      <div className="quick-searches">
        <button type="button" onClick={() => handleQuickSearch('The Weeknd')}>
          The Weeknd
        </button>

        <button type="button" onClick={() => handleQuickSearch('Adele')}>
          Adele
        </button>

        <button type="button" onClick={() => handleQuickSearch('Stormzy')}>
          Stormzy
        </button>

        <button type="button" className="demo-button" onClick={onDemoMode}>
          Load Demo Data
        </button>
      </div>
    </section>
  );
}

export default SearchBar;