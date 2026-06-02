function ArtistCard({ artist, onSelect, onFavourite, isSelected }) {
  const imageUrl = artist.images?.[0]?.url || 'https://placehold.co/300x300?text=Artist';

  return (
    <article className={`artist-card ${isSelected ? 'selected' : ''}`}>
      <img src={imageUrl} alt={artist.name} />

      <div className="artist-card-content">
        <h3>{artist.name}</h3>

        <p>
          <strong>Popularity:</strong> {artist.popularity}/100
        </p>

        <p>
          <strong>Followers:</strong>{' '}
          {artist.followers?.total?.toLocaleString() || 'N/A'}
        </p>

        <p className="genres">
          {artist.genres?.length > 0 ? artist.genres.slice(0, 3).join(', ') : 'No genres listed'}
        </p>

        <div className="card-actions">
          <button type="button" onClick={() => onSelect(artist)}>
            View Details
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => onFavourite(artist)}
          >
            Save
          </button>
        </div>
      </div>
    </article>
  );
}

export default ArtistCard;