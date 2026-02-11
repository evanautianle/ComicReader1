import { Link } from 'react-router-dom'

type ComicCardProps = {
  id: string
  title: string
  coverUrl: string | null
}

export default function ComicCard({ id, title, coverUrl }: ComicCardProps) {
  return (
    <Link
      to={`/comic/${id}`}
      className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 transition hover:border-neutral-700"
    >
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={title}
          className="h-70 w-full object-cover"
        />
      ) : (
        <div className="flex h-70 items-center justify-center bg-neutral-800 text-xs text-neutral-400">
          No cover
        </div>
      )}
      <div className="px-3 py-2">
        <div className="text-sm font-semibold">{title}</div>
      </div>
    </Link>
  )
}
