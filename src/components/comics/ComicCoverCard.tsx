type ComicCoverCardProps = {
  title: string
  coverUrl: string | null
}

export default function ComicCoverCard({
  title,
  coverUrl,
}: ComicCoverCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
      {coverUrl ? (
        <img src={coverUrl} alt={title} className="h-80 w-full object-cover" />
      ) : (
        <div className="flex h-80 items-center justify-center bg-neutral-800 text-xs text-neutral-400">
          No cover
        </div>
      )}
    </div>
  )
}
