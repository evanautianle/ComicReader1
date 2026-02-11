import { Link } from 'react-router-dom'
import useUserActivity from '../hooks/useUserActivity'

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString()
}

export default function Activity() {
  const { ratings, comments, loading, error } = useUserActivity()

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-xs text-neutral-400 hover:text-neutral-200">
          Back to browse
        </Link>
        <span className="text-xs text-neutral-500">Your activity</span>
      </div>

      {error ? <div className="mt-4 text-sm text-red-400">{error}</div> : null}

      {loading ? (
        <div className="mt-6 text-sm text-neutral-400">Loading activity...</div>
      ) : null}

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-neutral-100">Your ratings</h2>
        {ratings.length === 0 && !loading ? (
          <p className="mt-3 text-sm text-neutral-400">No ratings yet.</p>
        ) : null}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {ratings.map((row) => (
            <div
              key={row.id}
              className="flex gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-4"
            >
              {row.comic?.cover_url ? (
                <img
                  src={row.comic.cover_url}
                  alt={row.comic.title}
                  className="h-24 w-16 rounded-md object-cover"
                />
              ) : (
                <div className="flex h-24 w-16 items-center justify-center rounded-md bg-neutral-800 text-[11px] text-neutral-400">
                  No cover
                </div>
              )}
              <div className="flex-1">
                <Link
                  to={`/comic/${row.comic?.id ?? ''}`}
                  className="text-sm font-semibold text-neutral-100 hover:text-neutral-200"
                >
                  {row.comic?.title ?? 'Unknown comic'}
                </Link>
                <div className="mt-1 text-xs text-neutral-400">
                  Rated {row.rating}/5
                </div>
                <div className="text-[11px] text-neutral-500">
                  {formatDate(row.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-neutral-100">Your comments</h2>
        {comments.length === 0 && !loading ? (
          <p className="mt-3 text-sm text-neutral-400">No comments yet.</p>
        ) : null}
        <div className="mt-4 grid gap-4">
          {comments.map((row) => (
            <div
              key={row.id}
              className="rounded-lg border border-neutral-800 bg-neutral-900 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <Link
                  to={`/comic/${row.comic?.id ?? ''}`}
                  className="text-sm font-semibold text-neutral-100 hover:text-neutral-200"
                >
                  {row.comic?.title ?? 'Unknown comic'}
                </Link>
                <span className="text-[11px] text-neutral-500">
                  {formatDate(row.created_at)}
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-200">{row.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
