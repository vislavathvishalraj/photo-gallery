
import { useCallback, useMemo, useState } from 'react'
import useFetchPhotos from './hooks/useEffectPhoto'
import useFavourites from './hooks/useFavourite'

function App() {
  const { photos, loading, error } = useFetchPhotos()
  const [search, setSearch] = useState('')
  const { favourites, toggleFavourite } = useFavourites()

  // Handles changes in the search input
  const handleSearch = useCallback((event) => {
    setSearch(event.target.value)
  }, [])

  // Filters the already-fetched photos by author
  const filteredPhotos = useMemo(() => {
    const query = search.trim().toLowerCase()

    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(query)
    )
  }, [photos, search])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
          role="status"
          aria-label="Loading photos"
        />
      </main>
    )
  }

  if (error) {
    return (
      <main className="p-6 text-center">
        <p className="text-red-600">
          Failed to load photos: {error}
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Photo Gallery
        </h1>

        <input
          type="search"
          placeholder="Search by author name..."
          value={search}
          onChange={handleSearch}
          aria-label="Search photos by author"
          className="mb-6 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:max-w-md"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredPhotos.map((photo) => {
            const isFavourite = favourites.includes(photo.id)

            return (
              <article
                key={photo.id}
                className="overflow-hidden rounded-lg bg-white shadow-sm"
              >
                {/* Fixed 4:3 image container */}
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={photo.download_url}
                    alt={`Photo by ${photo.author}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="flex items-center justify-between p-4">
                  <p className="truncate font-medium text-gray-800">
                    {photo.author}
                  </p>

                  <button
                    type="button"
                    onClick={() => toggleFavourite(photo.id)}
                    aria-label={
                      isFavourite
                        ? `Remove ${photo.author} from favourites`
                        : `Add ${photo.author} to favourites`
                    }
                    aria-pressed={isFavourite}
                    className={`ml-3 text-2xl transition-colors ${
                      isFavourite
                        ? 'text-red-500'
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    {isFavourite ? '♥' : '♡'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        {filteredPhotos.length === 0 && (
          <p className="py-10 text-center text-gray-600">
            No photos found for "{search}".
          </p>
        )}
      </div>
    </main>
  )
}

export default App
