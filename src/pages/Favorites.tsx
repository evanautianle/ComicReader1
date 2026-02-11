import { Link } from 'react-router-dom'
import FavoritesGrid from '../components/favorites/FavoritesGrid'
import useFavorites from '../hooks/useFavorites'

export default function Favorites() {
  const { favorites, error } = useFavorites()

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-xs text-neutral-400 hover:text-neutral-200">
          Back to browse
        </Link>
        <span className="text-xs text-neutral-500">Your favorites</span>
      </div>

      {error ? <div className="mt-4 text-sm text-red-400">{error}</div> : null}

      {error ? null : <FavoritesGrid favorites={favorites} />}
    </div>
  )
}
