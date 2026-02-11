import { Link } from 'react-router-dom'

type FavoriteComic = {
  id: string
  title: string
  cover_url: string | null
}

type FavoriteCardProps = {
  comic: FavoriteComic
  favoriteId: number
}

export default function FavoriteCard({ comic, favoriteId }: FavoriteCardProps) {
  return (
    <Link
      key={favoriteId}
      to={`/comic/${comic.id}`}
      className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 transition hover:border-neutral-700"
    >
      {comic.cover_url ? (
        <img
          src={comic.cover_url}
          alt={comic.title}
          className="h-70 w-full object-cover"
        />
      ) : (
        <div className="flex h-70 items-center justify-center bg-neutral-800 text-xs text-neutral-400">
          No cover
        </div>
      )}
      <div className="px-3 py-2">
        <div className="text-sm font-semibold">{comic.title}</div>
      </div>
    </Link>
  )
}
