import { Link, useParams } from 'react-router-dom'
import ChaptersList from '../components/comics/ChaptersList'
import ComicCoverCard from '../components/comics/ComicCoverCard'
import FavoriteButton from '../components/favorites/FavoriteButton'
import useComicDetail from '../hooks/useComicDetail'

// Display comic details and list of chapters
export default function ComicDetail() {
  const { id } = useParams()
  const { comic, chapters, error, isFavorite, favoriteLoading, toggleFavorite } =
    useComicDetail(id)

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <Link to="/" className="text-xs text-neutral-400 hover:text-neutral-200">
        Back to browse
      </Link>

      {error ? (
        <div className="mt-4 text-sm text-red-400">{error}</div>
      ) : null}

      {comic ? (
        <div className="mt-4 grid gap-6 md:grid-cols-[240px,1fr]">
          <ComicCoverCard title={comic.title} coverUrl={comic.cover_url} />

          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                {comic.title}
              </h1>
              <FavoriteButton
                isFavorite={isFavorite}
                loading={favoriteLoading}
                onToggle={toggleFavorite}
              />
            </div>
            {comic.author ? (
              <p className="mt-2 text-sm text-neutral-400">
                {comic.author}
              </p>
            ) : null}
            {comic.description ? (
              <p className="mt-4 text-sm text-neutral-300">
                {comic.description}
              </p>
            ) : null}

            <ChaptersList chapters={chapters} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
