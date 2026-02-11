import { Link } from 'react-router-dom'

type Chapter = {
  id: string
  title: string | null
  number: number | null
}

type ChaptersListProps = {
  chapters: Chapter[]
}

export default function ChaptersList({ chapters }: ChaptersListProps) {
  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold text-neutral-200">Chapters</h2>
      <div className="mt-2 grid gap-2">
        {chapters.map((chapter) => (
          <Link
            key={chapter.id}
            to={`/reader/${chapter.id}`}
            className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 hover:border-neutral-700"
          >
            <span>
              {chapter.number ? `Chapter ${chapter.number}` : 'Chapter'}
              {chapter.title ? ` · ${chapter.title}` : ''}
            </span>
            <span className="text-xs text-neutral-400">Read</span>
          </Link>
        ))}
        {chapters.length === 0 ? (
          <div className="text-xs text-neutral-400">No chapters yet.</div>
        ) : null}
      </div>
    </div>
  )
}
