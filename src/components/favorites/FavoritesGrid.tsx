import FavoriteCard from './FavoriteCard'

type FavoriteComic = {
  id: string
  title: string
  cover_url: string | null
}

type FavoriteRow = {
  id: number
  comic: FavoriteComic | null
}

type FavoritesGridProps = {
  favorites: FavoriteRow[]
}

export default function FavoritesGrid({ favorites }: FavoritesGridProps) {
  if (favorites.length === 0) {
    return (
      <div className="mt-6 text-sm text-neutral-400">No favorites yet.</div>
    )
  }

  return (
    <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
      {favorites.map((favorite) =>
        favorite.comic ? (
          <FavoriteCard
            key={favorite.id}
            favoriteId={favorite.id}
            comic={favorite.comic}
          />
        ) : null,
      )}
    </div>
  )
}
