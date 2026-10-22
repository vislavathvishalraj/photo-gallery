
import { useCallback, useMemo, useState } from 'react'
import { Heart, Image as ImageIcon, Search } from 'lucide-react'
import useFetchPhotos from './hooks/useEffectPhoto'
import useFavourites from './hooks/useFavourite'

function PhotoCard({ photo, isFavourite, onToggle }) {
  return (
    <article className="group min-w-0 overflow-hidden rounded-[1.35rem] border border-stone-200/80 bg-white shadow-[0_10px_30px_-22px_rgba(58,42,31,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_-22px_rgba(58,42,31,0.5)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={photo.download_url || `https://picsum.photos/id/${photo.id}/800/600`}
          alt={`Photo by ${photo.author}`}
          className="block size-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            isFavourite
              ? `Remove ${photo.author} from favourites`
              : `Add ${photo.author} to favourites`
          }
          aria-pressed={isFavourite}
          className={`absolute right-3 top-3 grid size-10 place-items-center rounded-full border backdrop-blur-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 ${
            isFavourite
              ? 'border-rose-200 bg-white text-rose-500'
              : 'border-white/50 bg-black/20 text-white hover:bg-white hover:text-rose-500'
          }`}
        >
          <Heart
            size={19}
            className={isFavourite ? 'fill-current' : ''}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-stone-800">
            {photo.author}
          </p>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-stone-400">
            Collection {photo.id}
          </p>
        </div>

        {isFavourite && (
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-500">
            Saved
          </span>
        )}
      </div>
    </article>
  )
}

function GallerySkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      role="status"
      aria-label="Loading photos"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[1.35rem] border border-stone-200 bg-white"
        >
          <div className="aspect-[4/3] animate-pulse bg-stone-200" />
          <div className="h-16 animate-pulse bg-stone-100" />
        </div>
      ))}
      <span className="sr-only">Loading photos...</span>
    </div>
  )
}

export default function App() {
  const { photos, loading, error } = useFetchPhotos()
  const { favourites, toggleFavourite } = useFavourites()
  const [query, setQuery] = useState('')

  const handleSearch = useCallback((event) => {
    setQuery(event.target.value)
  }, [])

  const filteredPhotos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) return photos

    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(normalizedQuery)
    )
  }, [photos, query])

  return (
    <main className="min-h-screen w-full bg-[#f7f5f1] text-stone-900">
      <header className="border-b border-stone-200/80 bg-[#f7f5f1]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-stone-900 text-white">
  
            </span>

            <span className="text-sm font-semibold tracking-[0.2em] text-stone-900">
              FRAME / 30
            </span>
          </div>

          <span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-stone-400 sm:block">
            A little visual archive
          </span>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:px-12">
        <section className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-500">
              <ImageIcon size={14} aria-hidden="true" />
              Curated moments
            </p>

            <h1 className="font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-stone-950 sm:text-6xl">
              Find a little
              <br />
              <em className="font-normal text-stone-500">
                inspiration.
              </em>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-stone-500">
              Thirty corners of the world, ready to be explored.
              Search the collection or save the frames that stay
              with you.
            </p>
          </div>

          <div className="w-full max-w-sm">
            <label
              htmlFor="photo-search"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-500"
            >
              Search by photographer
            </label>

            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                size={18}
                aria-hidden="true"
              />

              <input
                id="photo-search"
                type="search"
                value={query}
                onChange={handleSearch}
                placeholder="Try “Paul” or “Alejandro”"
                className="h-12 w-full rounded-2xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-4 focus:ring-stone-900/5"
              />
            </div>
          </div>
        </section>

        <div className="mb-5 flex items-center justify-between border-b border-stone-200 pb-4">
          <p className="text-sm font-medium text-stone-700">
            {loading
              ? 'Loading collection'
              : `${filteredPhotos.length} ${
                  filteredPhotos.length === 1 ? 'photo' : 'photos'
                }`}
          </p>

          <p className="text-xs uppercase tracking-[0.16em] text-stone-400">
            {favourites.length} saved
          </p>
        </div>

        {loading && <GallerySkeleton />}

        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-6 text-sm text-rose-700"
          >
            {String(error)}
          </div>
        )}

        {!loading && !error && filteredPhotos.length === 0 && (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-16 text-center text-stone-500">
            No photographers match “{query}”.
          </div>
        )}

        {!loading && !error && filteredPhotos.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFavourite={favourites.includes(photo.id)}
                onToggle={() => toggleFavourite(photo.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
